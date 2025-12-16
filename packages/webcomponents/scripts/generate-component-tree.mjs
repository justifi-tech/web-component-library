import { createRequire } from 'module';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname, relative, resolve } from 'path';
import { fileURLToPath } from 'url';
import glob from 'fast-glob';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import TypeScript parser
const { parse } = require('@typescript-eslint/typescript-estree');

const COMPONENTS_DIR = join(__dirname, '../src');
const PARTS_FILE = join(__dirname, '../src/styles/parts.ts');
const OUTPUT_FILE = join(__dirname, '../../../docs/component-tree.json');

// AST Node Type Constants
const NODE_TYPES = {
  IMPORT_DECLARATION: 'ImportDeclaration',
  EXPORT_NAMED_DECLARATION: 'ExportNamedDeclaration',
  EXPORT_DEFAULT_DECLARATION: 'ExportDefaultDeclaration',
  CLASS_DECLARATION: 'ClassDeclaration',
  VARIABLE_DECLARATION: 'VariableDeclaration',
  FUNCTION_DECLARATION: 'FunctionDeclaration',
  ARROW_FUNCTION_EXPRESSION: 'ArrowFunctionExpression',
  FUNCTION_EXPRESSION: 'FunctionExpression',
  VARIABLE_DECLARATOR: 'VariableDeclarator',
  IDENTIFIER: 'Identifier',
  IMPORT_SPECIFIER: 'ImportSpecifier',
  CALL_EXPRESSION: 'CallExpression',
  OBJECT_EXPRESSION: 'ObjectExpression',
  JSX_ELEMENT: 'JSXElement',
  JSX_FRAGMENT: 'JSXFragment',
  JSX_OPENING_ELEMENT: 'JSXOpeningElement',
  JSX_CLOSING_ELEMENT: 'JSXClosingElement',
  JSX_EXPRESSION_CONTAINER: 'JSXExpressionContainer',
  JSX_IDENTIFIER: 'JSXIdentifier',
  JSX_MEMBER_EXPRESSION: 'JSXMemberExpression',
};

// Regex Patterns
const REGEX_PATTERNS = {
  EXPORT_STATEMENT: /export\s+(?:const|function)\s+(\w+)\s*=/g,
  FILE_EXTENSION: /\.(ts|tsx|js|jsx)$/,
  PASCAL_CASE: /^[A-Z]/,
  KEBAB_CASE_CONVERSION: /([A-Z])/g,
  LEADING_HYPHEN: /^-/,
  JUSTIFI_PREFIX: /^justifi-/,
  PATH_SEPARATOR: /\\/g,
};

// Parts Import Patterns
const PARTS_IMPORT_PATTERNS = [
  /styles\/parts$/,
  /\.\.\/.*styles\/parts$/,
  /@packages\/webcomponents\/src\/styles\/parts/,
  /packages\/webcomponents\/src\/styles\/parts/,
];

// Keys to skip during AST traversal
const SKIP_KEYS = new Set(['parent', 'range', 'loc']);

/**
 * Normalize path separators (Windows to Unix style)
 */
function normalizePath(path) {
  return path.replace(REGEX_PATTERNS.PATH_SEPARATOR, '/');
}

/**
 * Extract JSX element name from a JSX node
 */
function extractJSXElementName(node) {
  if (!node) return null;

  const jsxName = node.name || node.openingElement?.name;
  if (!jsxName) return null;

  if (jsxName.type === NODE_TYPES.JSX_IDENTIFIER) {
    return jsxName.name;
  }

  if (jsxName.type === NODE_TYPES.JSX_MEMBER_EXPRESSION) {
    return jsxName.object?.name || null;
  }

  return null;
}

/**
 * Traverse AST with visitor callbacks
 */
function traverseAST(node, visitors = {}) {
  if (!node) return;

  // Call visitor for this node type if provided
  const nodeType = node.type;
  if (nodeType && visitors[nodeType]) {
    visitors[nodeType](node);
  }

  // Call generic visitor if provided
  if (visitors.visit) {
    visitors.visit(node);
  }

  // Recursively traverse children
  for (const key in node) {
    if (SKIP_KEYS.has(key)) continue;

    const child = node[key];
    if (Array.isArray(child)) {
      child.forEach((item) => traverseAST(item, visitors));
    } else if (child && typeof child === 'object') {
      traverseAST(child, visitors);
    }
  }
}

/**
 * Extract all exported part names from parts.ts
 */
function getAvailableParts() {
  try {
    const partsContent = readFileSync(PARTS_FILE, 'utf-8');
    const parts = new Set();

    // Match export const/export statements
    const exportRegex = new RegExp(REGEX_PATTERNS.EXPORT_STATEMENT.source, 'g');
    let match;
    while ((match = exportRegex.exec(partsContent)) !== null) {
      parts.add(match[1]);
    }

    return parts;
  } catch (error) {
    console.error('Error reading parts.ts:', error);
    return new Set();
  }
}

/**
 * Check if a file path is importing from parts.ts
 */
function isPartsImport(sourcePath, filePath) {
  if (!sourcePath) return false;

  // Remove file extension if present
  const normalizedSource = sourcePath.replace(
    REGEX_PATTERNS.FILE_EXTENSION,
    ''
  );

  // Try to resolve the import path relative to the file
  try {
    const fileDir = dirname(filePath);
    const resolvedPath = normalizePath(resolve(fileDir, normalizedSource));
    const partsPath = normalizePath(
      PARTS_FILE.replace(REGEX_PATTERNS.FILE_EXTENSION, '')
    );

    if (resolvedPath === partsPath) {
      return true;
    }
  } catch (e) {
    // If resolution fails, fall back to pattern matching
  }

  // Pattern matching fallback
  return PARTS_IMPORT_PATTERNS.some((pattern) =>
    pattern.test(normalizedSource)
  );
}

/**
 * Extract parts imports from AST
 */
function extractPartsImports(ast, filePath, availableParts) {
  const partsImports = new Set();

  traverseAST(ast, {
    [NODE_TYPES.IMPORT_DECLARATION]: (node) => {
      const source = node.source?.value;
      if (isPartsImport(source, filePath)) {
        node.specifiers?.forEach((spec) => {
          if (spec.type === NODE_TYPES.IMPORT_SPECIFIER) {
            const importedName = spec.imported?.name || spec.imported?.value;
            if (importedName && availableParts.has(importedName)) {
              partsImports.add(importedName);
            }
          }
        });
      }
    },
  });

  return partsImports;
}

/**
 * Check if a node contains JSX syntax
 */
function containsJSX(node) {
  if (!node) return false;

  const jsxTypes = [
    NODE_TYPES.JSX_ELEMENT,
    NODE_TYPES.JSX_FRAGMENT,
    NODE_TYPES.JSX_OPENING_ELEMENT,
    NODE_TYPES.JSX_CLOSING_ELEMENT,
    NODE_TYPES.JSX_EXPRESSION_CONTAINER,
  ];

  if (jsxTypes.includes(node.type)) {
    return true;
  }

  // Recursively check children
  for (const key in node) {
    if (SKIP_KEYS.has(key)) continue;
    const child = node[key];
    if (Array.isArray(child)) {
      if (child.some((item) => containsJSX(item))) return true;
    } else if (child && typeof child === 'object') {
      if (containsJSX(child)) return true;
    }
  }

  return false;
}

/**
 * Find a variable declaration by name in the AST
 */
function findVariableDeclarationByName(ast, variableName) {
  let foundDeclarator = null;

  traverseAST(ast, {
    [NODE_TYPES.VARIABLE_DECLARATION]: (node) => {
      if (foundDeclarator) return;

      node.declarations?.forEach((declarator) => {
        if (
          declarator.id?.type === NODE_TYPES.IDENTIFIER &&
          declarator.id.name === variableName
        ) {
          foundDeclarator = declarator;
        }
      });
    },
  });

  return foundDeclarator;
}

/**
 * Process a variable declarator to check if it's a utility function
 */
function processVariableDeclarator(
  declarator,
  partsImports,
  utilityFunctionMap,
  utilityFunctions
) {
  if (declarator.id?.type !== NODE_TYPES.IDENTIFIER) return;

  const name = declarator.id.name;
  // Check if PascalCase (starts with uppercase) and is a function
  if (!REGEX_PATTERNS.PASCAL_CASE.test(name)) return;
  if (!isFunctionNode(declarator.init)) return;

  // Check if it uses parts or renders JSX
  const usesParts = partsImports.size > 0;
  const rendersJSX = containsJSX(declarator.init);

  if (usesParts || rendersJSX) {
    // Check if already added (avoid duplicates)
    if (!utilityFunctionMap.has(name)) {
      const utilityFunction = {
        name,
        parts: Array.from(partsImports),
        filePath: null, // Will be set by caller
        jsxElements: new Set(),
      };
      utilityFunctionMap.set(name, utilityFunction);
      utilityFunctions.push(utilityFunction);
    }
  }
}

/**
 * Process an export declaration node to find utility functions
 */
function processExportDeclaration(
  exportNode,
  ast,
  partsImports,
  utilityFunctionMap,
  utilityFunctions
) {
  const declaration = exportNode.declaration;
  if (!declaration) return;

  // Handle variable declaration exports
  if (declaration.type === NODE_TYPES.VARIABLE_DECLARATION) {
    declaration.declarations?.forEach((declarator) => {
      processVariableDeclarator(
        declarator,
        partsImports,
        utilityFunctionMap,
        utilityFunctions
      );
    });
  }
  // Handle identifier exports (references a variable declared elsewhere)
  else if (declaration.type === NODE_TYPES.IDENTIFIER) {
    const variableName = declaration.name;
    if (variableName && REGEX_PATTERNS.PASCAL_CASE.test(variableName)) {
      const declarator = findVariableDeclarationByName(ast, variableName);
      if (declarator) {
        processVariableDeclarator(
          declarator,
          partsImports,
          utilityFunctionMap,
          utilityFunctions
        );
      }
    }
  }
}

/**
 * Find utility function declarations in AST
 */
function findUtilityFunctionDeclarations(ast, partsImports) {
  const utilityFunctions = [];
  const utilityFunctionMap = new Map();

  traverseAST(ast, {
    [NODE_TYPES.EXPORT_NAMED_DECLARATION]: (node) => {
      processExportDeclaration(
        node,
        ast,
        partsImports,
        utilityFunctionMap,
        utilityFunctions
      );
    },
    [NODE_TYPES.EXPORT_DEFAULT_DECLARATION]: (node) => {
      processExportDeclaration(
        node,
        ast,
        partsImports,
        utilityFunctionMap,
        utilityFunctions
      );
    },
  });

  return { utilityFunctions, utilityFunctionMap };
}

/**
 * Extract utility functions from AST
 */
function extractUtilityFunctions(ast, filePath, availableParts) {
  // Extract parts imports first
  const partsImports = extractPartsImports(ast, filePath, availableParts);

  // Find utility function declarations
  const { utilityFunctions, utilityFunctionMap } =
    findUtilityFunctionDeclarations(ast, partsImports);

  // Set file path for all utility functions
  utilityFunctions.forEach((uf) => {
    uf.filePath = filePath;
  });

  // Extract JSX elements from each utility function's body
  for (const utilityFunction of utilityFunctions) {
    const functionBody = findUtilityFunctionBody(ast, utilityFunction.name);
    if (functionBody) {
      extractJSXElements(functionBody, utilityFunction.jsxElements);
    }
  }

  return utilityFunctions;
}

/**
 * Check if a node is a function (arrow function or function expression)
 */
function isFunctionNode(node) {
  return (
    node &&
    (node.type === NODE_TYPES.ARROW_FUNCTION_EXPRESSION ||
      node.type === NODE_TYPES.FUNCTION_EXPRESSION)
  );
}

/**
 * Extract function body from a variable declarator
 */
function getFunctionBodyFromDeclarator(declarator) {
  const init = declarator?.init;
  return isFunctionNode(init) ? init.body : null;
}

/**
 * Find function body from a variable name in the AST
 */
function findFunctionBodyFromVariable(ast, variableName) {
  const declarator = findVariableDeclarationByName(ast, variableName);
  return declarator ? getFunctionBodyFromDeclarator(declarator) : null;
}

/**
 * Extract function body from an export declaration node
 */
function getFunctionBodyFromExport(exportNode, functionName, ast) {
  const declaration = exportNode.declaration;
  if (!declaration) return null;

  // Handle variable declaration exports
  if (declaration.type === NODE_TYPES.VARIABLE_DECLARATION) {
    for (const declarator of declaration.declarations || []) {
      if (
        declarator.id?.type === NODE_TYPES.IDENTIFIER &&
        declarator.id.name === functionName
      ) {
        const body = getFunctionBodyFromDeclarator(declarator);
        if (body) return body;
      }
    }
  }
  // Handle identifier exports (references a variable declared elsewhere)
  else if (
    declaration.type === NODE_TYPES.IDENTIFIER &&
    declaration.name === functionName
  ) {
    return findFunctionBodyFromVariable(ast, functionName);
  }

  return null;
}

/**
 * Find the body of a utility function by name
 */
function findUtilityFunctionBody(ast, functionName) {
  let foundBody = null;

  traverseAST(ast, {
    [NODE_TYPES.EXPORT_NAMED_DECLARATION]: (node) => {
      if (!foundBody) {
        foundBody = getFunctionBodyFromExport(node, functionName, ast);
      }
    },
    [NODE_TYPES.EXPORT_DEFAULT_DECLARATION]: (node) => {
      if (!foundBody) {
        foundBody = getFunctionBodyFromExport(node, functionName, ast);
      }
    },
    [NODE_TYPES.VARIABLE_DECLARATION]: (node) => {
      if (!foundBody) {
        for (const declarator of node.declarations || []) {
          if (
            declarator.id?.type === NODE_TYPES.IDENTIFIER &&
            declarator.id.name === functionName
          ) {
            foundBody = getFunctionBodyFromDeclarator(declarator);
            if (foundBody) break;
          }
        }
      }
    },
  });

  return foundBody;
}

/**
 * Extract JSX element names from a node or AST
 * @param {Object} node - AST node to extract from
 * @param {Set} [targetSet] - Optional set to add elements to. If not provided, creates a new Set.
 * @returns {Set} Set of JSX element names
 */
function extractJSXElements(node, targetSet = new Set()) {
  if (!node) return targetSet;

  traverseAST(node, {
    [NODE_TYPES.JSX_OPENING_ELEMENT]: (node) => {
      const elementName = extractJSXElementName(node);
      if (elementName) {
        targetSet.add(elementName);
      }
    },
    [NODE_TYPES.JSX_ELEMENT]: (node) => {
      const elementName = extractJSXElementName(node);
      if (elementName) {
        targetSet.add(elementName);
      }
    },
  });

  return targetSet;
}

/**
 * Extract component decorator from AST
 */
function extractComponentDecorator(ast) {
  let componentDecorator = null;

  traverseAST(ast, {
    [NODE_TYPES.CLASS_DECLARATION]: (node) => {
      if (node.decorators) {
        node.decorators.forEach((decorator) => {
          if (
            decorator.expression?.type === NODE_TYPES.CALL_EXPRESSION &&
            decorator.expression.callee?.name === 'Component'
          ) {
            componentDecorator = decorator.expression;
          }
        });
      }
    },
  });

  return componentDecorator;
}

/**
 * Extract tag and shadow DOM setting from component decorator
 */
function extractDecoratorMetadata(componentDecorator) {
  const metadata = { tag: null, shadowDom: false };

  if (!componentDecorator) return metadata;

  const args = componentDecorator.arguments?.[0];
  if (args?.type === NODE_TYPES.OBJECT_EXPRESSION) {
    args.properties?.forEach((prop) => {
      if (prop.key?.name === 'tag' && prop.value?.value) {
        metadata.tag = prop.value.value;
      }
      if (prop.key?.name === 'shadow') {
        metadata.shadowDom = prop.value?.value === true;
      }
    });
  }

  return metadata;
}

/**
 * Check if a declaration is a functional component
 */
function isFunctionalComponentDeclaration(declaration) {
  return (
    declaration?.type === NODE_TYPES.FUNCTION_DECLARATION ||
    declaration?.type === NODE_TYPES.ARROW_FUNCTION_EXPRESSION ||
    declaration?.type === NODE_TYPES.VARIABLE_DECLARATOR
  );
}

/**
 * Extract functional component declaration from AST
 */
function extractFunctionalComponent(ast) {
  let exportedFunction = null;

  traverseAST(ast, {
    [NODE_TYPES.EXPORT_NAMED_DECLARATION]: (node) => {
      if (
        !exportedFunction &&
        isFunctionalComponentDeclaration(node.declaration)
      ) {
        exportedFunction = node.declaration;
      }
    },
    [NODE_TYPES.EXPORT_DEFAULT_DECLARATION]: (node) => {
      if (
        !exportedFunction &&
        isFunctionalComponentDeclaration(node.declaration)
      ) {
        exportedFunction = node.declaration;
      }
    },
  });

  return exportedFunction;
}

/**
 * Convert PascalCase to kebab-case
 */
function pascalToKebabCase(name) {
  return name
    .replace(REGEX_PATTERNS.KEBAB_CASE_CONVERSION, '-$1')
    .toLowerCase()
    .replace(REGEX_PATTERNS.LEADING_HYPHEN, '');
}

/**
 * Extract component tag from decorator or functional component
 */
function extractComponentTag(ast) {
  // Try decorator first (for class components)
  const componentDecorator = extractComponentDecorator(ast);
  if (componentDecorator) {
    const decoratorMetadata = extractDecoratorMetadata(componentDecorator);
    if (decoratorMetadata.tag) {
      return decoratorMetadata.tag;
    }
  }

  // Try functional component (infer tag from export name)
  const exportedFunction = extractFunctionalComponent(ast);
  if (exportedFunction?.id?.name) {
    return pascalToKebabCase(exportedFunction.id.name);
  }

  return null;
}

/**
 * Extract shadow DOM setting from component decorator
 */
function extractComponentShadowDom(ast) {
  const componentDecorator = extractComponentDecorator(ast);
  if (componentDecorator) {
    const decoratorMetadata = extractDecoratorMetadata(componentDecorator);
    return decoratorMetadata.shadowDom;
  }
  return false;
}

/**
 * Extract component metadata from AST
 */
function extractComponentMetadata(ast, filePath, availableParts) {
  const partsImports = extractPartsImports(ast, filePath, availableParts);
  const exportedFunction = extractFunctionalComponent(ast);

  return {
    tag: extractComponentTag(ast),
    shadowDom: extractComponentShadowDom(ast),
    parts: Array.from(partsImports),
    isFunctional: !!exportedFunction,
    jsxElements: extractJSXElements(ast),
  };
}

/**
 * Find matching component for an element name
 */
function findMatchingComponent(elementName, componentMap) {
  // Try exact match first
  if (componentMap.has(elementName)) {
    return elementName;
  }

  // Try matching without justifi- prefix
  const elementWithoutPrefix = elementName.replace(
    REGEX_PATTERNS.JUSTIFI_PREFIX,
    ''
  );
  for (const [tag] of componentMap.entries()) {
    const tagWithoutPrefix = tag.replace(REGEX_PATTERNS.JUSTIFI_PREFIX, '');
    if (tagWithoutPrefix === elementWithoutPrefix) {
      return tag;
    }
  }

  // Try substring match at the end (e.g., "card-form" matches "justifi-card-form")
  for (const [tag] of componentMap.entries()) {
    if (tag.endsWith(elementName) && tag.length > elementName.length) {
      return tag;
    }
  }

  return null;
}

/**
 * Build a child node from a component or utility function
 */
function buildChildNode(item, componentMap, utilityFunctionMap, visited) {
  const relativePath = normalizePath(relative(COMPONENTS_DIR, item.filePath));
  const childVisited = new Set(visited);
  const children = buildChildren(
    item,
    componentMap,
    utilityFunctionMap,
    childVisited
  );

  return {
    tag: item.tag || item.name,
    filePath: relativePath,
    shadowDom: item.shadowDom ?? false,
    parts: item.parts,
    ...(item.isUtility && { isUtility: true }),
    children,
  };
}

/**
 * Find child components and utility functions from JSX elements
 */
function findChildComponents(
  jsxElements,
  compId,
  componentMap,
  utilityFunctionMap
) {
  const children = [];

  jsxElements.forEach((elementName) => {
    // Skip if it's the same component/utility (avoid self-reference)
    if (elementName === compId) return;

    // Check if it's a PascalCase utility function
    if (REGEX_PATTERNS.PASCAL_CASE.test(elementName)) {
      if (utilityFunctionMap.has(elementName)) {
        children.push({ name: elementName, isUtility: true });
        return;
      }
    }

    // Try to find matching component
    const matchingTag = findMatchingComponent(elementName, componentMap);
    if (matchingTag) {
      children.push({ tag: matchingTag, isUtility: false });
    }
  });

  return children;
}

/**
 * Remove duplicate children based on their key (name or tag)
 */
function deduplicateChildren(children) {
  const uniqueChildren = [];
  const seen = new Set();

  children.forEach((child) => {
    const key = child.isUtility ? child.name : child.tag;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueChildren.push(child);
    }
  });

  return uniqueChildren;
}

/**
 * Recursively build children for a component or utility function
 */
function buildChildren(
  comp,
  componentMap,
  utilityFunctionMap,
  visited = new Set()
) {
  const compId = comp.tag || comp.name;
  if (visited.has(compId)) {
    return []; // Avoid circular dependencies
  }
  visited.add(compId);

  // Find and deduplicate children
  const children = findChildComponents(
    comp.jsxElements,
    compId,
    componentMap,
    utilityFunctionMap
  );
  const uniqueChildren = deduplicateChildren(children);

  // Build child nodes recursively
  return uniqueChildren
    .map((child) => {
      if (child.isUtility) {
        const utilityFunc = utilityFunctionMap.get(child.name);
        return utilityFunc
          ? buildChildNode(
              utilityFunc,
              componentMap,
              utilityFunctionMap,
              visited
            )
          : null;
      } else {
        const childComp = componentMap.get(child.tag);
        return childComp
          ? buildChildNode(childComp, componentMap, utilityFunctionMap, visited)
          : null;
      }
    })
    .filter(Boolean);
}

/**
 * Build component dependency tree
 */
function buildDependencyTree(components, utilityFunctions = []) {
  const tree = {};
  const componentMap = new Map();
  const utilityFunctionMap = new Map();

  // Create a map of tag -> component
  components.forEach((comp) => {
    if (comp.tag) {
      componentMap.set(comp.tag, comp);
    }
  });

  // Create a map of name -> utility function
  utilityFunctions.forEach((utilFunc) => {
    utilityFunctionMap.set(utilFunc.name, utilFunc);
  });

  // Build tree structure
  components.forEach((comp) => {
    if (!comp.tag) return;

    const relativePath = normalizePath(relative(COMPONENTS_DIR, comp.filePath));
    const children = buildChildren(
      comp,
      componentMap,
      utilityFunctionMap,
      new Set()
    );

    tree[comp.tag] = {
      tag: comp.tag,
      filePath: relativePath,
      shadowDom: comp.shadowDom,
      parts: comp.parts,
      children: children,
    };
  });

  return tree;
}

/**
 * Main function
 */
async function main() {
  console.log('Generating component dependency tree...');

  // Get available parts
  const availableParts = getAvailableParts();
  console.log(`Found ${availableParts.size} available parts`);

  // Find all component files
  const componentFiles = await glob('**/*.tsx', {
    cwd: COMPONENTS_DIR,
    absolute: true,
    ignore: ['**/*.spec.tsx', '**/*.test.tsx', '**/test/**', '**/__tests__/**'],
  });

  console.log(`Found ${componentFiles.length} component files`);

  const components = [];
  const utilityFunctions = [];

  // Parse each component file
  for (const filePath of componentFiles) {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const ast = parse(content, {
        jsx: true,
        loc: false,
        range: false,
      });

      const metadata = extractComponentMetadata(ast, filePath, availableParts);

      if (metadata.tag || metadata.isFunctional) {
        metadata.filePath = filePath;
        components.push(metadata);
      }

      // Extract utility functions from the same file
      const utils = extractUtilityFunctions(ast, filePath, availableParts);
      utilityFunctions.push(...utils);
    } catch (error) {
      console.warn(`Error parsing ${filePath}:`, error.message);
    }
  }

  console.log(`Parsed ${components.length} components`);
  console.log(`Found ${utilityFunctions.length} utility functions`);

  // Build dependency tree
  const tree = buildDependencyTree(components, utilityFunctions);

  // Ensure output directory exists
  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });

  // Write JSON output
  const output = {
    components: tree,
    generatedAt: new Date().toISOString(),
  };

  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');

  console.log(`Component tree written to ${OUTPUT_FILE}`);
  console.log(
    `Generated tree with ${Object.keys(tree).length} root components`
  );
}

// Run the script
main().catch((error) => {
  console.error('Error generating component tree:', error);
  process.exit(1);
});

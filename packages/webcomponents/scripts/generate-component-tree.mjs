import { createRequire } from 'module';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname, relative, resolve, normalize } from 'path';
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

/**
 * Extract all exported part names from parts.ts
 */
function getAvailableParts() {
  try {
    const partsContent = readFileSync(PARTS_FILE, 'utf-8');
    const parts = new Set();

    // Match export const/export statements
    const exportRegex = /export\s+(?:const|function)\s+(\w+)\s*=/g;
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
  const normalizedSource = sourcePath.replace(/\.(ts|tsx|js|jsx)$/, '');

  // Try to resolve the import path relative to the file
  try {
    const fileDir = dirname(filePath);
    const resolvedPath = resolve(fileDir, normalizedSource).replace(/\\/g, '/');
    const partsPath = PARTS_FILE.replace(/\.ts$/, '').replace(/\\/g, '/');

    if (resolvedPath === partsPath) {
      return true;
    }
  } catch (e) {
    // If resolution fails, fall back to pattern matching
  }

  // Pattern matching fallback
  const patterns = [
    /styles\/parts$/,
    /\.\.\/.*styles\/parts$/,
    /@packages\/webcomponents\/src\/styles\/parts/,
    /packages\/webcomponents\/src\/styles\/parts/,
  ];

  return patterns.some((pattern) => pattern.test(normalizedSource));
}

/**
 * Check if a node contains JSX syntax
 */
function containsJSX(node) {
  if (!node) return false;

  if (
    node.type === 'JSXElement' ||
    node.type === 'JSXFragment' ||
    node.type === 'JSXOpeningElement' ||
    node.type === 'JSXClosingElement' ||
    node.type === 'JSXExpressionContainer'
  ) {
    return true;
  }

  // Recursively check children
  for (const key in node) {
    if (key === 'parent' || key === 'range' || key === 'loc') continue;
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
 * Extract utility functions from AST
 */
function extractUtilityFunctions(ast, filePath, availableParts) {
  const utilityFunctions = [];
  const partsImports = new Set();
  let hasPartsImport = false;
  const utilityFunctionMap = new Map(); // Track utility functions by name to extract their JSX elements

  function traverse(node) {
    if (!node) return;

    // Check for imports from parts.ts
    if (node.type === 'ImportDeclaration') {
      const source = node.source?.value;
      if (isPartsImport(source, filePath)) {
        hasPartsImport = true;
        node.specifiers?.forEach((spec) => {
          if (spec.type === 'ImportSpecifier') {
            const importedName = spec.imported?.name || spec.imported?.value;
            if (importedName && availableParts.has(importedName)) {
              partsImports.add(importedName);
            }
          }
        });
      }
    }

    // Check for exported const declarations with PascalCase names
    if (node.type === 'ExportNamedDeclaration') {
      const declaration = node.declaration;

      // Handle: export const UtilityName = ... or export const UtilityName: Type = ...
      if (declaration?.type === 'VariableDeclaration') {
        declaration.declarations?.forEach((declarator) => {
          if (declarator.id?.type === 'Identifier') {
            const name = declarator.id.name;
            // Check if PascalCase (starts with uppercase)
            if (/^[A-Z]/.test(name)) {
              const init = declarator.init;
              // Check if it's a function (arrow function or function expression)
              if (
                init &&
                (init.type === 'ArrowFunctionExpression' ||
                  init.type === 'FunctionExpression')
              ) {
                // Check if it uses parts or renders JSX
                const usesParts = hasPartsImport && partsImports.size > 0;
                const rendersJSX = containsJSX(init);

                if (usesParts || rendersJSX) {
                  // Check if already added (avoid duplicates)
                  if (!utilityFunctionMap.has(name)) {
                    const utilityFunction = {
                      name: name,
                      parts: Array.from(partsImports),
                      filePath: filePath,
                      jsxElements: new Set(),
                    };
                    utilityFunctionMap.set(name, utilityFunction);
                    utilityFunctions.push(utilityFunction);
                  }
                }
              }
            }
          }
        });
      }
    }

    // Extract JSX element names from utility function bodies
    if (node.type === 'JSXOpeningElement' || node.type === 'JSXElement') {
      const jsxName = node.name || node.openingElement?.name;
      let elementName = null;

      if (jsxName) {
        if (jsxName.type === 'JSXIdentifier') {
          elementName = jsxName.name;
        } else if (jsxName.type === 'JSXMemberExpression') {
          elementName = jsxName.object?.name;
        }
      }

      if (elementName) {
        // Find which utility function this JSX belongs to by traversing up the tree
        // For simplicity, we'll extract JSX from all utility functions
        utilityFunctionMap.forEach((uf) => {
          uf.jsxElements.add(elementName);
        });
      }
    }

    // Recursively traverse children
    for (const key in node) {
      if (key === 'parent' || key === 'range' || key === 'loc') continue;
      const child = node[key];
      if (Array.isArray(child)) {
        child.forEach((item) => traverse(item));
      } else if (child && typeof child === 'object') {
        traverse(child);
      }
    }
  }

  traverse(ast);

  // Clean up JSX elements - only keep those that are actually used in each utility function
  // We need to traverse each utility function's body separately to get accurate JSX elements
  utilityFunctions.forEach((uf) => {
    // Reset JSX elements and re-extract from the specific function
    uf.jsxElements = new Set();
    const functionBody = findUtilityFunctionBody(ast, uf.name);
    if (functionBody) {
      extractJSXFromNode(functionBody, uf.jsxElements);
    }
  });

  return utilityFunctions;
}

/**
 * Find the body of a utility function by name
 */
function findUtilityFunctionBody(ast, functionName) {
  let foundBody = null;

  function traverse(node) {
    if (!node || foundBody) return;

    if (node.type === 'ExportNamedDeclaration') {
      const declaration = node.declaration;
      if (declaration?.type === 'VariableDeclaration') {
        declaration.declarations?.forEach((declarator) => {
          if (
            declarator.id?.type === 'Identifier' &&
            declarator.id.name === functionName
          ) {
            const init = declarator.init;
            if (
              init &&
              (init.type === 'ArrowFunctionExpression' ||
                init.type === 'FunctionExpression')
            ) {
              foundBody = init.body;
            }
          }
        });
      }
    }

    if (!foundBody) {
      for (const key in node) {
        if (key === 'parent' || key === 'range' || key === 'loc') continue;
        const child = node[key];
        if (Array.isArray(child)) {
          child.forEach((item) => traverse(item));
        } else if (child && typeof child === 'object') {
          traverse(child);
        }
      }
    }
  }

  traverse(ast);
  return foundBody;
}

/**
 * Extract JSX element names from a node
 */
function extractJSXFromNode(node, jsxElements) {
  if (!node) return;

  if (node.type === 'JSXOpeningElement' || node.type === 'JSXElement') {
    const jsxName = node.name || node.openingElement?.name;
    let elementName = null;

    if (jsxName) {
      if (jsxName.type === 'JSXIdentifier') {
        elementName = jsxName.name;
      } else if (jsxName.type === 'JSXMemberExpression') {
        elementName = jsxName.object?.name;
      }
    }

    if (elementName) {
      jsxElements.add(elementName);
    }
  }

  // Recursively traverse children
  for (const key in node) {
    if (key === 'parent' || key === 'range' || key === 'loc') continue;
    const child = node[key];
    if (Array.isArray(child)) {
      child.forEach((item) => extractJSXFromNode(item, jsxElements));
    } else if (child && typeof child === 'object') {
      extractJSXFromNode(child, jsxElements);
    }
  }
}

/**
 * Extract component metadata from AST
 */
function extractComponentMetadata(ast, filePath, availableParts) {
  const metadata = {
    tag: null,
    shadowDom: false,
    parts: [],
    isFunctional: false,
    jsxElements: new Set(),
  };

  // Track imports from parts.ts
  const partsImports = new Set();

  // Track component decorator
  let componentDecorator = null;
  let exportedClass = null;
  let exportedFunction = null;

  function traverse(node) {
    if (!node) return;

    // Check for imports from parts.ts
    if (node.type === 'ImportDeclaration') {
      const source = node.source?.value;
      if (isPartsImport(source, filePath)) {
        node.specifiers?.forEach((spec) => {
          if (spec.type === 'ImportSpecifier') {
            const importedName = spec.imported?.name || spec.imported?.value;
            if (importedName && availableParts.has(importedName)) {
              partsImports.add(importedName);
            }
          }
        });
      }
    }

    // Check for @Component decorator
    if (node.type === 'ClassDeclaration' && node.decorators) {
      node.decorators.forEach((decorator) => {
        if (
          decorator.expression?.type === 'CallExpression' &&
          decorator.expression.callee?.name === 'Component'
        ) {
          componentDecorator = decorator.expression;
          exportedClass = node;
        }
      });
    }

    // Check for exported functional components
    if (
      node.type === 'ExportNamedDeclaration' ||
      node.type === 'ExportDefaultDeclaration'
    ) {
      const declaration = node.declaration;
      if (
        declaration?.type === 'FunctionDeclaration' ||
        declaration?.type === 'ArrowFunctionExpression' ||
        declaration?.type === 'VariableDeclarator'
      ) {
        exportedFunction = declaration;
        metadata.isFunctional = true;
      }
    }

    // Extract JSX element names
    if (node.type === 'JSXOpeningElement' || node.type === 'JSXElement') {
      const jsxName = node.name || node.openingElement?.name;
      let elementName = null;

      if (jsxName) {
        if (jsxName.type === 'JSXIdentifier') {
          elementName = jsxName.name;
        } else if (jsxName.type === 'JSXMemberExpression') {
          // Handle <Component.SubComponent> patterns
          elementName = jsxName.object?.name;
        }
      }

      if (elementName) {
        // Track both kebab-case components (e.g., justifi-card-form)
        // and PascalCase utility functions (e.g., DetailItem)
        metadata.jsxElements.add(elementName);
      }
    }

    // Recursively traverse children
    for (const key in node) {
      if (key === 'parent' || key === 'range' || key === 'loc') continue;
      const child = node[key];
      if (Array.isArray(child)) {
        child.forEach((item) => traverse(item));
      } else if (child && typeof child === 'object') {
        traverse(child);
      }
    }
  }

  traverse(ast);

  // Extract tag and shadow from @Component decorator
  if (componentDecorator) {
    const args = componentDecorator.arguments?.[0];
    if (args?.type === 'ObjectExpression') {
      args.properties?.forEach((prop) => {
        if (prop.key?.name === 'tag' && prop.value?.value) {
          metadata.tag = prop.value.value;
        }
        if (prop.key?.name === 'shadow') {
          metadata.shadowDom = prop.value?.value === true;
        }
      });
    }
  }

  // For functional components, try to infer tag from export name
  if (metadata.isFunctional && !metadata.tag) {
    if (exportedFunction?.id?.name) {
      // Convert PascalCase to kebab-case for functional components
      const name = exportedFunction.id.name;
      metadata.tag = name
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^-/, '');
    }
  }

  // Convert parts imports to array
  metadata.parts = Array.from(partsImports);

  return metadata;
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

  const children = [];

  // Find children by matching JSX elements to component tags and utility function names
  comp.jsxElements.forEach((elementName) => {
    // Skip if it's the same component/utility (avoid self-reference)
    if (elementName === compId) {
      return;
    }

    // Check if it's a PascalCase utility function
    if (/^[A-Z]/.test(elementName)) {
      if (utilityFunctionMap.has(elementName)) {
        children.push({ name: elementName, isUtility: true });
        return;
      }
    }

    // Try exact match first for components
    if (componentMap.has(elementName)) {
      children.push({ tag: elementName, isUtility: false });
      return;
    }

    // Try to find by matching (be more strict) for components
    for (const [tag, childComp] of componentMap.entries()) {
      // Exact match
      if (tag === elementName) {
        children.push({ tag: tag, isUtility: false });
        return;
      }
      // Match without justifi- prefix
      if (
        tag.replace(/^justifi-/, '') === elementName.replace(/^justifi-/, '')
      ) {
        children.push({ tag: tag, isUtility: false });
        return;
      }
      // Match if element name is a substring at the end of tag (e.g., "card-form" matches "justifi-card-form")
      if (tag.endsWith(elementName) && tag.length > elementName.length) {
        children.push({ tag: tag, isUtility: false });
        return;
      }
    }
  });

  // Build child nodes recursively
  const uniqueChildren = [];
  const seen = new Set();
  children.forEach((child) => {
    const key = child.isUtility ? child.name : child.tag;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueChildren.push(child);
    }
  });

  const childNodes = uniqueChildren
    .map((child) => {
      if (child.isUtility) {
        const utilityFunc = utilityFunctionMap.get(child.name);
        if (!utilityFunc) return null;

        const childRelativePath = relative(
          COMPONENTS_DIR,
          utilityFunc.filePath
        ).replace(/\\/g, '/');
        const childVisited = new Set(visited);
        const childChildren = buildChildren(
          utilityFunc,
          componentMap,
          utilityFunctionMap,
          childVisited
        );

        return {
          tag: utilityFunc.name,
          filePath: childRelativePath,
          shadowDom: false,
          parts: utilityFunc.parts,
          isUtility: true,
          children: childChildren,
        };
      } else {
        const childComp = componentMap.get(child.tag);
        if (!childComp) return null;

        const childRelativePath = relative(
          COMPONENTS_DIR,
          childComp.filePath
        ).replace(/\\/g, '/');
        const childVisited = new Set(visited);
        const childChildren = buildChildren(
          childComp,
          componentMap,
          utilityFunctionMap,
          childVisited
        );

        return {
          tag: childComp.tag,
          filePath: childRelativePath,
          shadowDom: childComp.shadowDom,
          parts: childComp.parts,
          children: childChildren,
        };
      }
    })
    .filter(Boolean);

  return childNodes;
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

    const relativePath = relative(COMPONENTS_DIR, comp.filePath).replace(
      /\\/g,
      '/'
    );
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
  // log component names
  console.log('Component names:', componentFiles);

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

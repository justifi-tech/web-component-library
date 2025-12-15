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

const COMPONENTS_DIR = join(__dirname, '../src/components');
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

      if (elementName && /^[a-z]/.test(elementName)) {
        // Kebab-case component names (e.g., justifi-card-form)
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
 * Recursively build children for a component
 */
function buildChildren(comp, componentMap, visited = new Set()) {
  if (visited.has(comp.tag)) {
    return []; // Avoid circular dependencies
  }
  visited.add(comp.tag);

  const children = [];

  // Find children by matching JSX elements to component tags
  comp.jsxElements.forEach((elementName) => {
    // Skip if it's the same component (avoid self-reference)
    if (elementName === comp.tag) {
      return;
    }

    // Try exact match first
    if (componentMap.has(elementName)) {
      children.push(elementName);
      return;
    }

    // Try to find by matching (be more strict)
    for (const [tag, childComp] of componentMap.entries()) {
      // Exact match
      if (tag === elementName) {
        children.push(tag);
        return;
      }
      // Match without justifi- prefix
      if (
        tag.replace(/^justifi-/, '') === elementName.replace(/^justifi-/, '')
      ) {
        children.push(tag);
        return;
      }
      // Match if element name is a substring at the end of tag (e.g., "card-form" matches "justifi-card-form")
      if (tag.endsWith(elementName) && tag.length > elementName.length) {
        children.push(tag);
        return;
      }
    }
  });

  // Build child nodes recursively
  const uniqueChildren = [...new Set(children)];
  const childNodes = uniqueChildren
    .map((childTag) => {
      const childComp = componentMap.get(childTag);
      if (!childComp) return null;

      const childRelativePath = relative(
        COMPONENTS_DIR,
        childComp.filePath
      ).replace(/\\/g, '/');
      const childVisited = new Set(visited);
      const childChildren = buildChildren(
        childComp,
        componentMap,
        childVisited
      );

      return {
        tag: childComp.tag,
        filePath: childRelativePath,
        shadowDom: childComp.shadowDom,
        parts: childComp.parts,
        children: childChildren,
      };
    })
    .filter(Boolean);

  return childNodes;
}

/**
 * Build component dependency tree
 */
function buildDependencyTree(components) {
  const tree = {};
  const componentMap = new Map();

  // Create a map of tag -> component
  components.forEach((comp) => {
    if (comp.tag) {
      componentMap.set(comp.tag, comp);
    }
  });

  // Build tree structure
  components.forEach((comp) => {
    if (!comp.tag) return;

    const relativePath = relative(COMPONENTS_DIR, comp.filePath).replace(
      /\\/g,
      '/'
    );
    const children = buildChildren(comp, componentMap, new Set());

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
    } catch (error) {
      console.warn(`Error parsing ${filePath}:`, error.message);
    }
  }

  console.log(`Parsed ${components.length} components`);

  // Build dependency tree
  const tree = buildDependencyTree(components);

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

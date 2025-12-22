/**
 * Recursively collects parts from a component and its children.
 * Stops recursion if a nested component has shadowDom enabled.
 *
 * @param {Object} component - Component object from the tree
 * @param {boolean} isRoot - Whether this is the root component (first in tree)
 * @returns {Array<string>} Array of part names
 */
function collectPartsRecursive(component, isRoot = false) {
  if (!component) {
    return [];
  }

  const parts = [...(component.parts || [])];

  // If this is not the root and has shadowDom enabled, stop recursion
  if (!isRoot && component.shadowDom === true) {
    return parts;
  }

  // Recursively collect parts from children
  if (component.children && Array.isArray(component.children)) {
    for (const child of component.children) {
      const childParts = collectPartsRecursive(child, false);
      parts.push(...childParts);
    }
  }

  return parts;
}

/**
 * Gets all parts for a component and its children from component-tree.json.
 * Recursively flattens the parts list, stopping recursion when encountering
 * nested components with shadow-dom enabled.
 *
 * @param {string} componentTag - The tag name of the component (e.g., 'justifi-checkout')
 * @param {JSON} componentTree - Component tree JSON object
 * @returns {Array<{name: string}>} Array of part objects with only the name property
 */
export function getComponentParts(componentTag, componentTree) {
  try {
    // Read and parse the JSON file
    const treeData = componentTree;

    // Validate structure
    if (!treeData || !treeData.components) {
      throw new Error(
        'Invalid component tree structure: missing "components" property'
      );
    }

    // Find the component by tag
    const component = treeData.components[componentTag];

    if (!component) {
      throw new Error(
        `Component with tag "${componentTag}" not found in component tree`
      );
    }

    // Collect parts recursively (root component is allowed to have shadowDom)
    const partsArray = collectPartsRecursive(component, true);

    // Remove duplicates and format as objects with only name property
    const uniqueParts = [...new Set(partsArray)];
    const formattedParts = uniqueParts.map((name) => ({ name }));

    return formattedParts;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Component tree file not found at: ${componentTreePath}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in component tree file: ${error.message}`);
    }
    throw error;
  }
}

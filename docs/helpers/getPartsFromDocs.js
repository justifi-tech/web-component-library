/**
 * Returns the parts array for the specified component from docs.json.
 * @param {string} componentTag - The component tag name (e.g., 'justifi-checkout')
 * @param {Object} docsJson - Required parsed docs.json object.
 * @returns {Array} Array of part objects with name, docs, and target properties
 */
export function getPartsFromDocs(componentTag, docsJson) {
  if (!docsJson) {
    throw new Error('docsJson parameter is required');
  }

  try {
    // Find the component in the docs
    const component = docsJson.components?.find(
      (comp) => comp.tag === componentTag
    );

    if (!component) {
      console.warn(`Component ${componentTag} not found in docs.json`);
      return [];
    }

    // Extract and return parts from the component
    return component.parts || [];
  } catch (error) {
    console.error(
      `Error reading parts from docs.json for ${componentTag}:`,
      error
    );
    return [];
  }
}

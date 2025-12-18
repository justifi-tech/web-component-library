/**
 * Returns the props array for the specified component from docs.json.
 * @param {string} componentTag - The component tag name (e.g., 'justifi-checkout')
 * @param {Object} docsJson - Required parsed docs.json object.
 * @returns {Array} Array of prop objects with name, type, required, defaultValue, and description properties
 */
export function getPropsFromDocs(componentTag, docsJson) {
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

    // Extract props from the component
    const props = component.props || [];

    // Transform props to match PropsTable format
    return props.map((prop) => ({
      name: prop.attr || prop.name,
      type: prop.type || '',
      required: prop.required || false,
      defaultValue: prop.default,
      description: prop.docs || '',
    }));
  } catch (error) {
    console.error(
      `Error reading props from docs.json for ${componentTag}:`,
      error
    );
    return [];
  }
}

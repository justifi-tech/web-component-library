/**
 * PropsManager for managing component props on both server and client side
 */

// Type definitions for TypeScript compatibility
/**
 * @typedef {Object} PropSchema
 * @property {string} name - Property name
 * @property {'string' | 'number' | 'boolean' | 'select' | 'object'} type - Property type
 * @property {string} label - Display label
 * @property {*} defaultValue - Default value
 * @property {Array<{value: string, label: string}>} [options] - Options for select type
 * @property {string} [placeholder] - Input placeholder
 * @property {string} [description] - Property description
 * @property {boolean} [required] - Whether the property is required
 * @property {Object} [validation] - Validation rules
 * @property {number} [validation.min] - Minimum value for numbers
 * @property {number} [validation.max] - Maximum value for numbers
 * @property {string} [validation.pattern] - Regex pattern for strings
 * @property {Function} [validation.custom] - Custom validation function
 */

/**
 * @typedef {Object.<string, *>} ComponentProps
 */

/**
 * Get the standardized JavaScript PropsManager code for embedding in HTML templates
 *
 * This function extracts the client-side JavaScript code from the actual PropsManager
 * class definition, ensuring the client-side implementation stays in sync with the
 * server-side implementation without code duplication.
 *
 * This eliminates the need for duplicate implementations in example files and
 * ensures consistency between server and client-side PropsManager behavior.
 */
function getPropsManagerScript() {
  // Extract the PropsManager class code as a string
  const propsManagerCode = PropsManager.toString();

  // Create the complete client-side script
  return `// PropsManager for client-side props management
${propsManagerCode}

// Initialize PropsManager globally
window.propsManager = new PropsManager();`;
}

// PropsManager class definition
class PropsManager {
  constructor() {
    this.props = {};
    this.schemas = new Map();
    this.listeners = new Map();

    // Initialize global props manager
    if (typeof window !== 'undefined') {
      window.propsManager = this;
    }
  }

  /**
   * Register a component's prop schema
   */
  registerSchema(componentName, schema) {
    this.schemas.set(componentName, schema);

    // Initialize with default values
    if (!this.props[componentName]) {
      this.props[componentName] = this.getDefaultProps(schema);
    }
  }

  /**
   * Get default props from schema
   */
  getDefaultProps(schema) {
    const defaults = {};
    schema.forEach((prop) => {
      defaults[prop.name] = prop.defaultValue;
    });
    return defaults;
  }

  /**
   * Get current props for a component
   */
  getProps(componentName) {
    return this.props[componentName] || {};
  }

  /**
   * Update a single prop
   */
  updateProp(componentName, propName, value, type) {
    if (!this.props[componentName]) {
      this.props[componentName] = {};
    }

    // Type conversion
    let convertedValue = value;
    switch (type) {
      case 'number':
        convertedValue = Number(value);
        if (isNaN(convertedValue)) return;
        break;
      case 'boolean':
        convertedValue = Boolean(value);
        break;
      case 'object':
        try {
          convertedValue =
            typeof value === 'string' ? JSON.parse(value) : value;
        } catch (e) {
          console.warn('Invalid JSON for object prop:', value);
          return;
        }
        break;
    }

    // Validation
    const schema = this.schemas.get(componentName);
    const propSchema = schema?.find((p) => p.name === propName);
    if (propSchema?.validation) {
      const validationResult = this.validateProp(propSchema, convertedValue);
      if (validationResult !== true) {
        console.warn(`Validation failed for ${propName}:`, validationResult);
        return;
      }
    }

    this.props[componentName][propName] = convertedValue;
    this.notifyListeners(componentName);
  }

  /**
   * Prefill props with actual values (e.g., from server-generated tokens)
   */
  prefillProps(componentName, props) {
    if (!this.props[componentName]) {
      this.props[componentName] = {};
    }

    // Update each prop without validation (since these are trusted server values)
    Object.entries(props).forEach(([propName, value]) => {
      const schema = this.schemas.get(componentName);
      const propSchema = schema?.find((p) => p.name === propName);

      if (propSchema) {
        // Use the prop's type from schema for conversion
        let convertedValue = value;
        switch (propSchema.type) {
          case 'number':
            convertedValue = Number(value);
            if (isNaN(convertedValue)) return;
            break;
          case 'boolean':
            convertedValue = Boolean(value);
            break;
          case 'object':
            try {
              convertedValue =
                typeof value === 'string' ? JSON.parse(value) : value;
            } catch (e) {
              console.warn('Invalid JSON for object prop:', value);
              return;
            }
            break;
        }

        // Skip validation for prefilled values since they come from the server
        this.props[componentName][propName] = convertedValue;
      }
    });

    this.notifyListeners(componentName);
  }

  /**
   * Validate a prop value against its schema
   */
  validateProp(schema, value) {
    if (
      schema.required &&
      (value === undefined || value === null || value === '')
    ) {
      return `${schema.label} is required`;
    }

    if (schema.validation) {
      const { min, max, pattern, custom } = schema.validation;

      if (typeof value === 'number') {
        if (min !== undefined && value < min) {
          return `${schema.label} must be at least ${min}`;
        }
        if (max !== undefined && value > max) {
          return `${schema.label} must be at most ${max}`;
        }
      }

      if (typeof value === 'string' && pattern) {
        const regex = new RegExp(pattern);
        if (!regex.test(value)) {
          return `${schema.label} format is invalid`;
        }
      }

      if (custom) {
        const result = custom(value);
        if (result !== true) {
          return typeof result === 'string'
            ? result
            : `${schema.label} is invalid`;
        }
      }
    }

    return true;
  }

  /**
   * Reset props to defaults
   */
  resetProps(componentName) {
    const schema = this.schemas.get(componentName);
    if (schema) {
      this.props[componentName] = this.getDefaultProps(schema);
      this.notifyListeners(componentName);
    }
  }

  /**
   * Subscribe to prop changes
   */
  subscribe(componentName, callback) {
    if (!this.listeners.has(componentName)) {
      this.listeners.set(componentName, []);
    }

    this.listeners.get(componentName).push(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(componentName);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  /**
   * Notify listeners of prop changes
   */
  notifyListeners(componentName) {
    const listeners = this.listeners.get(componentName);
    if (listeners) {
      const props = this.getProps(componentName);
      listeners.forEach((callback) => callback(props));
    }
  }

  /**
   * Get props as JSON string for clipboard
   */
  getPropsAsJson(componentName) {
    return JSON.stringify(this.getProps(componentName), null, 2);
  }

  /**
   * Get schema for a component
   */
  getSchema(componentName) {
    return this.schemas.get(componentName) || [];
  }
}

// Create global instance
const propsManager = new PropsManager();

// Global functions for use in HTML
if (typeof window !== 'undefined') {
  window.updateProp = (componentName, propName, value, type) => {
    propsManager.updateProp(componentName, propName, value, type);
  };

  window.resetProps = (componentName) => {
    propsManager.resetProps(componentName);
  };
}

// Export the function and instance
module.exports = {
  getPropsManagerScript,
  propsManager,
  // Type definitions for TypeScript compatibility
  PropSchema: null, // This will be used by TypeScript files
  ComponentProps: null,
};

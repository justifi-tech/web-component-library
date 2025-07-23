/// <reference path="../jsx.d.ts" />

export interface PropSchema {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'object';
  label: string;
  defaultValue: any;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  description?: string;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => boolean | string;
  };
}

export interface ComponentProps {
  [key: string]: any;
}

export class PropsManager {
  private props: ComponentProps = {};
  private schemas: Map<string, PropSchema[]> = new Map();
  private listeners: Map<string, Array<(props: ComponentProps) => void>> =
    new Map();

  constructor() {
    // Initialize global props manager
    if (typeof window !== 'undefined') {
      (window as any).propsManager = this;
    }
  }

  /**
   * Register a component's prop schema
   */
  registerSchema(componentName: string, schema: PropSchema[]): void {
    this.schemas.set(componentName, schema);

    // Initialize with default values
    if (!this.props[componentName]) {
      this.props[componentName] = this.getDefaultProps(schema);
    }
  }

  /**
   * Get default props from schema
   */
  private getDefaultProps(schema: PropSchema[]): ComponentProps {
    const defaults: ComponentProps = {};
    schema.forEach((prop) => {
      defaults[prop.name] = prop.defaultValue;
    });
    return defaults;
  }

  /**
   * Get current props for a component
   */
  getProps(componentName: string): ComponentProps {
    return this.props[componentName] || {};
  }

  /**
   * Update a single prop
   */
  updateProp(
    componentName: string,
    propName: string,
    value: any,
    type: string
  ): void {
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
  prefillProps(componentName: string, props: ComponentProps): void {
    if (!this.props[componentName]) {
      this.props[componentName] = {};
    }

    // Update each prop with validation
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

        // Validate the value
        if (propSchema.validation) {
          const validationResult = this.validateProp(
            propSchema,
            convertedValue
          );
          if (validationResult !== true) {
            console.warn(
              `Validation failed for ${propName}:`,
              validationResult
            );
            return;
          }
        }

        this.props[componentName][propName] = convertedValue;
      }
    });

    this.notifyListeners(componentName);
  }

  /**
   * Validate a prop value against its schema
   */
  private validateProp(schema: PropSchema, value: any): boolean | string {
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
  resetProps(componentName: string): void {
    const schema = this.schemas.get(componentName);
    if (schema) {
      this.props[componentName] = this.getDefaultProps(schema);
      this.notifyListeners(componentName);
    }
  }

  /**
   * Subscribe to prop changes
   */
  subscribe(
    componentName: string,
    callback: (props: ComponentProps) => void
  ): () => void {
    if (!this.listeners.has(componentName)) {
      this.listeners.set(componentName, []);
    }

    this.listeners.get(componentName)!.push(callback);

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
  private notifyListeners(componentName: string): void {
    const listeners = this.listeners.get(componentName);
    if (listeners) {
      const props = this.getProps(componentName);
      listeners.forEach((callback) => callback(props));
    }
  }

  /**
   * Get props as JSON string for clipboard
   */
  getPropsAsJson(componentName: string): string {
    return JSON.stringify(this.getProps(componentName), null, 2);
  }

  /**
   * Get schema for a component
   */
  getSchema(componentName: string): PropSchema[] {
    return this.schemas.get(componentName) || [];
  }
}

// Create global instance
export const propsManager = new PropsManager();

// Global functions for use in HTML
if (typeof window !== 'undefined') {
  (window as any).updateProp = (
    componentName: string,
    propName: string,
    value: any,
    type: string
  ) => {
    propsManager.updateProp(componentName, propName, value, type);
  };

  (window as any).resetProps = (componentName: string) => {
    propsManager.resetProps(componentName);
  };
}

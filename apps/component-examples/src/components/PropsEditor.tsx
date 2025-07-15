/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';
import { PropSchema, propsManager } from '../utils/props-manager';
import { getSchema } from '../utils/prop-schemas';

export interface PropsEditorData {
  componentName: string;
  onPropsChange?: string; // JavaScript function name to call when props change
}

export function PropsEditor(data: PropsEditorData) {
  const { componentName, onPropsChange: _onPropsChange } = data;

  // Get schema and current props for this component
  const schema = getSchema(componentName);
  const currentProps = propsManager.getProps(componentName);

  // Register schema if not already registered
  propsManager.registerSchema(componentName, schema);

  const renderField = (field: PropSchema) => {
    const fieldId = `prop-${field.name}`;
    const currentValue = currentProps[field.name] ?? field.defaultValue;

    switch (field.type) {
      case 'boolean':
        return (
          <div class="prop-field">
            <label for={fieldId} class="prop-label">
              <input
                type="checkbox"
                id={fieldId}
                name={field.name}
                checked={currentValue}
                onchange={`updateProp('${componentName}', '${field.name}', this.checked, 'boolean')`}
              />
              {field.label}
            </label>
            {field.description && <p class="prop-description">{field.description}</p>}
          </div>
        );

      case 'select':
        return (
          <div class="prop-field">
            <label for={fieldId} class="prop-label">{field.label}</label>
            <select
              id={fieldId}
              name={field.name}
              value={currentValue}
              onchange={`updateProp('${componentName}', '${field.name}', this.value, 'string')`}
            >
              {field.options?.map((option: { value: string; label: string }) => (
                <option value={option.value}>{option.label}</option>
              ))}
            </select>
            {field.description && <p class="prop-description">{field.description}</p>}
          </div>
        );

      case 'number':
        return (
          <div class="prop-field">
            <label for={fieldId} class="prop-label">{field.label}</label>
            <input
              type="number"
              id={fieldId}
              name={field.name}
              value={currentValue}
              placeholder={field.placeholder}
              onchange={`updateProp('${componentName}', '${field.name}', this.value, 'number')`}
            />
            {field.description && <p class="prop-description">{field.description}</p>}
          </div>
        );

      case 'object':
        return (
          <div class="prop-field">
            <label for={fieldId} class="prop-label">{field.label}</label>
            <textarea
              id={fieldId}
              name={field.name}
              placeholder={field.placeholder || 'Enter JSON object...'}
              onchange={`updateProp('${componentName}', '${field.name}', this.value, 'object')`}
            >{typeof currentValue === 'string' ? currentValue : JSON.stringify(currentValue, null, 2)}</textarea>
            {field.description && <p class="prop-description">{field.description}</p>}
          </div>
        );

      default: // string
        return (
          <div class="prop-field">
            <label for={fieldId} class="prop-label">{field.label}</label>
            <input
              type="text"
              id={fieldId}
              name={field.name}
              value={currentValue}
              placeholder={field.placeholder}
              onchange={`updateProp('${componentName}', '${field.name}', this.value, 'string')`}
            />
            {field.description && <p class="prop-description">{field.description}</p>}
          </div>
        );
    }
  };

  return (
    <div class="props-editor">
      <div class="props-header">
        <h3>Component Properties</h3>
        <button class="reset-props-btn" onclick={`resetProps('${componentName}')`}>Reset</button>
      </div>

      <div class="props-form">
        {schema.map(renderField)}
      </div>

      <div class="props-actions">
        <button class="apply-props-btn" onclick={`applyProps('${componentName}')`}>Apply Changes</button>
        <button class="copy-props-btn" onclick={`copyPropsToClipboard('${componentName}')`}>Copy Props</button>
      </div>
    </div>
  );
} 

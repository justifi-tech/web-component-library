/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface PropField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'object';
  label: string;
  value: any;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  description?: string;
}

export interface PropsEditorData {
  props: PropField[];
  onPropsChange?: string; // JavaScript function name to call when props change
}

export function PropsEditor(data: PropsEditorData) {
  const { props, onPropsChange: _onPropsChange } = data;

  const renderField = (field: PropField) => {
    const fieldId = `prop-${field.name}`;

    switch (field.type) {
      case 'boolean':
        return (
          <div class="prop-field">
            <label for={fieldId} class="prop-label">
              <input
                type="checkbox"
                id={fieldId}
                name={field.name}
                checked={field.value}
                onchange={`updateProp('${field.name}', this.checked, 'boolean')`}
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
              value={field.value}
              onchange={`updateProp('${field.name}', this.value, 'string')`}
            >
              {field.options?.map(option => (
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
              value={field.value}
              placeholder={field.placeholder}
              onchange={`updateProp('${field.name}', this.value, 'number')`}
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
              onchange={`updateProp('${field.name}', this.value, 'object')`}
            >{typeof field.value === 'string' ? field.value : JSON.stringify(field.value, null, 2)}</textarea>
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
              value={field.value}
              placeholder={field.placeholder}
              onchange={`updateProp('${field.name}', this.value, 'string')`}
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
        <button class="reset-props-btn" onclick="resetProps()">Reset</button>
      </div>

      <div class="props-form">
        {props.map(renderField)}
      </div>

      <div class="props-actions">
        <button class="apply-props-btn" onclick="applyProps()">Apply Changes</button>
        <button class="copy-props-btn" onclick="copyPropsToClipboard()">Copy Props</button>
      </div>
    </div>
  );
} 

import { h } from '@stencil/core';

interface RadioInputProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: 'true' | 'false';
  error: string;
  className?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RadioInput = (props: RadioInputProps) => {
  const { id, name, value, label, checked, error, onChange, className } = props;

  const inputRef = (el: HTMLInputElement) => {
    if (el && checked === 'true') {
      el.checked = true;
    }
  }

  const part = () => {
    let part = 'radio-input';
    if (checked === 'true') {
      part += ' radio-input-checked';
    }
    if (error) {
      part += ' radio-input-invalid';
    }
    return part;
  }

  return (
    <div class={className || ''} >
      <input
        ref={inputRef}
        id={id}
        type="radio"
        name={name}
        value={value}
        onChange={(event: any) => onChange(event)}
        class={error ? 'form-check-input me-2 is-invalid' : 'form-check-input me-2'}
        part={part()}
      />
      <label htmlFor={id} part="radio-input-label">
        {label}
      </label>
    </div>
  );
}

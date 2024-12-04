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
  return (
    <div class={className || ''} >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        onChange={(event: any) => onChange(event)}
        class={error ? 'form-check-input me-2 is-invalid' : 'form-check-input me-2'}
        part={`
          radio-input
          ${checked === 'true' ? 'radio-input-checked' : ''}
          ${error ? 'radio-input-invalid' : ''}
        `}
      />
      <label htmlFor={id} part="radio-input-label">
        {label}
      </label>
    </div>
  );
}

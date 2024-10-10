import { FunctionalComponent, h } from '@stencil/core';

interface TextFilterProps {
  name: string,
  label: string,
  params: any,
  setParamsOnChange: (value: any) => void
  placeholder?: string,
}

export const TextFilter: FunctionalComponent<TextFilterProps> = (props) => {
  const { name, label, params, setParamsOnChange, placeholder } = props;

  return (
    <div class='form-group d-flex flex-column'>
      <label part='label' class='form-label' htmlFor={name}>
        {label}
      </label>
      <input
        type='text'
        name={name}
        value={params[name] || ''}
        placeholder={placeholder}
        onInput={(e) => setParamsOnChange({ [name]: (e.target as HTMLInputElement).value })}
        part={'input'}
        class={'form-control'}
      />
    </div>
  );
};

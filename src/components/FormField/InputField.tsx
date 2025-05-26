'use client';

import { Input, Label } from '@/components';
import { useFormContext } from '@/context';
import { getObjectPropertyValue } from '@/utils';
import React from 'react';

export type InputFieldProps = React.ComponentProps<'input'> & {
  name: string;
  label?: string;
};

export const InputField: React.FC<InputFieldProps> = ({ name, label, required, placeholder, type = 'text' }) => {
  const { register, validationErrors, readOnly, setValue } = useFormContext();

  const errorsMessage = validationErrors && getObjectPropertyValue(name, validationErrors)?.message;
  const labelWithRequired = required ? `${label} *` : label;

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue(name, value);
  };

  return (
    <div className="flex flex-col gap-1">
      {labelWithRequired && <Label htmlFor={name}>{labelWithRequired}</Label>}

      <Input
        id={name}
        placeholder={placeholder}
        type={type}
        disabled={!!readOnly}
        aria-invalid={!!errorsMessage}
        {...register(name)}
        onChange={handleOnChange}
      />

      {!!errorsMessage && <span className="text-red-500 text-sm italic">{errorsMessage}</span>}
    </div>
  );
};

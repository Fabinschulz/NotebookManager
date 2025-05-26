'use client';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components';
import { useFormContext } from '@/context';
import { getObjectPropertyValue, truncateText } from '@/utils';
import React from 'react';

export interface SelectOption {
  label: string;
  value: string;
}

export type SelectDSGovFieldProps = {
  name: string;
  options: SelectOption[];
  label?: string;
  required?: boolean;
  placeholder?: string;
};

export const SelectField: React.FC<SelectDSGovFieldProps> = ({
  options,
  required,
  label,
  placeholder = 'Selecione',
  ...props
}) => {
  const { name } = props;
  const { validationErrors, setValue, watch, readOnly } = useFormContext();

  const errorsMessage = validationErrors && getObjectPropertyValue(name, validationErrors)?.message;
  const currentValue = watch(name);

  const onChange = (value: string) => {
    const foundOption = options.find((i) => i.value === value);
    if (foundOption) {
      setValue(name, foundOption.value, { shouldDirty: true });
    }
  };

  const labelWithRequired = required ? `${label} *` : label;
  return (
    <div className="flex flex-col gap-1">
      {labelWithRequired && (
        <label htmlFor={name} className="text-sm font-semibold font-sans">
          {labelWithRequired}
        </label>
      )}

      <Select
        value={currentValue || ''}
        onValueChange={onChange}
        disabled={!!readOnly}
        name={name}
        defaultValue={String(currentValue)}
      >
        <SelectTrigger name={name}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent id={name}>
          <SelectGroup>
            {options.map((option) => {
              const isLong = option.label.length > 215;
              const displayText = truncateText(option.label, 210);

              return (
                <SelectItem key={option.value?.toString()} value={option.value?.toString() || ''}>
                  {isLong ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>{displayText}</span>
                      </TooltipTrigger>
                      <TooltipContent>{option.label}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <span>{option.label}</span>
                  )}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>

      {!!errorsMessage && <span className="text-red-500 text-sm italic">{errorsMessage}</span>}
    </div>
  );
};

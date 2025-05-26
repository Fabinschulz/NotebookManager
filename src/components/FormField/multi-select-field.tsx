'use client';
import {
  Badge,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components';
import { useFormContext } from '@/context';
import { cn, getObjectPropertyValue, truncateText } from '@/utils';
import { ChevronDown, X } from 'lucide-react';
import * as React from 'react';

export interface SelectOption {
  label: string;
  value: string;
}

export type MultiSelectFieldProps = {
  name: string;
  options: SelectOption[];
  label?: string;
  required?: boolean;
  placeholder?: string;
};

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  options,
  required,
  label,
  placeholder = 'Selecione',
  ...props
}) => {
  const { name } = props;
  const { validationErrors, setValue, watch, readOnly } = useFormContext();
  const [open, setOpen] = React.useState(false);

  const errorsMessage = validationErrors && getObjectPropertyValue(name, validationErrors)?.message;
  const currentValues = watch(name) || [];

  const selectedValues = Array.isArray(currentValues) ? currentValues : [currentValues].filter(Boolean);

  const selectedOptions = options.filter((option) => selectedValues.includes(option.value));

  const handleSelect = (value: string) => {
    const isSelected = selectedValues.includes(value);

    if (isSelected) {
      const newValues = selectedValues.filter((v) => v !== value);
      setValue(name, newValues, { shouldDirty: true });
    } else {
      const newValues = [...selectedValues, value];
      setValue(name, newValues, { shouldDirty: true });
    }
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = selectedValues.filter((v) => v !== value);
    setValue(name, newValues, { shouldDirty: true });
  };

  const labelWithRequired = required ? `${label} *` : label;

  return (
    <div className="flex flex-col gap-1">
      {labelWithRequired && (
        <label htmlFor={name} className="text-sm font-semibold font-sans">
          {labelWithRequired}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            data-testid={`select-${name}-id`}
            className={cn(
              `border-input data-[placeholder]:text-muted-foreground 
              focus-visible:border-ring focus-visible:ring-ring/50 
              aria-invalid:ring-destructive/20 
              aria-invalid:border-destructive
              flex w-full items-center 
              rounded-md border bg-transparent
              px-3 py-2
              text-sm
              h-[35px]
              shadow-xs 
              transition-[color,box-shadow] 
              outline-none focus-visible:ring-[3px] 
              disabled:cursor-not-allowed disabled:opacity-50`,
              readOnly && 'opacity-50 cursor-not-allowed'
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="flex items-center gap-1 overflow-hidden whitespace-nowrap text-ellipsis">
                {selectedOptions.map((option) => (
                  <Badge key={option.value} variant="secondary" className="mr-1 mb-1 p-1 px-2 border border-gray-300">
                    {truncateText(option.label, 50)}
                    {!readOnly && (
                      <button
                        type="button"
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onClick={(e) => handleRemove(option.value, e)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remover {option.label}</span>
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <div className="ml-auto flex items-center gap-2">
              <ChevronDown className="h-4 w-4 opacity-45" color="#666666" />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder="Pesquisar opção..." className="h-8" />
            <CommandList>
              <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
              <CommandGroup className="max-h-60 overflow-auto">
                {options.map(({ label, value }) => {
                  const isSelected = selectedValues.includes(value);
                  const isLong = label.length > 215;
                  const displayText = truncateText(label, 210);

                  return (
                    <CommandItem
                      key={value}
                      value={`${label} ${value}`}
                      onSelect={(inputValue) => {
                        const selectedValue = options.find((opt) => inputValue.includes(opt.label))?.value;
                        if (selectedValue) handleSelect(selectedValue);
                      }}
                      className={cn('aria-selected:bg-[#009688] aria-selected:text-white')}
                    >
                      <div
                        className={cn(
                          'mr-2 flex min-h-4 min-w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected ? 'bg-[#009688] text-white' : 'opacity-50'
                        )}
                      >
                        {isSelected && <span className="h-2 w-2 rounded-sm bg-white" />}
                      </div>
                      {isLong ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>{displayText}</span>
                          </TooltipTrigger>
                          <TooltipContent>{label}</TooltipContent>
                        </Tooltip>
                      ) : (
                        <span>{label}</span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {!!errorsMessage && <span className="text-red-500 text-sm italic">{errorsMessage}</span>}
    </div>
  );
};

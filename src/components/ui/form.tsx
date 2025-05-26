'use client';

import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';

import { Label } from '@/components/ui/label';
import { useFormContext as useAppFormContext } from '@/context/formContext';
import { cn } from '@/utils';

const Form = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const FormFieldContext = React.createContext<{ name: string }>({} as { name: string });

const FormField = ({ name, children }: { name: string; children: React.ReactNode }) => {
  return <FormFieldContext.Provider value={{ name }}>{children}</FormFieldContext.Provider>;
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { validationErrors } = useAppFormContext();

  if (!fieldContext) {
    throw new Error('useFormField must be used within a <FormField>');
  }

  const error = validationErrors?.[fieldContext.name];

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    error
  };
};

const FormItemContext = React.createContext<{ id: string }>({} as { id: string });

const FormItem = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" className={cn('grid gap-2', className)} {...props} />
    </FormItemContext.Provider>
  );
};

const FormLabel = ({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn('data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
};

const FormControl = ({ ...props }: React.ComponentProps<typeof Slot>) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
};

const FormMessage = ({ className, ...props }: React.ComponentProps<'p'>) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? '') : props.children;

  if (!body) return null;

  return (
    <p data-slot="form-message" id={formMessageId} className={cn('text-red-500 text-sm italic', className)} {...props}>
      {body}
    </p>
  );
};

export { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useFormField };


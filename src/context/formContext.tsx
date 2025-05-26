'use client'
import { yupResolver } from '@hookform/resolvers/yup'
import React, {
  createContext,
  JSX,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  DefaultValues,
  FieldErrors,
  FieldErrorsImpl,
  FieldValues,
  FormState,
  useForm,
  UseFormSetValue,
  useFormState,
  UseFormWatch,
} from 'react-hook-form'

export type FormMode = 'create' | 'update'

type FormContextProps = {
  onSubmit: (values: any) => void
  onError: (values: FieldErrors) => void
  setValue: ReturnType<typeof useForm>['setValue']
  reset: ReturnType<typeof useForm>['reset']
  getValues: ReturnType<typeof useForm>['getValues']
  formState?: FormState<any>
  validationErrors: Partial<FieldErrorsImpl<any>> | undefined
  control?: ReturnType<typeof useForm>['control']
  watch: ReturnType<typeof useForm>['watch']
  submitting: boolean
  isDirty: boolean
  isValid: boolean
  dirtyFields: any
  readOnly?: boolean
  trigger: ReturnType<typeof useForm>['trigger']
  register: ReturnType<typeof useForm>['register']
}

const FormContext = createContext<FormContextProps>({
  readOnly: false,
  onSubmit: () => true,
  onError: () => true,
  setValue: () => {
    throw new Error('formContext not initialized')
  },
  reset: () => {
    throw new Error('formContext not initialized')
  },
  watch: () => {
    throw new Error('formContext not initialized')
  },
  control: undefined,
  formState: undefined,
  getValues: () => {
    throw new Error('formContext not initialized')
  },
  validationErrors: undefined,
  submitting: false,
  isDirty: false,
  isValid: false,
  dirtyFields: {},
  trigger: () => {
    throw new Error('formContext not initialized')
  },
  register: () => {
    throw new Error('formContext not initialized')
  },
})

interface ChangeFieldDelegate {
  fieldName: string
  delegate: (
    fieldValue: string | number | boolean | string[] | number[] | boolean[],
    setValue: UseFormSetValue<FieldValues>,
    watch?: UseFormWatch<FieldValues>,
  ) => void
}

interface FormProviderProps {
  children: JSX.Element
  validationSchema: any
  defaultValues: DefaultValues<FieldValues>
  onSubmit: (values: any) => void
  onError?: any
  onChangeField?: ChangeFieldDelegate[]
  readOnly?: boolean
}

interface ChangeFieldHandlerProps {
  handler: ChangeFieldDelegate
  children: JSX.Element
}

interface ChangeFieldHandlersProps {
  handlers: ChangeFieldDelegate[] | undefined
  children: JSX.Element
}

export const FormProvider = ({
  children,
  validationSchema,
  defaultValues,
  onSubmit,
  onError,
  onChangeField,
  readOnly = false,
}: FormProviderProps) => {
  const [submitting, setSubmitting] = useState(false)

  const {
    handleSubmit,
    setValue,
    getValues,
    control,
    reset,
    formState,
    watch,
    trigger,
    register,
    formState: { isDirty, isValid, dirtyFields },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  })

  useEffect(() => {
    if (!submitting) {
      reset(getValues())
    }
  }, [reset, submitting])

  const { errors } = useFormState({ control })
  const validationErrors = Object.keys(errors ?? {}).length ? errors : undefined

  const formSubmit = async (values: FieldValues) => {
    setSubmitting(true)
    console.log('FormContext - submiting', { values })
    try {
      const res = await onSubmit(values)
      setSubmitting(false)
      console.log('FormContext - setSubmitting false')
      return res
    } catch (error) {
      console.log('FormProvider - error submit', { error })
      onError && onError(error)
      setSubmitting(false)
    }
  }

  if (validationErrors !== undefined)
    console.log('validationErrors: ', validationErrors)

  const htmlSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()
    return handleSubmit(formSubmit, onError)(event)
  }

  const setValueCustom = (name: any, value: any, options: any) => {
    return setValue(name, value, options)
  }

  const ChangeFieldHandlers = ({
    handlers,
    children,
  }: ChangeFieldHandlersProps): JSX.Element => {
    const isEmpty = handlers === undefined || handlers.length === 0
    let currentElement = children
    if (isEmpty) return currentElement

    for (let i = 0; i < handlers.length; i++) {
      const currentHandler = handlers[i]
      currentElement = (
        <ChangeFieldHandler handler={currentHandler}>
          {currentElement}
        </ChangeFieldHandler>
      )
    }
    return currentElement
  }

  const ChangeFieldHandler = ({
    handler,
    children,
  }: ChangeFieldHandlerProps) => {
    const { watch, setValue, dirtyFields } = useFormContext()
    const currentValue = watch(handler.fieldName)
    useEffect(() => {
      if (dirtyFields[handler.fieldName]) {
        handler.delegate(currentValue, setValue)
      }
    }, [handler, currentValue, dirtyFields, setValue])
    return children
  }

  return (
    <FormContext.Provider
      value={{
        readOnly,
        onSubmit,
        onError,
        setValue: setValueCustom,
        control,
        reset,
        formState,
        getValues,
        validationErrors,
        watch,
        submitting,
        isDirty,
        isValid,
        dirtyFields,
        trigger,
        register,
      }}
    >
      <ChangeFieldHandlers handlers={onChangeField}>
        <form className="formContext" onSubmit={htmlSubmit}>
          {children}
        </form>
      </ChangeFieldHandlers>
    </FormContext.Provider>
  )
}

export const useFormContext = () => useContext(FormContext)

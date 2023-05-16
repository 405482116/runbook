import { FC } from 'react';
import Select, { Props as SelectProps, OptionTypeBase } from 'react-select';
import { useController, FieldError } from 'react-hook-form';
import { ObjectSchema } from 'yup';

interface SelectInputProps<T> extends SelectProps<OptionTypeBase> {
  name: keyof T;
  label: string;
  error?: FieldError;
  control: T;
}

export const SelectInput = <T extends object>({
  name,
  label,
  error,
  control,
  ...props
}: SelectInputProps<T>) => {
  const { field } = useController({
    name,
    control,
  });

  return (
    <div>
      <label htmlFor={name.toString()}>{label}</label>
      <Select
        inputId={name.toString()}
        {...props}
        value={props.isMulti ? field.value : props.options?.find((option) => option.value === field.value)}
        onChange={(value) => {
          field.onChange(value?.value ?? null);
        }}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={`error-${name}`}
      />
      {error && <span id={`error-${name}`}>{error.message}</span>}
    </div>
  );
};

interface TextInputProps<T> {
  name: keyof T;
  label: string;
  type: string;
  error?: FieldError;
  control: T;
}

export const TextInput = <T extends object>({
  name,
  label,
  type,
  error,
  control,
}: TextInputProps<T>) => {
  const { field } = useController({
    name,
    control,
  });

  return (
    <div>
      <label htmlFor={name.toString()}>{label}</label>
      <input type={type} id={name.toString()} {...field} aria-invalid={error ? 'true' : 'false'} aria-describedby={`error-${name}`} />
      {error && <span id={`error-${name}`}>{error.message}</span>}
    </div>
  );
};

interface FormProps<T> {
  schema: ObjectSchema<T>;
  defaultValues: T;
  onSubmit: (data: T) => void;
}

export const Form = <T extends object>({
  schema,
  defaultValues,
  onSubmit,
}: FormProps<T>) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({ defaultValues, resolver: yupResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput<T>
        name="name"
        label="Name"
        type="text"
        error={errors?.name}
        control={control}
      />
      <SelectInput<T>
        name="color"
        label="Color"
        options={[
          { value: 'red', label: 'Red' },
          { value: 'green', label: 'Green' },
          { value: 'blue', label: 'Blue' },
        ]}
        error={errors?.color}
        control={control}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

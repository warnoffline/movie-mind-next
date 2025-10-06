import { Controller } from 'react-hook-form';

import { Input } from '@/components/Input';
import { Text } from '@/components/Text';

import s from './FormField.module.scss';

import type { FieldName, FormValues } from '../config';
import type { Control, FieldErrors } from 'react-hook-form';

type FormFieldProps = {
  name: FieldName;
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
  placeholder: string;
  type?: string;
};

export const FormField = ({
  name,
  control,
  errors,
  placeholder,
  type = 'text',
}: FormFieldProps) => (
  <div>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          className={s.auth__input}
          placeholder={placeholder}
          type={type}
          value={field.value ?? ''}
          onChange={field.onChange}
        />
      )}
    />
    {errors[name] && (
      <Text color="primary" className={s.error}>
        {errors[name].message}
      </Text>
    )}
  </div>
);

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { useUserStore } from '@/store/useRootStore';

import s from './AuthForm.module.scss';
import { fields, makeSchema, type FormValues } from '../config';
import { FormField } from '../FormField';

const AuthForm = observer(() => {
  const { loginWithEmail, registerWithEmail, loadingStage } = useUserStore();
  const [isRegister, setIsRegister] = useState(false);
  const schema = useMemo(() => makeSchema(isRegister), [isRegister]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: FormValues) => {
    if (isRegister) {
      await registerWithEmail(data.email, data.password);
    } else {
      await loginWithEmail(data.email, data.password);
    }
  };

  return (
    <form className={s.auth} onSubmit={handleSubmit(onSubmit)}>
      {fields.map((f) => (
        <FormField key={f.name} {...f} control={control} errors={errors} />
      ))}

      {isRegister && (
        <FormField
          name="confirmPassword"
          control={control}
          errors={errors}
          placeholder="Повторите пароль"
          type="password"
        />
      )}

      <Button
        className={s.auth__submit}
        type="submit"
        disabled={isSubmitting || loadingStage.isLoading}
      >
        <Text view="p-18"> {isRegister ? 'Зарегистрироваться' : 'Войти'}</Text>
      </Button>

      <div className={s.auth__toggle}>
        <Text color="secondary">{isRegister ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}</Text>
        <span onClick={() => setIsRegister((prev) => !prev)}>
          {isRegister ? 'Войти' : 'Зарегистрироваться'}
        </span>
      </div>
    </form>
  );
});

export default AuthForm;

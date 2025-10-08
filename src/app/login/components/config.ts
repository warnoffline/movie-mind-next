import z from 'zod';

export const makeSchema = (isRegister: boolean) =>
  z
    .object({
      email: z.string().email('Введите корректный email'),
      password: z.string().min(6, 'Пароль минимум 6 символов'),
      confirmPassword: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (isRegister) {
        if (!data.confirmPassword) {
          ctx.addIssue({
            code: 'custom',
            path: ['confirmPassword'],
            message: 'Подтвердите пароль',
          });
        } else if (data.password !== data.confirmPassword) {
          ctx.addIssue({
            code: 'custom',
            path: ['confirmPassword'],
            message: 'Пароли не совпадают',
          });
        }
      }
    });

export type FormValues = z.infer<ReturnType<typeof makeSchema>>;

export type FieldName = keyof FormValues;

export const fields: { name: FieldName; placeholder: string; type?: string }[] = [
  { name: 'email', placeholder: 'Email' },
  { name: 'password', placeholder: 'Пароль', type: 'password' },
];

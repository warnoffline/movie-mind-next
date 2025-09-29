'use client';

import { observer } from 'mobx-react-lite';
import { useForm, Controller } from 'react-hook-form';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Text } from '@/components/Text';
import { Textarea } from '@/components/Textearea';
import { useUserStore } from '@/store';

import s from './AddReviewForm.module.scss';
import { useMovieStore } from '../../model';

type ReviewFormValues = {
  content: string;
  rating?: number;
};

export const AddReviewForm = observer(() => {
  const { addReview, reviewsLoadingStage } = useMovieStore();
  const { user } = useUserStore();
  const { control, handleSubmit, reset } = useForm<ReviewFormValues>();

  const onSubmit = async (data: ReviewFormValues) => {
    const review = {
      author: user?.displayName ?? user?.email ?? 'Anonim',
      content: data.content,
      rating: data.rating,
    };
    await addReview(review);
    reset();
  };

  return (
    <div className={s.formWrapper}>
      <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
        <Controller
          name="content"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => <Textarea {...field} rows={4} placeholder="Напишите ваш отзыв" />}
        />

        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              min={1}
              max={10}
              placeholder="Оценка (1-10)"
              value={field.value?.toString() || ''}
              onChange={(val) => field.onChange(val === '' ? undefined : Number(val))}
            />
          )}
        />

        <div className={s.review__footer}>
          <Button
            className={s.review__button}
            type="submit"
            disabled={reviewsLoadingStage.isLoading}
          >
            <Text color="primary" weight="bold" view="p-14">
              Добавить отзыв
            </Text>
          </Button>
        </div>
      </form>
    </div>
  );
});

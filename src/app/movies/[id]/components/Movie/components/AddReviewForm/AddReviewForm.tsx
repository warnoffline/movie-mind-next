'use client';

import { observer } from 'mobx-react-lite';
import { useForm, Controller } from 'react-hook-form';

import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Textarea } from '@/components/Textearea';
import { useUserStore } from '@/store';

import s from './AddReviewForm.module.scss';
import { useMovieStore } from '../../../../model';
import { StarRating } from '../StarRating';

type ReviewFormValues = {
  content: string;
  rating: number;
};

export const AddReviewForm = observer(() => {
  const { addReview, reviewsLoadingStage } = useMovieStore();
  const { user } = useUserStore();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    defaultValues: {
      content: '',
      rating: 0,
    },
  });

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
        <Text color="primary" weight="bold" view="p-20">
          Ваша оценка
        </Text>
        <Controller
          name="rating"
          control={control}
          rules={{
            required: 'Пожалуйста, оцените фильм',
            min: { value: 1, message: 'Минимальная оценка — 1' },
          }}
          render={({ field }) => (
            <>
              <StarRating value={field.value || 0} onChange={field.onChange} max={5} />
              {errors.rating && (
                <Text view="p-14" color="error">
                  {errors.rating.message}
                </Text>
              )}
            </>
          )}
        />

        <Controller
          name="content"
          control={control}
          rules={{ required: 'Пожалуйста, напишите отзыв' }}
          render={({ field }) => <Textarea {...field} rows={4} placeholder="Напишите ваш отзыв" />}
        />
        {errors.content && (
          <Text view="p-14" color="error">
            {errors.content.message}
          </Text>
        )}

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

'use client';

import { observer } from 'mobx-react-lite';

import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Textarea } from '@/components/Textearea';
import { useUserStore } from '@/store';

import s from './AddReviewForm.module.scss';
import { useReviewStore } from '../../model';
import { StarRating } from '../StarRating';

export const AddReviewForm = observer(() => {
  const { user } = useUserStore();
  const { content, rating, setContent, setRating, submit, loadingStage, errors } = useReviewStore();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const author = user?.displayName ?? user?.email ?? 'Anonim';
    await submit(author);
  };

  return (
    <div className={s.formWrapper}>
      <form onSubmit={onSubmit} className={s.form}>
        <Text color="primary" weight="bold" view="p-20">
          Ваша оценка
        </Text>

        <StarRating value={rating} onChange={setRating} max={5} />
        {errors['rating'] && (
          <Text view="p-14" color="error">
            {errors['rating']}
          </Text>
        )}

        <Textarea value={content} onChange={setContent} rows={4} placeholder="Напишите ваш отзыв" />
        {errors['content'] && (
          <Text view="p-14" color="error">
            {errors['content']}
          </Text>
        )}

        <div className={s.review__footer}>
          <Button className={s.review__button} type="submit" disabled={loadingStage.isLoading}>
            <Text color="primary" weight="bold" view="p-14">
              Добавить отзыв
            </Text>
          </Button>
        </div>
      </form>
    </div>
  );
});

'use client';

import cn from 'classnames';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { useMemo } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ArrowLeftIcon } from '@/components/icons/ArrowLeftIcon';
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon';
import { Text } from '@/components/Text';
import { GENRE_NAME_MAP, GENRE_IMAGES_MAP, RU_TO_EN_GENRE_MAP } from '@/utils/genres';

import s from './Categories.module.scss';
import { getBreakpoints } from './config';
import { itemVariants } from './config';

type Props = {
  selectedCategory: string | null;
  onSelectCategory?: (category: string | undefined) => void;
};

const Categories: React.FC<Props> = ({ selectedCategory, onSelectCategory }) => {
  const genreList = useMemo(() => Object.values(GENRE_NAME_MAP), []);

  const initialSlide = useMemo(() => {
    return selectedCategory ? genreList.indexOf(selectedCategory) : 0;
  }, [selectedCategory, genreList]);

  return (
    <div className={s.categories}>
      <Text view="title" color="primary" className={s.title}>
        Категории
      </Text>

      <div className={s.categories__inner}>
        <motion.div
          className={s.navPrev}
          whileHover={{ scale: 1.2, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeftIcon />
        </motion.div>
        <motion.div
          className={s.navNext}
          whileHover={{ scale: 1.2, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowRightIcon />
        </motion.div>
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: `.${s.navNext}`,
            prevEl: `.${s.navPrev}`,
          }}
          loop={true}
          slidesPerView={5}
          spaceBetween={12}
          initialSlide={initialSlide}
          breakpoints={getBreakpoints}
        >
          {genreList.map((cat) => (
            <SwiperSlide key={cat}>
              <motion.div
                className={cn(s.category, { [s.active]: cat === selectedCategory })}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (selectedCategory === cat) {
                    return onSelectCategory?.(undefined);
                  }
                  return onSelectCategory?.(cat);
                }}
              >
                <Image
                  src={GENRE_IMAGES_MAP[RU_TO_EN_GENRE_MAP[cat]]}
                  alt={GENRE_NAME_MAP[RU_TO_EN_GENRE_MAP[cat]]}
                  className={s.categoryImg}
                  width={140}
                  height={140}
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Categories;

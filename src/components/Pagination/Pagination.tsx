import { motion } from 'framer-motion';
import React from 'react';

import { Button } from '../Button';
import { Text } from '../Text';
import { containerVariants, itemVariants } from './config';
import s from './Pagination.module.scss';

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (newPage: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onChange }) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className={s.pagination__wrapper}
  >
    <motion.div variants={itemVariants} className={s.pagination}>
      <Button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}>
        <Text view="p-18">Назад</Text>
      </Button>
      <Text color="primary" view="p-14">
        {page} / {totalPages || 1}
      </Text>
      <Button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages || totalPages === 0}
      >
        <Text view="p-18">Вперед</Text>
      </Button>
    </motion.div>
  </motion.div>
);

export default React.memo(Pagination);

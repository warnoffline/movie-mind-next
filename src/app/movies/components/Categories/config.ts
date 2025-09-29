import type { Variants } from 'framer-motion';

export const getBreakpoints = {
  320: { slidesPerView: 2 },
  640: { slidesPerView: 3 },
  1024: { slidesPerView: 5 },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
};

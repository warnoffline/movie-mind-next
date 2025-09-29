'use client'

import cn from 'classnames';
import React from 'react';

import s from './Loader.module.scss';
import Icon from '../icons/Icon';

export type LoaderProps = {
  size?: 's' | 'm' | 'l' | 'xl';
  className?: string;
  color?: string;
};

const sizes: Record<'s' | 'm' | 'l' | 'xl', number> = {
  s: 24,
  m: 48,
  l: 60,
  xl: 100,
};

const Loader: React.FC<LoaderProps> = ({ size = 'l', className, color, ...props }) => {
  const dim = sizes[size];
  const scale = dim / 24;
  return (
    <Icon
      width={dim}
      height={dim}
      className={cn(s.loader, className)}
      viewBox={`0 0 ${dim} ${dim}`}
      style={color ? { color } : undefined}
      {...props}
    >
      <path
        d="M13.3495 17.8465C10.1208 18.5919 6.89904 16.5787 6.15362 13.3499C5.4082 10.1212 7.42136 6.89944 10.6501 6.15401C13.8789 5.40859 17.1006 7.42175 17.8461 10.6505L19.7948 10.2006C18.8009 5.89559 14.5053 3.21138 10.2002 4.20527C5.8952 5.19917 3.21099 9.49481 4.20488 13.7998C5.19878 18.1049 9.49441 20.7891 13.7995 19.7952L13.3495 17.8465Z"
        fill="currentColor"
        transform={`scale(${scale})`}
      />
    </Icon>
  );
};

export default React.memo(Loader);

'use client'

import cn from 'classnames';
import * as React from 'react';

import s from './Text.module.scss';

export type TextProps = {
  /** Дополнительный класс */
  className?: string;
  /** Стиль отображения */
  view?: 'title' | 'button' | 'p-20' | 'p-18' | 'p-16' | 'p-14';
  /** Html-тег */
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span';
  /** Начертание шрифта */
  weight?: 'normal' | 'medium' | 'bold';
  /** Контент */
  children: React.ReactNode;
  /** Цвет */
  color?: 'primary' | 'secondary' | 'accent';
  /** Максимальное кол-во строк */
  maxLines?: number;
  style?: React.CSSProperties;
};

const Text: React.FC<TextProps> = ({
  className,
  view,
  tag = 'p',
  weight,
  color,
  children,
  maxLines,
  style,
}) => {
  const Tag = tag;

  const lineClampStyle: React.CSSProperties & {
    WebkitLineClamp?: number;
    WebkitBoxOrient?: string;
  } =
    maxLines && maxLines > 0
      ? {
          display: '-webkit-box',
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'normal',
        }
      : {};

  return (
    <Tag
      className={cn(className, view && s[view], color && s[color], weight && s[weight])}
      style={{ ...lineClampStyle, ...style }}
    >
      {children}
    </Tag>
  );
};

export default React.memo(Text);

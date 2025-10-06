import React from 'react';

import { Loader } from '../Loader';
import s from './Button.module.scss';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: 'outlined' | 'contained';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  variant = 'contained',
  loading,
  children,
  disabled,
  className,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const classes = [
    s.button,
    variant === 'contained' ? s['button--contained'] : s['button--outlined'],
    loading && !disabled ? s.loading : s['button--action'],
    disabled && !loading ? s['button--disabled'] : '',
    disabled && loading ? s['button--disabled'] : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={isDisabled} {...props}>
      {loading && <Loader size="s" />}
      <div>{children}</div>
    </button>
  );
};

export default React.memo(Button);

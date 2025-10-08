import cn from 'classnames';
import React from 'react';

import s from './Input.module.scss';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  /** Значение поля */
  value: string;
  /** Callback, вызываемый при вводе данных в поле */
  onChange: (value: string) => void;
  /** Слот для иконки справа */
  afterSlot?: React.ReactNode;
  className?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChange, afterSlot, className, ...props }, ref) => {
    return (
      <div className={cn(s['input-wrapper'], className)}>
        <input
          className={s['input-field']}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type="text"
          disabled={props.disabled}
          ref={ref}
          {...props}
        />
        {afterSlot && <div className={s['input-icon']}>{afterSlot}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

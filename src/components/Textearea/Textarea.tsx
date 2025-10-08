import cn from 'classnames';
import React from 'react';

import s from './Textarea.module.scss';

export type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange' | 'value'
> & {
  /** Значение поля */
  value: string;
  /** Callback, вызываемый при вводе данных в поле */
  onChange: (value: string) => void;
  /** Слот для иконки справа */
  afterSlot?: React.ReactNode;
  className?: string;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ value, onChange, afterSlot, className, ...props }, ref) => {
    return (
      <div className={cn(s['textarea-wrapper'], className)}>
        <textarea
          className={s['textarea-field']}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          ref={ref}
          {...props}
        />
        {afterSlot && <div className={s['textarea-icon']}>{afterSlot}</div>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;

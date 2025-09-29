'use client'

import cn from 'classnames';
import React from 'react';

import s from './CheckBox.module.scss';
import CheckIcon from '../icons/CheckIcon';

export type CheckBoxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  /** Вызывается при клике на чекбокс */
  onChange: (checked: boolean) => void;
  checked?: boolean;
};

const CheckBox: React.FC<CheckBoxProps> = ({ onChange, checked, className, ...props }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <label className={cn(s['checkbox'], className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className={s['checkbox-input']}
        {...props}
      />
      <span className={s['checkbox-custom']}>
        {checked && (
          <span>
            <CheckIcon
              className={s['checkbox-icon']}
              strokeWidth={2}
              width={40}
              height={40}
              color={props.disabled ? 'disabled' : 'accent'}
            />
          </span>
        )}
      </span>
    </label>
  );
};

export default React.memo(CheckBox);

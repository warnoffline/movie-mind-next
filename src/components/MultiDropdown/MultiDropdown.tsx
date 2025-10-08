'use client'

import cn from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import ArrowDownIcon from '../icons/ArrowDownIcon';
import { Input } from '../Input';
import s from './MultiDropdown.module.scss';

export type Option = {
  /** Ключ варианта, используется для отправки на бек/использования в коде */
  key: string;
  /** Значение варианта, отображается пользователю */
  value: string;
};

/** Пропсы, которые принимает компонент Dropdown */
export type MultiDropdownProps = {
  className?: string;
  /** Массив возможных вариантов для выбора */
  options: Option[];
  /** Текущие выбранные значения поля, может быть пустым */
  value: Option[];
  /** Callback, вызываемый при выборе варианта */
  onChange: (value: Option[]) => void;
  /** Заблокирован ли дропдаун */
  disabled?: boolean;
  /** Возвращает строку которая будет выводится в инпуте. В случае если опции не выбраны, строка должна отображаться как placeholder. */
  getTitle: (value: Option[]) => string;
};

const MultiDropdown: React.FC<MultiDropdownProps> = ({
  className,
  options,
  value,
  onChange,
  disabled,
  getTitle,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchItem, setSearchItem] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) => option.value.toLowerCase().includes(searchItem.toLowerCase()))
    );
  }, [searchItem, options]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchItem('');
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleToggleDropdown = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      if (!isOpen) {
        setSearchItem('');
      }
    }
  }, [disabled, isOpen]);

  const handleSelectOption = useCallback(
    (option: Option) => {
      if (!value.some((selected) => selected.key === option.key)) {
        onChange([...value, option]);
      } else {
        onChange(value.filter((selected) => selected.key !== option.key));
      }
    },
    [onChange, value]
  );

  const handleInputChange = useCallback((value: string) => {
    setSearchItem(value);
  }, []);

  return (
    <div className={cn(s['dropdown-wrapper'], className)} ref={dropdownRef}>
      <div className={s['dropdown-content']}>
        <Input
          value={value.length === 0 ? searchItem : getTitle(value)}
          onFocus={handleToggleDropdown}
          onChange={handleInputChange}
          placeholder={value.length == 0 ? getTitle(value) : ''}
          disabled={disabled}
          afterSlot={<ArrowDownIcon color="secondary" />}
        />
      </div>
      {isOpen && !disabled && (
        <ul className={s['dropdown-options']}>
          {filteredOptions.map((option) => (
            <li
              key={option.key}
              onClick={() => handleSelectOption(option)}
              className={cn(
                s['dropdown-option'],
                value.some((selected) => selected.key === option.key) && s['selected']
              )}
            >
              {option.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default React.memo(MultiDropdown);

'use client'

import * as React from 'react';

export type IconProps = React.SVGAttributes<SVGElement> & {
  className?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'disabled';
  width?: number;
  height?: number;
  strokeWidth?: number;
  viewBox?: string;
};

const Icon: React.FC<React.PropsWithChildren<IconProps>> = ({
  children,
  className,
  width = 24,
  height = 24,
  viewBox = '0 0 24 24',
  ...props
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      {...props}
    >
      {children}
    </svg>
  );
};

export default Icon;

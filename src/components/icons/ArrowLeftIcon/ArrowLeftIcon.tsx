import * as React from 'react';

import Icon, { colorMap, type IconProps } from '../Icon';

const ArrowLeftIcon: React.FC<IconProps> = ({ color, ...props }) => {
  const fillColor = color ? colorMap[color] : 'currentColor';

  return (
    <Icon {...props}>
      <path d="M17.77 3.77L16 2L6 12L16 22L17.77 20.23L9.54 12L17.77 3.77Z" fill={fillColor} />
    </Icon>
  );
};

export { ArrowLeftIcon };

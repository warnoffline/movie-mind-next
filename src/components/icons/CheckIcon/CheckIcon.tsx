import * as React from 'react';

import Icon, { colorMap, type IconProps } from '../Icon';

const CheckIcon: React.FC<IconProps> = ({ color, ...props }) => {
  const strokeColor = color ? colorMap[color] : 'currentColor';

  return (
    <Icon {...props}>
      <path
        d="M4 11.6129L9.87755 18L20 7"
        stroke={strokeColor}
        strokeWidth={props.strokeWidth || 2}
      />
    </Icon>
  );
};

export default CheckIcon;

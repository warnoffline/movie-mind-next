import * as React from 'react';

import Icon, { colorMap, type IconProps } from '../Icon';

const ArrowRightIcon: React.FC<IconProps> = ({ color, ...props }) => {
  const fillColor = color ? colorMap[color] : 'currentColor';

  return (
    <Icon {...props}>
      <path
        d="M6.22998 20.23L7.99998 22L18 12L7.99998 2L6.22998 3.77L14.46 12L6.22998 20.23Z"
        fill={fillColor}
      />
    </Icon>
  );
};

export { ArrowRightIcon };

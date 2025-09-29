import * as React from 'react';

import Icon, { colorMap, type IconProps } from '../Icon';

const ArrowDownIcon: React.FC<IconProps> = ({ color, ...props }) => {
  const fillColor = color ? colorMap[color] : 'currentColor';

  return (
    <Icon {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.33545 8.74775L3.66418 7.25293L11.9998 14.6624L20.3354 7.25293L21.6642 8.74775L11.9998 17.3383L2.33545 8.74775Z"
        fill={fillColor}
      />
    </Icon>
  );
};

export default ArrowDownIcon;

import type { FC, HTMLAttributes } from 'react';
import * as S from './Skeleton.styles';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  circle?: boolean;
}

export const Skeleton: FC<SkeletonProps> = ({
  width,
  height,
  borderRadius,
  circle = false,
  className,
  style,
  ...props
}) => {
  return (
    <S.SkeletonBase
      $width={width}
      $height={height}
      $borderRadius={borderRadius}
      $circle={circle}
      className={className}
      style={style}
      aria-hidden="true"
      {...props}
    />
  );
};

import styled, { keyframes } from 'styled-components';

export const shimmer = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

export interface SkeletonBaseProps {
  $width?: string | number;
  $height?: string | number;
  $borderRadius?: string | number;
  $circle?: boolean;
}

export const SkeletonBase = styled.div<SkeletonBaseProps>`
  display: inline-block;
  width: ${({ $width, $circle }) =>
    $circle ? ($width ?? '40px') : typeof $width === 'number' ? `${$width}px` : ($width ?? '100%')};
  height: ${({ $height, $circle, $width }) =>
    $circle
      ? ($height ?? $width ?? '40px')
      : typeof $height === 'number'
        ? `${$height}px`
        : ($height ?? '16px')};
  border-radius: ${({ $borderRadius, $circle }) =>
    $circle ? '50%' : typeof $borderRadius === 'number' ? `${$borderRadius}px` : ($borderRadius ?? '8px')};
  background: linear-gradient(
    90deg,
    rgba(28, 27, 28, 0.85) 0%,
    rgba(45, 43, 46, 0.95) 50%,
    rgba(28, 27, 28, 0.85) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.8s infinite ease-in-out;
  border: 1px solid rgba(255, 255, 255, 0.04);
  box-sizing: border-box;
  vertical-align: middle;
`;

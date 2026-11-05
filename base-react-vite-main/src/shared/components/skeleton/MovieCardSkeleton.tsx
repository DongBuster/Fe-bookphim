import type { FC } from 'react';
import styled from 'styled-components';
import { Skeleton } from './Skeleton';
import { media } from '@/styles/breakpoints';

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--bg-card, #1c1b1c);
  border-radius: 16px;
  box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const PosterArea = styled.div`
  position: relative;
  width: 100%;
  height: 341px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 680px) {
    height: 280px;
  }
`;

const TopBadges = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const BottomMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const BottomCtaArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  height: 60px;
  background-color: var(--bg-elevated, #232223);
  gap: 10px;
`;

export interface MovieCardSkeletonProps {
  className?: string;
}

export const MovieCardSkeleton: FC<MovieCardSkeletonProps> = ({ className }) => {
  return (
    <CardWrapper className={className}>
      <PosterArea>
        {/* Poster background shimmer */}
        <Skeleton
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: 0,
          }}
        />

        {/* Top Badges */}
        <TopBadges style={{ zIndex: 2 }}>
          <Skeleton width={52} height={22} borderRadius={6} />
          <Skeleton width={44} height={22} borderRadius={6} />
        </TopBadges>

        {/* Bottom Title & Genre */}
        <BottomMeta style={{ zIndex: 2 }}>
          <Skeleton width="45%" height={12} borderRadius={4} />
          <Skeleton width="85%" height={18} borderRadius={4} />
        </BottomMeta>
      </PosterArea>

      <BottomCtaArea>
        <Skeleton width="40%" height={14} borderRadius={4} />
        <Skeleton width="50%" height={36} borderRadius={8} />
      </BottomCtaArea>
    </CardWrapper>
  );
};

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  width: 100%;

  @media ${media.lg} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
  @media ${media.md} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  @media ${media.sm} {
    grid-template-columns: 1fr;
  }
`;

export interface MovieGridSkeletonProps {
  count?: number;
  className?: string;
}

export const MovieGridSkeleton: FC<MovieGridSkeletonProps> = ({
  count = 8,
  className,
}) => {
  return (
    <GridContainer className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={`movie-skel-${index}`} />
      ))}
    </GridContainer>
  );
};

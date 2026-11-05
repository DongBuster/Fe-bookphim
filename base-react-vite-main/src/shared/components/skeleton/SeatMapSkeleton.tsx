import type { FC } from 'react';
import styled from 'styled-components';
import { Skeleton } from './Skeleton';

const Wrapper = styled.div`
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  padding: 10px 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const ScreenBar = styled.div`
  width: 65%;
  max-width: 480px;
  height: 6px;
  border-radius: 9999px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 16px rgba(255, 185, 85, 0.2);
`;

const SeatRowsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

const SkeletonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  .label-skel {
    width: 14px;
    height: 14px;
    border-radius: 3px;
  }
`;

const SeatCluster = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatusText = styled.div`
  color: #ffb955;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Be Vietnam Pro', sans-serif;
`;

export const SeatMapSkeleton: FC = () => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  return (
    <Wrapper>
      {/* Screen shimmer */}
      <ScreenBar>
        <Skeleton width="100%" height={6} borderRadius={9999} />
      </ScreenBar>

      {/* Grid of Seats */}
      <SeatRowsContainer>
        {rows.map((r, rowIdx) => {
          const isVip = rowIdx >= 3 && rowIdx <= 6;
          const isSweetbox = rowIdx === 7;

          return (
            <SkeletonRow key={r}>
              {/* Row label left */}
              <Skeleton className="label-skel" width={14} height={14} borderRadius={3} />

              {/* Left cluster */}
              <SeatCluster>
                {Array.from({ length: isSweetbox ? 2 : 4 }).map((_, cIdx) => (
                  <Skeleton
                    key={`l-${cIdx}`}
                    width={isSweetbox ? 62 : 30}
                    height={28}
                    borderRadius={6}
                    style={{
                      border: isVip
                        ? '1px solid rgba(255, 185, 85, 0.15)'
                        : '1px solid rgba(255, 255, 255, 0.04)',
                    }}
                  />
                ))}
              </SeatCluster>

              {/* Aisle */}
              <div style={{ width: 14 }} />

              {/* Center cluster (skip if sweetbox) */}
              {!isSweetbox && (
                <>
                  <SeatCluster>
                    {Array.from({ length: 6 }).map((_, cIdx) => (
                      <Skeleton
                        key={`c-${cIdx}`}
                        width={30}
                        height={28}
                        borderRadius={6}
                        style={{
                          border: isVip
                            ? '1px solid rgba(255, 185, 85, 0.15)'
                            : '1px solid rgba(255, 255, 255, 0.04)',
                        }}
                      />
                    ))}
                  </SeatCluster>

                  {/* Aisle */}
                  <div style={{ width: 14 }} />
                </>
              )}

              {/* Right cluster */}
              <SeatCluster>
                {Array.from({ length: isSweetbox ? 2 : 4 }).map((_, cIdx) => (
                  <Skeleton
                    key={`r-${cIdx}`}
                    width={isSweetbox ? 62 : 30}
                    height={28}
                    borderRadius={6}
                    style={{
                      border: isVip
                        ? '1px solid rgba(255, 185, 85, 0.15)'
                        : '1px solid rgba(255, 255, 255, 0.04)',
                    }}
                  />
                ))}
              </SeatCluster>

              {/* Row label right */}
              <Skeleton className="label-skel" width={14} height={14} borderRadius={3} />
            </SkeletonRow>
          );
        })}
      </SeatRowsContainer>

      <StatusText>
        <span
          style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#ffb955',
            boxShadow: '0 0 8px #ffb955',
          }}
        />
        Đang đồng bộ trạng thái ghế theo thời gian thực...
      </StatusText>
    </Wrapper>
  );
};

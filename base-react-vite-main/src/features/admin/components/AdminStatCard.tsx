import type { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  changePercent?: number;
  suffix?: string;
}

const StyledCard = styled.div`
  width: 100%;
  height: 100%;
  min-height: 142px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(145deg, #1b1f2b 0%, #151822 100%);
  border: 1px solid #2e3548;
  border-radius: 12px;
  padding: 20px;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 185, 85, 0.55);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  }
`;

export const AdminStatCard: FC<AdminStatCardProps> = ({
  title,
  value,
  icon,
  changePercent,
  suffix,
}) => {
  const isPositive = (changePercent ?? 0) >= 0;

  return (
    <StyledCard>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#CBD5E1' }}>{title}</span>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(255, 185, 85, 0.2) 0%, rgba(255, 83, 90, 0.1) 100%)',
            border: '1px solid rgba(255, 185, 85, 0.3)',
            color: '#FFB955',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
      </div>

      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: '#FFFFFF',
          marginTop: 14,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.02em',
        }}
      >
        {value}{' '}
        {suffix && (
          <span style={{ fontSize: 13, fontWeight: 500, color: '#CBD5E1' }}>{suffix}</span>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 12,
          marginTop: 10,
          minHeight: 18,
          color: changePercent !== undefined ? (isPositive ? '#52C41A' : '#FF535A') : '#94A3B8',
          fontWeight: 500,
        }}
      >
        {changePercent !== undefined ? (
          <>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{isPositive ? `+${changePercent}%` : `${changePercent}%`}</span>
            <span style={{ color: '#94A3B8', fontWeight: 400 }}>so với hôm qua</span>
          </>
        ) : (
          <span style={{ color: '#94A3B8', fontWeight: 400 }}>Cập nhật theo thời gian thực</span>
        )}
      </div>
    </StyledCard>
  );
};

import type { FC } from 'react';
import { Card, Tooltip } from 'antd';
import styled from 'styled-components';
import type { RevenueChartDto } from '../../../types/admin.types';

interface RevenueChartProps {
  data?: RevenueChartDto;
  loading: boolean;
}

const BarColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  height: 100%;
  justify-content: flex-end;
  cursor: pointer;

  &:hover .bar-fill {
    filter: brightness(1.2);
    box-shadow: 0 0 16px rgba(255, 185, 85, 0.35);
  }
`;

export const RevenueChart: FC<RevenueChartProps> = ({ data, loading }) => {
  if (loading || !data || data.labels.length === 0) {
    return (
      <Card style={{ background: '#161922', borderColor: '#2E3548', borderRadius: 12 }} loading={loading}>
        <div
          style={{
            height: 260,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#CBD5E1',
          }}
        >
          Chưa có dữ liệu biểu đồ doanh thu
        </div>
      </Card>
    );
  }

  const maxVal = Math.max(...data.totalRevenue, 1);

  return (
    <Card
      title={<span style={{ color: '#FFF', fontWeight: 600 }}>Biểu Đồ Doanh Thu 7 Ngày Qua</span>}
      style={{ background: '#161922', borderColor: '#2E3548', borderRadius: 12 }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          height: 230,
          gap: 14,
          paddingBottom: 8,
          borderBottom: '1px solid #2E3548',
        }}
      >
        {data.labels.map((label, idx) => {
          const total = data.totalRevenue[idx] || 0;
          const ticket = data.ticketRevenue[idx] || 0;
          const concession = data.concessionRevenue[idx] || 0;
          const heightPercent = total > 0 ? Math.min(100, Math.max(12, (total / maxVal) * 100)) : 4;

          return (
            <Tooltip
              key={label}
              title={
                <div style={{ fontSize: 12 }}>
                  <div style={{ fontWeight: 700, color: '#FFB955', marginBottom: 4 }}>Ngày {label}</div>
                  <div>Vé: {ticket.toLocaleString('vi-VN')} đ</div>
                  <div>Bắp nước: {concession.toLocaleString('vi-VN')} đ</div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', marginTop: 4, paddingTop: 4, fontWeight: 600 }}>
                    Tổng: {total.toLocaleString('vi-VN')} đ
                  </div>
                </div>
              }
            >
              <BarColumn>
                <span style={{ fontSize: 11, color: '#A0A6B8', fontVariantNumeric: 'tabular-nums' }}>
                  {total >= 1_000_000 ? `${(total / 1_000_000).toFixed(1)}M` : `${(total / 1_000).toFixed(0)}k`}
                </span>
                <div
                  className="bar-fill"
                  style={{
                    width: '100%',
                    maxWidth: 48,
                    height: `${heightPercent}%`,
                    background:
                      total > 0
                        ? 'linear-gradient(180deg, #FFB955 0%, rgba(255, 83, 90, 0.55) 100%)'
                        : 'rgba(37, 42, 54, 0.6)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 0.35s ease, filter 0.2s ease, box-shadow 0.2s ease',
                  }}
                />
                <span style={{ fontSize: 11, color: '#A0A6B8', fontWeight: 500 }}>{label}</span>
              </BarColumn>
            </Tooltip>
          );
        })}
      </div>
    </Card>
  );
};

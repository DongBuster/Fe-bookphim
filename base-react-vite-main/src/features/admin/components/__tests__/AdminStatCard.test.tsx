import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminStatCard } from '../AdminStatCard';

describe('AdminStatCard', () => {
  it('renders title, value, suffix, and positive change percentage', () => {
    render(
      <AdminStatCard
        title="Số Vé Bán Hôm Nay"
        value={125}
        suffix="vé"
        changePercent={12}
        icon={<span>icon</span>}
      />,
    );

    expect(screen.getByText('Số Vé Bán Hôm Nay')).toBeInTheDocument();
    expect(screen.getByText('125')).toBeInTheDocument();
    expect(screen.getByText('vé')).toBeInTheDocument();
    expect(screen.getByText('+12%')).toBeInTheDocument();
    expect(screen.getByText('so với hôm qua')).toBeInTheDocument();
  });

  it('renders fallback footer text when changePercent is omitted', () => {
    render(
      <AdminStatCard
        title="Tỷ Lệ Lấp Đầy Ghế"
        value="68.5%"
        icon={<span>icon</span>}
      />,
    );

    expect(screen.getByText('Tỷ Lệ Lấp Đầy Ghế')).toBeInTheDocument();
    expect(screen.getByText('68.5%')).toBeInTheDocument();
    expect(screen.getByText('Cập nhật theo thời gian thực')).toBeInTheDocument();
  });
});

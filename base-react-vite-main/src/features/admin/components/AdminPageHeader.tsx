import type { FC, ReactNode } from 'react';

export interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export const AdminPageHeader: FC<AdminPageHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
      }}
    >
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: '#CBD5E1', margin: '4px 0 0 0' }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default AdminPageHeader;

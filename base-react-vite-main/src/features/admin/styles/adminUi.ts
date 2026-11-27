import type { CSSProperties } from 'react';

export const ADMIN_COLORS = {
  bgPage: '#0B0C0E',
  bgPanel: '#161922',
  bgInput: '#1E222E',
  bgTableHeader: '#1D212D',
  bgTableHover: '#212636',
  borderPanel: '#2E3548',
  borderInput: '#3A4258',
  textPrimary: '#FFFFFF',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  gold: '#FFB955',
  danger: '#FF535A',
  dangerText: '#FF6B71',
  success: '#52C41A',
} as const;

export const adminPrimaryButtonStyle: CSSProperties = {
  background: ADMIN_COLORS.gold,
  borderColor: ADMIN_COLORS.gold,
  color: '#0B0C0E',
  fontWeight: 600,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
};

export const adminDangerButtonStyle: CSSProperties = {
  background: 'rgba(255, 83, 90, 0.14)',
  borderColor: 'rgba(255, 83, 90, 0.55)',
  color: ADMIN_COLORS.dangerText,
  fontWeight: 600,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
};

export const adminDrawerStyles = {
  header: {
    background: ADMIN_COLORS.bgPanel,
    borderBottom: `1px solid ${ADMIN_COLORS.borderPanel}`,
    padding: '16px 20px',
  },
  body: {
    background: ADMIN_COLORS.bgPanel,
    color: ADMIN_COLORS.textPrimary,
    padding: '20px',
  },
  footer: {
    background: ADMIN_COLORS.bgPanel,
    borderTop: `1px solid ${ADMIN_COLORS.borderPanel}`,
    padding: '14px 20px',
  },
};

export const adminModalStyles = {
  content: {
    background: ADMIN_COLORS.bgPanel,
    border: `1px solid ${ADMIN_COLORS.borderPanel}`,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    background: ADMIN_COLORS.bgPanel,
    borderBottom: `1px solid ${ADMIN_COLORS.borderPanel}`,
    padding: '16px 20px',
    marginBottom: 0,
  },
  body: {
    background: ADMIN_COLORS.bgPanel,
    color: ADMIN_COLORS.textPrimary,
    padding: '20px',
  },
  footer: {
    background: ADMIN_COLORS.bgPanel,
    borderTop: `1px solid ${ADMIN_COLORS.borderPanel}`,
    padding: '14px 20px',
    marginTop: 0,
  },
};

import type { FC, ReactNode } from 'react';
import { Modal } from 'antd';
import type { ModalProps } from 'antd';
import {
  adminModalStyles,
  adminPrimaryButtonStyle,
  adminDangerButtonStyle,
} from '@features/admin/styles/adminUi';

export interface AdminBaseModalProps extends Omit<ModalProps, 'className' | 'styles'> {
  title: ReactNode;
  children: ReactNode;
}

/**
 * Shared dark-themed base modal for all Admin panels to ensure unified
 * background, spacing, borders, and primary/danger action buttons.
 */
export const AdminBaseModal: FC<AdminBaseModalProps> = ({
  title,
  children,
  okButtonProps,
  cancelButtonProps,
  destroyOnHidden = true,
  ...rest
}) => {
  return (
    <Modal
      className="admin-panel-modal"
      title={
        typeof title === 'string' ? (
          <span style={{ color: '#FFFFFF', fontSize: 17, fontWeight: 700 }}>{title}</span>
        ) : (
          title
        )
      }
      styles={adminModalStyles}
      destroyOnHidden={destroyOnHidden}
      okButtonProps={{
        className: 'admin-btn-primary',
        style: adminPrimaryButtonStyle,
        ...okButtonProps,
      }}
      cancelButtonProps={{
        danger: true,
        className: 'admin-btn-danger',
        style: adminDangerButtonStyle,
        ...cancelButtonProps,
      }}
      {...rest}
    >
      {children}
    </Modal>
  );
};

export default AdminBaseModal;

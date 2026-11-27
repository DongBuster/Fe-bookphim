import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminBaseModal } from '../AdminBaseModal';

describe('AdminBaseModal', () => {
  it('renders title, children, and unified primary/danger footer buttons', () => {
    render(
      <AdminBaseModal open title="Tạo Mới" okText="Lưu" cancelText="Hủy">
        <div>Nội dung modal</div>
      </AdminBaseModal>,
    );

    expect(screen.getByText('Tạo Mới')).toBeInTheDocument();
    expect(screen.getByText('Nội dung modal')).toBeInTheDocument();

    const okBtn = screen.getByRole('button', { name: 'Lưu' });
    const cancelBtn = screen.getByRole('button', { name: 'Hủy' });

    expect(okBtn).toHaveClass('admin-btn-primary');
    expect(cancelBtn).toHaveClass('admin-btn-danger');
  });

  it('invokes onOk and onCancel when footer buttons are clicked', () => {
    const onOk = vi.fn();
    const onCancel = vi.fn();

    render(
      <AdminBaseModal
        open
        title="Xác Nhận"
        okText="Đồng Ý"
        cancelText="Hủy"
        onOk={onOk}
        onCancel={onCancel}
      >
        <span>Body</span>
      </AdminBaseModal>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Đồng Ý' }));
    expect(onOk).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Hủy' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

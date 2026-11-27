import type { FC } from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0B0C0E;
`;

export const Forbidden403Page: FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Result
        icon={<ShieldAlert size={64} color="#FF535A" style={{ margin: '0 auto' }} />}
        title={<span style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 700 }}>403 - Truy Cập Bị Từ Chối</span>}
        subTitle={<span style={{ color: '#A0A6B8' }}>Tài khoản của bạn không có quyền truy cập vào trung tâm quản trị PhimBook. Vui lòng đăng nhập bằng tài khoản Quản trị viên (Admin/Manager).</span>}
        extra={[
          <Button key="home" type="primary" style={{ background: '#FFB955', color: '#000000', fontWeight: 600, border: 'none' }} onClick={() => navigate('/')}>
            Về Trang Chủ
          </Button>,
          <Button key="login" ghost style={{ borderColor: '#FF535A', color: '#FF535A' }} onClick={() => navigate('/login')}>
            Đăng Nhập Tài Khoản Khác
          </Button>,
        ]}
      />
    </Container>
  );
};

export default Forbidden403Page;

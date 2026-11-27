import type { FC } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Button, Tag, Card, Row, Col, Space, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Building2, Plus, Grid, MapPin, Monitor } from 'lucide-react';
import { AdminPageHeader } from '@features/admin/components/AdminPageHeader';
import { SeatMatrixModal } from './components/SeatMatrixModal';
import { CreateRoomModal } from './components/CreateRoomModal';
import { getAdminTheatersApi } from '@features/admin/api/admin-theaters.api';
import type { TheaterWithRoomsDto, RoomDto } from '@features/admin/types/admin.types';

export const AdminTheatersPage: FC = () => {
  const [seatMatrixModalOpen, setSeatMatrixModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<{ id: string; name: string } | null>(null);

  const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);
  const [targetTheater, setTargetTheater] = useState<{ id: string; name: string } | null>(null);

  const { data: theaters = [], isLoading, refetch } = useQuery({
    queryKey: ['admin', 'theaters'],
    queryFn: getAdminTheatersApi,
  });

  const handleOpenSeatMatrix = (room: RoomDto) => {
    setSelectedRoom({ id: room.roomId, name: room.roomName });
    setSeatMatrixModalOpen(true);
  };

  const handleOpenCreateRoom = (theater?: TheaterWithRoomsDto) => {
    if (theater) {
      setTargetTheater({ id: theater.theaterId, name: theater.theaterName });
    } else {
      setTargetTheater(null);
    }
    setCreateRoomModalOpen(true);
  };

  const getScreenTypeTag = (type: string) => {
    switch (type) {
      case 'IMAX':
      case 'IMAX_3D':
        return <Tag color="gold">IMAX</Tag>;
      case 'FOUR_DX':
        return <Tag color="volcano">4DX</Tag>;
      case 'SCREEN_X':
        return <Tag color="purple">ScreenX</Tag>;
      case 'STANDARD_3D':
        return <Tag color="blue">3D Standard</Tag>;
      default:
        return <Tag color="cyan">2D Standard</Tag>;
    }
  };

  const roomColumns: ColumnsType<RoomDto> = [
    {
      title: 'Tên Phòng Chiếu',
      dataIndex: 'roomName',
      key: 'roomName',
      render: (name: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Monitor size={16} color="#FFB955" />
          <span style={{ fontWeight: 600, color: '#FFFFFF' }}>{name}</span>
        </div>
      ),
    },
    {
      title: 'Loại Màn Hình',
      dataIndex: 'screenType',
      key: 'screenType',
      render: (type: string) => getScreenTypeTag(type),
    },
    {
      title: 'Tổng Số Ghế',
      dataIndex: 'totalSeats',
      key: 'totalSeats',
      render: (seats: number) => (
        <span style={{ color: '#A0A6B8', fontWeight: 500 }}>
          {seats} ghế ngồi
        </span>
      ),
    },
    {
      title: 'Sơ Đồ Ghế',
      key: 'actions',
      align: 'right',
      render: (_, room) => (
        <Button
          type="link"
          icon={<Grid size={15} />}
          onClick={() => handleOpenSeatMatrix(room)}
          style={{ color: '#FFB955', padding: '0 8px' }}
        >
          Xem Sơ Đồ Ghế
        </Button>
      ),
    },
  ];

  const totalRoomsCount = theaters.reduce((acc, t) => acc + (t.rooms?.length ?? 0), 0);
  const totalSeatsCount = theaters.reduce(
    (acc, t) => acc + (t.rooms?.reduce((rAcc, r) => rAcc + (r.totalSeats ?? 0), 0) ?? 0),
    0
  );

  return (
    <div>
      <AdminPageHeader
        title="Quản Lý Rạp & Phòng Chiếu"
        subtitle="Hệ thống cụm rạp PhimBook, cơ sở hạ tầng phòng chiếu, định dạng công nghệ và sơ đồ ma trận ghế"
        action={
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => handleOpenCreateRoom()}
            style={{ background: '#FFB955', color: '#000000', fontWeight: 600, border: 'none' }}
          >
            Thêm Phòng Chiếu
          </Button>
        }
      />

      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <div
            style={{
              background: '#161922',
              border: '1px solid #2E3548',
              borderRadius: 10,
              padding: '16px 20px',
            }}
          >
            <div style={{ fontSize: 13, color: '#CBD5E1' }}>Tổng Số Cụm Rạp</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#FFFFFF', marginTop: 4 }}>
              {isLoading ? '...' : theaters.length} <span style={{ fontSize: 13, color: '#CBD5E1' }}>cụm</span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div
            style={{
              background: '#161922',
              border: '1px solid #2E3548',
              borderRadius: 10,
              padding: '16px 20px',
            }}
          >
            <div style={{ fontSize: 13, color: '#CBD5E1' }}>Tổng Số Phòng Chiếu</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#FFFFFF', marginTop: 4 }}>
              {isLoading ? '...' : totalRoomsCount} <span style={{ fontSize: 13, color: '#CBD5E1' }}>phòng</span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div
            style={{
              background: '#161922',
              border: '1px solid #2E3548',
              borderRadius: 10,
              padding: '16px 20px',
            }}
          >
            <div style={{ fontSize: 13, color: '#A0A6B8' }}>Tổng Công Suất Ghế</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#FFB955', marginTop: 4 }}>
              {isLoading ? '...' : totalSeatsCount.toLocaleString('vi-VN')}{' '}
              <span style={{ fontSize: 13, color: '#A0A6B8' }}>ghế</span>
            </div>
          </div>
        </Col>
      </Row>

      {/* Theaters List */}
      {isLoading ? (
        <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spin tip="Đang tải dữ liệu cụm rạp..." />
        </div>
      ) : theaters.length === 0 ? (
        <div
          style={{
            background: '#13151B',
            border: '1px solid #252A36',
            borderRadius: 10,
            padding: 40,
            textAlign: 'center',
            color: '#A0A6B8',
          }}
        >
          Chưa có cụm rạp nào trong hệ thống.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {theaters.map((theater) => (
            <Card
              key={theater.theaterId}
              style={{
                background: '#13151B',
                borderColor: '#252A36',
                borderRadius: 10,
              }}
              styles={{ body: { padding: 20 } }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                  paddingBottom: 16,
                  borderBottom: '1px solid #252A36',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: 'rgba(255, 185, 85, 0.1)',
                        color: '#FFB955',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Building2 size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                        {theater.theaterName}
                      </h3>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 12,
                          color: '#A0A6B8',
                          marginTop: 4,
                        }}
                      >
                        <MapPin size={12} />
                        <span>{theater.address}, {theater.city}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Space>
                  <Tag color="gold" style={{ margin: 0 }}>
                    {theater.rooms?.length ?? 0} Phòng Chiếu
                  </Tag>
                  <Button
                    size="small"
                    icon={<Plus size={14} />}
                    onClick={() => handleOpenCreateRoom(theater)}
                    style={{ borderColor: '#252A36', color: '#FFB955', background: '#1A1D26' }}
                  >
                    Thêm Phòng
                  </Button>
                </Space>
              </div>

              <Table
                dataSource={theater.rooms ?? []}
                columns={roomColumns}
                rowKey="roomId"
                pagination={false}
                size="small"
              />
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <SeatMatrixModal
        open={seatMatrixModalOpen}
        onClose={() => setSeatMatrixModalOpen(false)}
        roomId={selectedRoom?.id}
        roomName={selectedRoom?.name}
      />

      <CreateRoomModal
        open={createRoomModalOpen}
        onClose={() => setCreateRoomModalOpen(false)}
        theaterId={targetTheater?.id}
        theaterName={targetTheater?.name}
        theaters={theaters.map((t) => ({ theaterId: t.theaterId, theaterName: t.theaterName }))}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default AdminTheatersPage;

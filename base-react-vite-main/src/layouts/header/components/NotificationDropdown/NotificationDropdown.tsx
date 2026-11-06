import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Bell, CheckCheck, Gift, Sparkles, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  INITIAL_NOTIFICATIONS,
  type NotificationItem,
} from '../../data/header-data';
import { useClickOutside } from '../../hooks/useClickOutside';
import * as S from './NotificationDropdown.styles';

interface NotificationDropdownProps {
  onCloseOthers: () => void;
  onScrollOrNavigate: (sectionId: string) => void;
}

const TYPE_ICON: Record<NotificationItem['type'], React.ReactNode> = {
  ticket: <Ticket size={15} />,
  voucher: <Gift size={15} />,
  release: <Sparkles size={15} />,
  points: <Award size={15} />,
};

export function NotificationDropdownMenu({
  onCloseOthers,
  onScrollOrNavigate,
}: NotificationDropdownProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifTab, setNotifTab] = useState<'all' | 'offers'>('all');
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside([ref], [() => setIsOpen(false)]);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const filteredNotifications =
    notifTab === 'offers'
      ? notifications.filter((n) => n.category === 'offers')
      : notifications;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const handleItemClick = (item: NotificationItem) => () => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isUnread: false } : n)),
    );
    setIsOpen(false);
    navigate(item.link);
  };

  const handleToggleOpen = () => {
    setIsOpen((v) => !v);
    onCloseOthers();
  };

  const handleSelectTab = (tab: 'all' | 'offers') => () => {
    setNotifTab(tab);
  };

  const handleViewAllOffers = () => {
    setIsOpen(false);
    onScrollOrNavigate('uu-dai');
  };

  return (
    <S.NotificationWrapper ref={ref}>
      <S.NotificationBtn
        title={t('header:notifications', 'Thông báo')}
        $isOpen={isOpen}
        onClick={handleToggleOpen}
      >
        <Bell size={14} className="bell-icon" />
        {unreadCount > 0 && <span className="badge-dot" />}
      </S.NotificationBtn>

      {isOpen && (
        <S.NotificationDropdown>
          <S.NotificationDropdownHeader>
            <div className="header-left">
              <span className="title">{t('header:notifications', 'Thông báo')}</span>
              {unreadCount > 0 && (
                <span className="count-badge">
                  {unreadCount} {t('header:new_badge', 'mới')}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                className="mark-read-btn"
                onClick={handleMarkAllAsRead}
              >
                <CheckCheck size={12} />
                <span>{t('header:mark_all_read', 'Đã đọc hết')}</span>
              </button>
            )}
          </S.NotificationDropdownHeader>

          <S.NotificationTabs>
            <S.NotificationTab
              type="button"
              $isActive={notifTab === 'all'}
              onClick={handleSelectTab('all')}
            >
              {t('header:tab_all', 'Tất cả')}
            </S.NotificationTab>
            <S.NotificationTab
              type="button"
              $isActive={notifTab === 'offers'}
              onClick={handleSelectTab('offers')}
            >
              {t('header:tab_offers', 'Ưu đãi & Quà tặng')}
            </S.NotificationTab>
          </S.NotificationTabs>

          <S.NotificationList>
            {filteredNotifications.length === 0 ? (
              <S.EmptyNotification>
                {t('header:no_notifications', 'Không có thông báo nào')}
              </S.EmptyNotification>
            ) : (
              filteredNotifications.map((item) => (
                <S.NotificationItem
                  key={item.id}
                  $isUnread={item.isUnread}
                  onClick={handleItemClick(item)}
                >
                  <div className={`item-icon-box ${item.type}`}>
                    {TYPE_ICON[item.type]}
                  </div>
                  <div className="item-content">
                    <span className="item-title">{item.titleKey ? t(item.titleKey, item.title) : item.title}</span>
                    <span className="item-desc">{item.descKey ? t(item.descKey, item.desc) : item.desc}</span>
                    <span className="item-time">{item.timeKey ? t(item.timeKey, item.time) : item.time}</span>
                  </div>
                  {item.isUnread && <span className="unread-dot" />}
                </S.NotificationItem>
              ))
            )}
          </S.NotificationList>

          <S.NotificationDropdownFooter>
            <button
              type="button"
              className="view-all-link"
              onClick={handleViewAllOffers}
            >
              {t('header:view_all_offers', 'Xem tất cả ưu đãi & sự kiện')}
            </button>
          </S.NotificationDropdownFooter>
        </S.NotificationDropdown>
      )}
    </S.NotificationWrapper>
  );
}

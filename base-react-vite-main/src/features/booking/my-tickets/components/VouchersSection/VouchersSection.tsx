import { useTranslation } from 'react-i18next';
import { Sparkles, Copy } from 'lucide-react';
import type { VoucherData } from '../../data/past-tickets.data';
import * as S from './VouchersSection.styles';

interface VouchersSectionProps {
  vouchers: VoucherData[];
  onCopyCode: (code: string) => void;
}

export function VouchersSection({
  vouchers,
  onCopyCode,
}: VouchersSectionProps) {
  const { t } = useTranslation();

  const handleCopy = (code: string) => () => {
    onCopyCode(code);
  };

  return (
    <div>
      <S.VoucherSectionHeader>
        <h2>
          <Sparkles size={20} color="#ffb955" />
          <span>{t('booking:vouchers_vault_title', 'Ví Voucher & Ưu Đãi Độc Quyền')}</span>
        </h2>
        <span className="sub">
          {t(
            'booking:vouchers_vault_desc',
            'Các mã khuyến mãi đang có hiệu lực trong tài khoản thành viên VIP CinePass của bạn.',
          )}
        </span>
      </S.VoucherSectionHeader>

      <S.VouchersGrid>
        {vouchers.map((voucher) => (
          <S.VoucherCard key={voucher.id}>
            <div className="top-row">
              <span className="code-badge">{voucher.code}</span>
              <span className="discount-val">{voucher.discount}</span>
            </div>

            <div className="title">{voucher.title}</div>
            <div className="desc">{voucher.desc}</div>

            <div className="bottom-row">
              <span className="expiry">{voucher.expiry}</span>
              <button
                className="copy-btn"
                onClick={handleCopy(voucher.code)}
              >
                <Copy size={12} />
                <span>{t('booking:copy_code_btn', 'Sao chép mã')}</span>
              </button>
            </div>
          </S.VoucherCard>
        ))}
      </S.VouchersGrid>
    </div>
  );
}

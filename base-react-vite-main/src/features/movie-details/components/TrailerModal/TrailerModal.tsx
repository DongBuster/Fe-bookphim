import { useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Film } from 'lucide-react';
import * as S from './TrailerModal.styles';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerUrl?: string;
  title?: string;
}

/**
 * Normalizes any YouTube URL variant into an embeddable URL:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * Uses privacy-enhanced domain: https://www.youtube-nocookie.com/embed/VIDEO_ID?autoplay=1&rel=0
 */
export function formatYouTubeEmbedUrl(url?: string, autoplay = true): string | null {
  if (!url || typeof url !== 'string' || !url.trim()) return null;

  const trimmed = url.trim();

  // If already an embed URL, ensure proper query params
  if (trimmed.includes('youtube.com/embed/') || trimmed.includes('youtube-nocookie.com/embed/')) {
    if (autoplay && !trimmed.includes('autoplay=')) {
      return trimmed.includes('?') ? `${trimmed}&autoplay=1&rel=0` : `${trimmed}?autoplay=1&rel=0`;
    }
    return trimmed;
  }

  // Extract 11-char YouTube ID from any standard formats
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );

  if (match && match[1]) {
    const videoId = match[1];
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0`;
  }

  // If it's a direct video link or another valid HTTPS embed link, return as is
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    return trimmed;
  }

  return null;
}

export const TrailerModal: FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  trailerUrl,
  title,
}) => {
  const { t } = useTranslation();

  const embedUrl = useMemo(() => formatYouTubeEmbedUrl(trailerUrl, true), [trailerUrl]);

  if (!isOpen) return null;

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <S.TrailerModal onClick={onClose}>
      <div className="modal-content" onClick={handleContentClick}>
        <button
          type="button"
          className="close-btn"
          onClick={onClose}
          aria-label={t('movie:close_trailer', 'Đóng trailer')}
        >
          <X size={18} />
        </button>

        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={`${title || 'Phim'} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="trailer-fallback">
            <Film size={48} className="fallback-icon" />
            <h4 className="fallback-title">{t('movie:trailer_unavailable_title', 'Trailer chưa sẵn sàng')}</h4>
            <p className="fallback-desc">
              {t('movie:trailer_unavailable_desc', 'Video trailer của phim này đang được cập nhật. Vui lòng quay lại sau!')}
            </p>
          </div>
        )}
      </div>
    </S.TrailerModal>
  );
};

export default TrailerModal;

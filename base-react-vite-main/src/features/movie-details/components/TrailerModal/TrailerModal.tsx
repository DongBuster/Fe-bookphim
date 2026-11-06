import { useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Film, ExternalLink } from 'lucide-react';
import * as S from './TrailerModal.styles';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerUrl?: string;
  title?: string;
}

export interface ParsedTrailerUrls {
  embedUrl: string | null;
  watchUrl: string | null;
}

/**
 * Normalizes any YouTube URL variant into privacy-enhanced embed & watch URLs:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * Always returns https://www.youtube-nocookie.com/embed/VIDEO_ID?autoplay=1&rel=0
 */
export function formatYouTubeEmbedUrl(url?: string, autoplay = true): ParsedTrailerUrls {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { embedUrl: null, watchUrl: null };
  }

  const trimmed = url.trim();

  // Extract 11-char YouTube video ID across all known patterns
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );

  if (match && match[1]) {
    const videoId = match[1];
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0`,
      watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    };
  }

  // Fallback for valid external video URLs
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    return {
      embedUrl: trimmed,
      watchUrl: trimmed,
    };
  }

  return { embedUrl: null, watchUrl: null };
}

export const TrailerModal: FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  trailerUrl,
  title,
}) => {
  const { t } = useTranslation();

  const { embedUrl, watchUrl } = useMemo(
    () => formatYouTubeEmbedUrl(trailerUrl, true),
    [trailerUrl]
  );

  if (!isOpen) return null;

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <S.TrailerModal onClick={onClose}>
      <div className="modal-content" onClick={handleContentClick}>
        <div className="modal-header-bar">
          <span className="trailer-title" title={title}>
            {title ? `${title} • Trailer` : t('movie:trailer', 'Trailer')}
          </span>
          <div className="header-actions">
            {watchUrl && (
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="external-link-btn"
                title={t('movie:watch_on_youtube', 'Mở trên YouTube')}
              >
                <ExternalLink size={14} />
                <span>YouTube</span>
              </a>
            )}
            <button
              type="button"
              className="close-btn"
              onClick={onClose}
              aria-label={t('movie:close_trailer', 'Đóng trailer')}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="player-container">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={`${title || 'Phim'} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
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
      </div>
    </S.TrailerModal>
  );
};

export default TrailerModal;

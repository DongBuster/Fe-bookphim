import { useMemo, useState, useEffect, type FC } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import {
  X,
  Film,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Play,
  ListVideo,
} from 'lucide-react';
import * as S from './TrailerModal.styles';

export interface TrailerPlaylistItem {
  id: string | number;
  title: string;
  subTitle?: string;
  trailerUrl: string;
  posterUrl?: string;
  badge?: string;
}

export interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlist?: TrailerPlaylistItem[];
  initialIndex?: number;
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
 * Always returns https://www.youtube-nocookie.com/embed/VIDEO_ID?autoplay=1&rel=0&enablejsapi=1
 */
export function formatYouTubeEmbedUrl(
  url?: string,
  autoplay = true,
): ParsedTrailerUrls {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { embedUrl: null, watchUrl: null };
  }

  const trimmed = url.trim();

  // Extract 11-char YouTube video ID across all known patterns
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/,
  );

  if (match && match[1]) {
    const videoId = match[1];
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&enablejsapi=1`,
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
  playlist,
  initialIndex = 0,
  trailerUrl,
  title,
}) => {
  const { t } = useTranslation();

  // Normalize into standard playlist
  const items: TrailerPlaylistItem[] = useMemo(() => {
    if (playlist && playlist.length > 0) return playlist;
    if (trailerUrl) {
      return [
        {
          id: 'single',
          title: title || 'Trailer',
          trailerUrl,
        },
      ];
    }
    return [];
  }, [playlist, trailerUrl, title]);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Sync index when modal opens or initialIndex changes
  useEffect(() => {
    if (isOpen) {
      const validIndex = Math.max(
        0,
        Math.min(initialIndex, Math.max(0, items.length - 1)),
      );
      setCurrentIndex(validIndex);
    }
  }, [isOpen, initialIndex, items.length]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  const currentItem: TrailerPlaylistItem | undefined = items[currentIndex] || items[0];

  const { embedUrl, watchUrl } = useMemo(
    () => formatYouTubeEmbedUrl(currentItem?.trailerUrl, true),
    [currentItem?.trailerUrl],
  );

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (hasPrev) setCurrentIndex((i) => i - 1);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (hasNext) setCurrentIndex((i) => i + 1);
  };

  const handleSelectIndex = (idx: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(idx);
  };

  // Keyboard navigation: Escape to close, Left/Right arrows to step
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && hasPrev) {
        setCurrentIndex((i) => i - 1);
      } else if (e.key === 'ArrowRight' && hasNext) {
        setCurrentIndex((i) => i + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasPrev, hasNext, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const modalNode = (
    <S.TrailerModalOverlay
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="trailer-modal-title"
    >
      <S.ModalContainer onClick={handleContentClick}>
        {/* Modal Header */}
        <S.ModalHeaderBar>
          <S.MovieInfoGroup>
            <div className="badge-row">
              <span className="trailer-tag">
                {currentItem?.badge || t('movie:trailer_tag', 'TRAILER 4K')}
              </span>
              {items.length > 1 && (
                <span className="trailer-tag" style={{ background: 'rgba(255, 185, 85, 0.15)', color: '#FFB955' }}>
                  {t('movie:consecutive_playlist', 'PHÁT LIÊN TIẾP')}
                </span>
              )}
            </div>
            <span
              id="trailer-modal-title"
              className="trailer-title"
              title={currentItem?.title}
            >
              {currentItem?.title || title || t('movie:trailer', 'Trailer')}
            </span>
            {currentItem?.subTitle && (
              <span className="trailer-sub">{currentItem.subTitle}</span>
            )}
          </S.MovieInfoGroup>

          <S.HeaderActions>
            {/* Playlist Step Navigation */}
            {items.length > 1 && (
              <div className="playlist-counter-pill">
                <button
                  type="button"
                  className="step-btn"
                  onClick={handlePrev}
                  disabled={!hasPrev}
                  title={t('movie:prev_video', 'Video trước')}
                  aria-label={t('movie:prev_video', 'Video trước')}
                >
                  <ChevronLeft size={16} />
                </button>
                <span>
                  {String(currentIndex + 1).padStart(2, '0')} /{' '}
                  {String(items.length).padStart(2, '0')}
                </span>
                <button
                  type="button"
                  className="step-btn"
                  onClick={handleNext}
                  disabled={!hasNext}
                  title={t('movie:next_video', 'Video kế tiếp')}
                  aria-label={t('movie:next_video', 'Video kế tiếp')}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* External YouTube Link */}
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

            {/* Close Button */}
            <button
              type="button"
              className="close-btn"
              onClick={onClose}
              aria-label={t('movie:close_trailer', 'Đóng trailer')}
            >
              <X size={18} />
            </button>
          </S.HeaderActions>
        </S.ModalHeaderBar>

        {/* Video Player Box */}
        <S.PlayerWrapper>
          {embedUrl ? (
            <iframe
              key={embedUrl}
              src={embedUrl}
              title={`${currentItem?.title || 'Phim'} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <S.FallbackContainer>
              <Film size={48} className="fallback-icon" />
              <h4 className="fallback-title">
                {t('movie:trailer_unavailable_title', 'Trailer chưa sẵn sàng')}
              </h4>
              <p className="fallback-desc">
                {t(
                  'movie:trailer_unavailable_desc',
                  'Video trailer của phim này đang được cập nhật. Vui lòng quay lại sau!',
                )}
              </p>
            </S.FallbackContainer>
          )}

          {/* Floating Next / Prev Chevrons over Video */}
          {items.length > 1 && hasPrev && (
            <S.FloatingNavButton
              $direction="prev"
              type="button"
              onClick={handlePrev}
              title={t('movie:prev_video', 'Video trước')}
              aria-label={t('movie:prev_video', 'Video trước')}
            >
              <ChevronLeft size={24} />
            </S.FloatingNavButton>
          )}

          {items.length > 1 && hasNext && (
            <S.FloatingNavButton
              $direction="next"
              type="button"
              onClick={handleNext}
              title={t('movie:next_video', 'Video kế tiếp')}
              aria-label={t('movie:next_video', 'Video kế tiếp')}
            >
              <ChevronRight size={24} />
            </S.FloatingNavButton>
          )}
        </S.PlayerWrapper>

        {/* Playlist Strip for Consecutive Playback */}
        {items.length > 1 && (
          <S.PlaylistSection>
            <S.PlaylistHeader>
              <div className="playlist-title">
                <ListVideo size={14} color="#FF535A" />
                <span>
                  {t('movie:playlist_label', 'DANH SÁCH TRAILER LIÊN TIẾP')} (
                  {items.length} VIDEO)
                </span>
              </div>
              <span className="playlist-hint">
                {t('movie:click_to_switch', 'Nhấn vào video để chuyển nhanh')}
              </span>
            </S.PlaylistHeader>

            <S.PlaylistRow>
              {items.map((item, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <S.PlaylistItemCard
                    key={item.id}
                    type="button"
                    $isActive={isActive}
                    onClick={handleSelectIndex(idx)}
                    title={item.title}
                  >
                    <div className="item-thumb-box">
                      {item.posterUrl ? (
                        <img src={item.posterUrl} alt={item.title} />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            background: '#222',
                          }}
                        />
                      )}
                      <div className="play-icon-overlay">
                        <Play size={12} fill="#FFFFFF" />
                      </div>
                    </div>
                    <div className="item-meta">
                      <span className="item-title">{item.title}</span>
                      <span className="item-status">
                        {isActive ? (
                          <>
                            <span
                              style={{
                                display: 'inline-block',
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: '#FF535A',
                              }}
                            />
                            {t('movie:now_playing', 'Đang phát')}
                          </>
                        ) : (
                          item.badge || `Video ${idx + 1}`
                        )}
                      </span>
                    </div>
                  </S.PlaylistItemCard>
                );
              })}
            </S.PlaylistRow>
          </S.PlaylistSection>
        )}
      </S.ModalContainer>
    </S.TrailerModalOverlay>
  );

  return createPortal(modalNode, document.body);
};

export default TrailerModal;

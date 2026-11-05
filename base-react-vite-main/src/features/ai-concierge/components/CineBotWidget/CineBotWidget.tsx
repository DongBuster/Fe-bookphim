import type { FC, FormEvent } from 'react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, Send, Bot, Loader2 } from 'lucide-react';
import {
  chatWithConciergeAiApi,
  getQuickAiRecommendationsApi,
} from '../../api/cinebot.api';
import type {
  ConciergeChatMessage,
  ConciergeChatResponseData,
  RecommendedMovieDto,
  BookingDraftDto,
} from '@shared/types/api.types';
import * as S from './CineBotWidget.styles';

interface ExtendedMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  recommendedMovies?: RecommendedMovieDto[];
  bookingDraft?: BookingDraftDto;
  suggestedReplies?: string[];
}

export const CineBotWidget: FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ExtendedMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content:
        'Xin chào! Tôi là CineBot - trợ lý điện ảnh AI của PhimBook. Bạn muốn tìm phim thuộc gu nào, suất chiếu ở đâu hôm nay?',
      suggestedReplies: [
        'Gợi ý phim hot tuần này',
        'Phim hành động kịch tính',
        'Tìm suất chiếu tối nay tại TP. HCM',
      ],
    },
  ]);

  // Load quick recommendations on first open
  useEffect(() => {
    if (isOpen && messages.length === 1) {
      getQuickAiRecommendationsApi()
        .then((data) => {
          if (data?.trendingMovies && data.trendingMovies.length > 0) {
            setMessages((prev) => [
              ...prev,
              {
                id: 'quick-rec',
                role: 'model',
                content: `✨ ${data.recommendationTopic || 'Phim đang được quan tâm nhất hôm nay'}:`,
                recommendedMovies: data.trendingMovies.slice(0, 3).map((m) => ({
                  id: m.id,
                  title: m.title,
                  slug: m.slug,
                  posterUrl: m.posterUrl,
                  imdbRating: m.imdbRating,
                  genre: m.genres?.[0] || 'Điện ảnh',
                  matchReason: 'Top thịnh hành',
                })),
              },
            ]);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ExtendedMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build conversation history for API
      const conversationHistory: ConciergeChatMessage[] = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res: ConciergeChatResponseData = await chatWithConciergeAiApi({
        message: text,
        conversationHistory,
      });

      const botMsg: ExtendedMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        content:
          res.reply ||
          'Tôi đã hiểu yêu cầu của bạn. Bạn muốn tham khảo thêm chi tiết nào nữa không?',
        recommendedMovies: res.recommendedMovies,
        bookingDraft: res.bookingDraft,
        suggestedReplies: res.suggestedReplies,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      // Fallback friendly reply if API is down
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          content:
            'CineBot đang nhận lượng yêu cầu cao từ phòng vé. Bạn có thể duyệt trực tiếp danh sách phim tại trang Khám Phá nhé!',
          suggestedReplies: ['Mở trang Khám Phá', 'Xem suất chiếu hôm nay'],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleSelectMovie = (slug: string) => {
    setIsOpen(false);
    navigate(`/phim/${slug}`);
  };

  const handleSelectSuggestedReply = (reply: string) => {
    if (reply === 'Mở trang Khám Phá') {
      setIsOpen(false);
      navigate('/kham-pha');
      return;
    }
    handleSendMessage(reply);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <S.FloatingButton
        type="button"
        $isOpen={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="CineBot AI Concierge"
        title="Trợ lý điện ảnh AI"
      >
        <div className="bot-icon">
          <Sparkles size={16} />
        </div>
        <span>CineBot AI</span>
      </S.FloatingButton>

      {/* Floating Chat Panel */}
      <S.ChatPanel $isOpen={isOpen}>
        {/* Chat Header */}
        <S.ChatHeader>
          <div className="header-left">
            <div className="header-avatar">
              <Bot size={18} />
            </div>
            <div className="header-info">
              <h4>CineBot AI Concierge</h4>
              <span>Trực tuyến 24/7 • Gemini Pro</span>
            </div>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Đóng chat"
          >
            <X size={18} />
          </button>
        </S.ChatHeader>

        {/* Messages Body */}
        <S.MessagesContainer>
          {messages.map((m) => (
            <S.MessageRow key={m.id} $isUser={m.role === 'user'}>
              <S.MessageBubble $isUser={m.role === 'user'}>
                {m.content}

                {/* Recommended Movies Cards */}
                {m.recommendedMovies && m.recommendedMovies.length > 0 && (
                  <div style={{ marginTop: 6 }}>
                    {m.recommendedMovies.map((movie) => (
                      <S.MovieRecommendCard
                        key={movie.id}
                        onClick={() => handleSelectMovie(movie.slug)}
                      >
                        <img src={movie.posterUrl} alt={movie.title} />
                        <div className="meta">
                          <span className="title">{movie.title}</span>
                          <span className="genre">{movie.genre}</span>
                          {movie.matchReason && (
                            <span className="reason">💡 {movie.matchReason}</span>
                          )}
                        </div>
                      </S.MovieRecommendCard>
                    ))}
                  </div>
                )}

                {/* Booking Draft Preview */}
                {m.bookingDraft && (
                  <S.DraftTicketCard>
                    <span className="draft-header">🎟️ Suất Chiếu Đề Xuất</span>
                    <span className="draft-title">{m.bookingDraft.movieTitle}</span>
                    <span className="draft-details">
                      {m.bookingDraft.theaterName} • {m.bookingDraft.time} •{' '}
                      {m.bookingDraft.format || '2D'}
                    </span>
                    {m.bookingDraft.movieId && (
                      <button
                        type="button"
                        className="draft-action"
                        onClick={() =>
                          handleSelectMovie(m.bookingDraft?.movieId || '')
                        }
                      >
                        Đặt vé ngay
                      </button>
                    )}
                  </S.DraftTicketCard>
                )}

                {/* Suggested Replies Chips */}
                {m.suggestedReplies && m.suggestedReplies.length > 0 && (
                  <S.SuggestedReplies>
                    {m.suggestedReplies.map((reply, idx) => (
                      <button
                        key={`rep-${idx}`}
                        type="button"
                        className="chip"
                        onClick={() => handleSelectSuggestedReply(reply)}
                      >
                        {reply}
                      </button>
                    ))}
                  </S.SuggestedReplies>
                )}
              </S.MessageBubble>
            </S.MessageRow>
          ))}

          {/* AI Thinking Indicator */}
          {isLoading && (
            <S.MessageRow $isUser={false}>
              <S.MessageBubble $isUser={false} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Loader2 size={14} className="animate-spin" color="#ffb955" />
                <span>CineBot đang tìm kiếm suất chiếu phù hợp...</span>
              </S.MessageBubble>
            </S.MessageRow>
          )}

          <div ref={messagesEndRef} />
        </S.MessagesContainer>

        {/* Input Footer */}
        <S.ChatFooter onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Hỏi về phim, rạp chiếu, giá vé..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            aria-label="Gửi tin nhắn"
          >
            <Send size={15} />
          </button>
        </S.ChatFooter>
      </S.ChatPanel>
    </>
  );
};

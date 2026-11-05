import styled, { keyframes } from 'styled-components';
import { media } from '@/styles/breakpoints';

const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 185, 85, 0.5);
  }
  70% {
    box-shadow: 0 0 0 14px rgba(255, 185, 85, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 185, 85, 0);
  }
`;

export const FloatingButton = styled.button<{ $isOpen: boolean }>`
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  height: 48px;
  border-radius: 9999px;
  background: linear-gradient(135deg, #1c1b1c 0%, #292829 100%);
  border: 1px solid rgba(255, 185, 85, 0.4);
  color: #ffb955;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 185, 85, 0.25);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  animation: ${pulseGlow} 2.5s infinite;

  &:hover {
    transform: translateY(-2px) scale(1.03);
    border-color: rgba(255, 185, 85, 0.7);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.8), 0 0 28px rgba(255, 185, 85, 0.4);
    color: #ffffff;
  }

  .bot-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff535a 0%, #ffb955 100%);
    color: #3b0008;
  }

  @media ${media.sm} {
    bottom: 20px;
    right: 16px;
    padding: 10px 14px;
    height: 42px;
    font-size: 12px;
  }
`;

export const ChatPanel = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  bottom: 88px;
  right: 28px;
  width: 380px;
  height: 540px;
  max-height: calc(100vh - 120px);
  z-index: 1001;
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  background: rgba(18, 17, 18, 0.94);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 185, 85, 0.25);
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 185, 85, 0.15);
  overflow: hidden;
  animation: fadeIn 0.25s ease-out;

  @media ${media.sm} {
    right: 12px;
    left: 12px;
    bottom: 74px;
    width: auto;
    height: 480px;
  }
`;

export const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: rgba(28, 27, 28, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;

    .header-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ff535a 0%, #ffb955 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3b0008;
      box-shadow: 0 0 10px rgba(255, 185, 85, 0.4);
    }

    .header-info {
      display: flex;
      flex-direction: column;

      h4 {
        margin: 0;
        font-size: 13.5px;
        font-weight: 700;
        color: #ffffff;
      }

      span {
        font-size: 11px;
        color: #52b788;
        display: flex;
        align-items: center;
        gap: 4px;

        &::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #52b788;
        }
      }
    }
  }

  .close-btn {
    background: transparent;
    border: none;
    color: #8c8994;
    cursor: pointer;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;

    &:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
  }
`;

export const MessageRow = styled.div<{ $isUser: boolean }>`
  display: flex;
  flex-direction: ${({ $isUser }) => ($isUser ? 'row-reverse' : 'row')};
  align-items: flex-start;
  gap: 8px;
`;

export const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 82%;
  padding: 10px 14px;
  border-radius: ${({ $isUser }) => ($isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px')};
  background: ${({ $isUser }) =>
    $isUser
      ? 'linear-gradient(135deg, #ff535a 0%, #d83d44 100%)'
      : 'rgba(32, 31, 33, 0.95)'};
  border: 1px solid
    ${({ $isUser }) =>
      $isUser ? 'transparent' : 'rgba(255, 255, 255, 0.08)'};
  color: ${({ $isUser }) => ($isUser ? '#ffffff' : '#e5e2e3')};
  font-size: 13px;
  line-height: 1.45;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  word-break: break-word;
`;

export const MovieRecommendCard = styled.div`
  display: flex;
  gap: 10px;
  padding: 8px;
  background: rgba(22, 21, 22, 0.9);
  border: 1px solid rgba(255, 185, 85, 0.2);
  border-radius: 12px;
  margin-top: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: rgba(255, 185, 85, 0.5);
    background: rgba(28, 27, 29, 0.95);
    transform: translateY(-1px);
  }

  img {
    width: 48px;
    height: 70px;
    border-radius: 6px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .meta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    min-width: 0;

    .title {
      font-size: 12.5px;
      font-weight: 700;
      color: #ffffff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .genre {
      font-size: 11px;
      color: #ffb955;
    }

    .reason {
      font-size: 10.5px;
      color: #8c8994;
      line-height: 1.3;
    }
  }
`;

export const DraftTicketCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 185, 85, 0.15) 0%, rgba(255, 83, 90, 0.1) 100%);
  border: 1px dashed #ffb955;
  border-radius: 12px;
  padding: 10px 12px;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  .draft-header {
    font-size: 11px;
    font-weight: 700;
    color: #ffb955;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .draft-title {
    font-size: 13px;
    font-weight: 700;
    color: #ffffff;
  }

  .draft-details {
    font-size: 11px;
    color: #ae8786;
  }

  .draft-action {
    margin-top: 4px;
    padding: 6px 12px;
    background: #ff535a;
    border: none;
    border-radius: 6px;
    color: #ffffff;
    font-size: 11.5px;
    font-weight: 700;
    cursor: pointer;
    align-self: flex-start;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.9;
    }
  }
`;

export const SuggestedReplies = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;

  .chip {
    padding: 5px 10px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 9999px;
    font-size: 11.5px;
    color: #e5e2e3;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(255, 185, 85, 0.15);
      border-color: rgba(255, 185, 85, 0.4);
      color: #ffb955;
    }
  }
`;

export const ChatFooter = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: rgba(24, 23, 24, 0.98);
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  input {
    flex: 1;
    background: rgba(35, 34, 35, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 9999px;
    padding: 8px 14px;
    font-size: 13px;
    color: #ffffff;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: rgba(255, 185, 85, 0.5);
    }

    &::placeholder {
      color: #8c8994;
      font-size: 12px;
    }
  }

  button {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff535a 0%, #ffb955 100%);
    border: none;
    color: #3b0008;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: transform 0.2s;

    &:hover:not(:disabled) {
      transform: scale(1.05);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

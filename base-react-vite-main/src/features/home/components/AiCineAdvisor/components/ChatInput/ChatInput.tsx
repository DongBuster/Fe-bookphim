import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as S from '../../AiCineAdvisor.styles';

export const ChatInput: FC = () => {
  const { t } = useTranslation();
  const [val, setVal] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = val.trim();
    if (!text) return;
    window.dispatchEvent(
      new CustomEvent('phimbook:open-cinebot', { detail: { message: text } }),
    );
    setVal('');
  };

  return (
    <S.ChatInputArea as="form" onSubmit={handleSubmit}>
      <S.ChatInput
        placeholder={t('home:advisor.input_placeholder')}
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
      <S.SendButton type="submit" aria-label={t('home:advisor.send_btn')}>
        <Send size={16} />
      </S.SendButton>
    </S.ChatInputArea>
  );
};

import { CinematicLetterbox } from '@/shared/animations/components/CinematicLetterbox/CinematicLetterbox';
import { HeroSpotlight } from './components/HeroSpotlight/HeroSpotlight';
import { NowShowing } from './components/NowShowing/NowShowing';
import { AiCineAdvisor } from './components/AiCineAdvisor/AiCineAdvisor';
import { ExclusiveOffers } from './components/ExclusiveOffers/ExclusiveOffers';
import { LuxuryCinemas } from './components/LuxuryCinemas/LuxuryCinemas';
import { Newsletter } from './components/Newsletter/Newsletter';

import * as S from './Home.styles';

export default function Home() {
  return (
    <S.HomeContainer>
      <CinematicLetterbox />
      <HeroSpotlight />
      <NowShowing />
      <div id="ai-tro-ly">
        <AiCineAdvisor />
      </div>
      <div id="uu-dai">
        <ExclusiveOffers />
      </div>
      <div id="rap-chieu">
        <LuxuryCinemas />
      </div>
      <Newsletter />
    </S.HomeContainer>
  );
}

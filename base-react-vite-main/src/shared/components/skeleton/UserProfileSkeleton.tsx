import type { FC } from 'react';
import styled from 'styled-components';
import { Skeleton } from './Skeleton';

const Card = styled.div`
  background: var(--bg-card, #1c1b1c);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const UserProfileSkeleton: FC = () => {
  return (
    <Card>
      {/* Header */}
      <HeaderRow>
        <Skeleton circle width={40} height={40} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          <Skeleton width="35%" height={18} borderRadius={4} />
          <Skeleton width="55%" height={12} borderRadius={4} />
        </div>
      </HeaderRow>

      {/* Row 1: Full name & Nickname */}
      <FormRow>
        <FormGroup>
          <Skeleton width="30%" height={12} borderRadius={4} />
          <Skeleton width="100%" height={44} borderRadius={8} />
        </FormGroup>
        <FormGroup>
          <Skeleton width="25%" height={12} borderRadius={4} />
          <Skeleton width="100%" height={44} borderRadius={8} />
        </FormGroup>
      </FormRow>

      {/* Row 2: DOB & Gender */}
      <FormRow>
        <FormGroup>
          <Skeleton width="30%" height={12} borderRadius={4} />
          <Skeleton width="100%" height={44} borderRadius={8} />
        </FormGroup>
        <FormGroup>
          <Skeleton width="25%" height={12} borderRadius={4} />
          <Skeleton width="100%" height={44} borderRadius={8} />
        </FormGroup>
      </FormRow>

      {/* Row 3: Email */}
      <FormGroup>
        <Skeleton width="20%" height={12} borderRadius={4} />
        <Skeleton width="100%" height={44} borderRadius={8} />
      </FormGroup>

      {/* Row 4: Phone */}
      <FormGroup>
        <Skeleton width="20%" height={12} borderRadius={4} />
        <Skeleton width="100%" height={44} borderRadius={8} />
      </FormGroup>

      {/* Row 5: City & Cinema */}
      <FormRow>
        <FormGroup>
          <Skeleton width="30%" height={12} borderRadius={4} />
          <Skeleton width="100%" height={44} borderRadius={8} />
        </FormGroup>
        <FormGroup>
          <Skeleton width="35%" height={12} borderRadius={4} />
          <Skeleton width="100%" height={44} borderRadius={8} />
        </FormGroup>
      </FormRow>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
        <Skeleton width={140} height={44} borderRadius={8} />
      </div>
    </Card>
  );
};

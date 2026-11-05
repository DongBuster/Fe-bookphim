import styled from 'styled-components';

export const SearchForm = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const SearchBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 16px;
  width: 100%;
  height: 38px;
  background: rgba(28, 27, 28, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  transition: all 0.25s ease;
  backdrop-filter: blur(12px);

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(32, 31, 32, 0.95);
  }

  &:focus-within {
    background: rgba(35, 34, 35, 0.98);
    border-color: rgba(255, 83, 90, 0.5);
    box-shadow: 0 0 16px rgba(255, 83, 90, 0.25);

    .search-icon {
      color: #ff535a;
    }
  }

  input {
    background: transparent;
    border: none;
    outline: none;
    color: #ffffff;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 13px;
    line-height: 18px;
    letter-spacing: 0.2px;
    width: 100%;
    margin-left: 10px;

    &::placeholder {
      color: #ae8786;
      font-size: 13px;
    }
  }

  .search-icon {
    color: #ae8786;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    transition: color 0.2s ease;
  }

  .clear-btn {
    background: transparent;
    border: none;
    color: #ae8786;
    cursor: pointer;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

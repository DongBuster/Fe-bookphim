import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&display=swap");

  :root {
    /* PhimBook Cinema Design Tokens (Cinema Noir Theme) */
    --primary: #ff535a;
    --primary-sub: #e01e35;
    --primary-hover: #ff7b54;
    --secondary: #ffb955;
    --secondary-hover: #ffc875;
    --tertiary: #8c90a4;
    --primary-gold: #ffb955;
    --primary-gold-bg: rgba(255, 185, 85, 0.12);
    --primary-text: #ffffff;
    --primary-title: #ffffff;
    --primary-subtitle: #ae8786;
    --primary-bg-highlight: #ff535a;
    --primary-border: rgba(255, 255, 255, 0.12);
    --primary-bg-hover: rgba(255, 83, 90, 0.12);
    --gradient-primary: linear-gradient(135deg, #ff535a 0%, #ff7b54 50%, #ffb955 100%);
    
    /* Backgrounds */
    --bg-primary: #0b0b0c;
    --bg-secondary: #131314;
    --bg-card: #1c1b1c;
    --bg-elevated: #201f20;
    --bg-glass: rgba(28, 27, 28, 0.7);
    --bg-thirt: rgba(42, 42, 43, 0.6);
    --bg-icon-action: rgba(255, 255, 255, 0.08);
    --bg-tooltip: #201f20;

    --bg-disabled: #2a2a2b;
    --bg-hover-primary: rgba(255, 83, 90, 0.15);
    --bg-info: rgba(23, 143, 226, 0.15);

    --bg-success: rgba(52, 199, 89, 0.15);
    --bg-danger: rgba(255, 83, 90, 0.15);
    --bg-warning: rgba(255, 185, 85, 0.15);

    /* Typography */
    --text-primary: #ffffff;
    --text-secondary: #ae8786;
    --text-muted: #8c90a4;
    --text-ternary: #8c90a4;
    --text-disabled: #555558;

    --text-success: #34c759;
    --text-warning: #ffb955;
    --text-error: #ff535a;

    --btn-hover-primary: #5f172a;
    --hover-primary: rgba(255, 83, 90, 0.15);

    /* Tables & Lists (Dark Cinema Themed) */
    --table-header-bg: #201f20;
    --table-row-hover-color: rgba(255, 83, 90, 0.08);
    --table-row-disabled: #2a2a2b;

    /* Icons */
    --icon-primary: #e5e2e3;
    --icon-secondary: #ae8786;
    --icon-gray: #8c90a4;

    /* Borders */
    --border-primary: rgba(255, 255, 255, 0.12);
    --border-secondary: rgba(255, 255, 255, 0.08);
    --border-success: rgba(52, 199, 89, 0.5);
    --border-danger: rgba(255, 83, 90, 0.5);
    --border-warning: rgba(255, 185, 85, 0.5);

    /* Other Colors */
    --white: #ffffff;
    --surface-elevated: #201f20;
    --error: #ff535a;
    --hover-error: #ff7b54;
    --info: #178fe2;
    --yellow: #ffb955;
    --warning: #ffb955;
    --purple: #af52de;
    --success: #34c759;

    /* Sizes / Spacing */
    --container: 132rem;
    --sidebar-width: 32rem;
    --table-row-height: 4.8rem;
    --header-height: 4.8rem;
    --modal-max-height: calc(95vh - 7.2rem);
    --base-input-width: 100%;
    --breadcrumb-height: 6.4rem;
    --modal-width-lg: 107rem;
    --gap-global: 1.2rem;

    /* Shared responsive layout tokens */
    --content-max-width: 1280px;
    --page-gutter: 24px;
    --page-gutter-compact: 16px;
    --header-public-height: 80px;
    --page-top-offset: calc(var(--header-public-height, 80px) + 20px);

    --shadow: 0px 2px 8px 1px #00000024;

    /* Charts */
    --chart-green: #34c759;
    --chart-yellow: #ffb955;
    --chart-orange: #ff7b54;
    --chart-red: #ff535a;

    /* UI variables mapped from Figma / Cinema Noir Design */
    --on-primary-dark: #680010;
    --on-primary-darker: #5b000d;
    --primary-tint: #ffb3b0;
    --on-secondary-dark: #4f3100;
    --text-secondary-alt: #e7bcba;
    --text-ternary-alt: #e2dce8;
    --bg-card-alt: #1a1a1b;
    --bg-border-light: #353436;
    --bg-border-lighter: #3a393a;
    --bg-border-lightest: #4a494a;
  }

  /* BASE HTML FONT-SIZE */
  html {
    font-size: 62.5%; /* 1rem = 10px, 10/16 = 62.5% */
    max-width: 100%;
    color-scheme: dark;
  }

  /* RESET */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body, #root {
    min-height: 100%;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    margin: 0;
    padding: 0;
    font-family: 'Be Vietnam Pro', sans-serif;
    background-color: var(--bg-primary);
    color: var(--text-primary);
  }

  button {
    background-color: transparent;
    outline: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  p, h1, h2, h3, h4, h5, h6 {
    margin-bottom: 0;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  img {
    max-width: 100%;
    max-height: 100%;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    -ms-user-drag: none;
  }

  input, button, textarea, select {
    font: inherit;
  }

  select option {
    background-color: var(--bg-card);
    color: var(--text-primary);
  }

  @media only screen and (max-width: 48em) {
    :root {
      --page-gutter: var(--page-gutter-compact);
      --header-public-height: 68px;
      --page-top-offset: calc(var(--header-public-height, 68px) + 12px);
    }
  }
`;

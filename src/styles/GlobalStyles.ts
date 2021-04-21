import { createGlobalStyle, css } from "styled-components"

export const GlobalStyles = createGlobalStyle`
  ${({ theme }) => css`
    * {
      box-sizing: border-box;

      margin: 0;
      padding: 0;
    }

    @media (max-width: 1080px) {
      html {
        font-size: 93.75%;
      }
    }

    @media (max-width: 720px) {
      html {
        font-size: 87.5%;
      }
    }

    body {
      background: ${theme.gray50};
    }

    body,
    input,
    textarea,
    button {
      font: 500 1rem sans-serif;
      color: ${theme.gray500};
    }

    h1 {
      font-size: 2rem;
    }

    h2 {
      font-size: 1.5rem;
    }

    button {
      cursor: pointer;
    }
  `}
`
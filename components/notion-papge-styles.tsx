/** @jsxImportSource @emotion/react */
import { css, darken, Theme } from '@mui/material'

export function getNotionStyleOverides(theme: Theme) {
  return css`
    position: relative;
    /* overflow-x: hidden; */

    background: ${theme.palette.background.default};
    .notion-collection-card-body {
      background: ${theme.palette.background.paper};
    }
    svg.notion-page-icon {
      background-color: ${theme.palette.divider};
      border-radius: 10rem;
      path {
        display: none;
      }
    }
    .notion-collection-card-cover {
      background: ${theme.palette.background.paper};
      border-bottom: none;
    }
    .notion-collection-row {
      border-bottom: 1px solid ${theme.palette.divider};
    }
    .notion-gallery-grid {
      border-top: 1px solid ${theme.palette.divider};
    }
    .notion-asset-wrapper iframe {
      background: ${theme.palette.background.default};
    }
    .breadcrumb:hover {
      border: none;
      outline: none;
    }
    .notion-header {
      background: rgba(0, 0, 0, 0);
      backdrop-filter: blur(1rem) brightness(0.8);
      position: fixed;
      bottom: 0;
      left: 0;
      top: auto;
      width: 100%;
      .notion-nav-header .breadcrumbs {
        /* width: 100%; */
        overflow-x: scroll;
      }
      .notion-search-button {
        @media only screen and (max-width: 800px) {
          span {
            display: none;
          }
        }
      }
      /* display: none; */
    }
    .dark-mode {
      background-color: ${theme.palette.background.default};
    }
    .notion-title {
      text-align: center;
      font-size: 3rem;
      /* font-family: "Product Sans", sans-serif; */
    }
    .notion-page-title-text {
      /* font-family: "Product Sans", sans-serif; */
      font-family: 'Circular Std', sans-serif;
    }
    .notion-page-title-icon,
    .notion-page-icon,
    .notion-page-icon-span {
      font-family: 'Times New Roman', Times, serif;
      text-align: center;
    }

    .notion-page-icon-wrapper {
      padding: 0 1rem;
      justify-content: center;
      /* justify-content: flex-start; */
      .notion-page-icon {
        /* border-radius: 50%; */
        overflow: hidden;
      }
    }
    .notion-page-cover {
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7));
    }
    .notion-file-icon {
      color: ${theme.palette.primary.main};
      fill: ${theme.palette.primary.main};
    }
    .notion-hr {
      border-color: ${theme.palette.divider};
    }
    .notion-page {
      padding-left: 1.6rem;
      padding-right: 1.6rem;
    }
    .notion-code {
      font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
        monospace;
    }
    .notion-page-title-text {
      border-bottom: 1px solid #494949;
    }
    .notion-text {
      color: ${theme.palette.text.secondary};
    }
    .notion-text a.notion-link {
      /* color: ${theme.palette.text.secondary}; */
      /* border-bottom: 1px solid ${theme.palette.primary.main}; */
      /* opacity: 0.9; */
    }
    .notion-page-link {
      color: inherit;
      font-family: inherit;
    }
    .notion-page-link:hover {
      outline-offset: -1px;
      /* outline: 1px solid ${darken(theme.palette.primary.main, 0.6)}; */
      background-color: ${theme.palette.background.paper};
      border-radius: 4px;
    }
    .notion-collection-card-cover-empty {
      background-color: ${theme.palette.background.paper};
    }
    .notion-property-multi_select-item {
      /* outline-offset: -1px; */
      /* padding: 1rem; */
      outline: 1px solid ${darken(theme.palette.primary.main, 0.5)};
    }
    .notion-collection-page-properties .notion-collection-row-body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      grid-auto-flow: column;
      @media only screen and (max-width: 800px) {
        display: flex;
      }
    }
    .notion-aside {
      background: rgba(0, 0, 0, 0);
      position: sticky;
      top: 148px;
      left: 0;
      z-index: 101;
      display: flex;
    }
    .notion-aside-table-of-contents {
      /* background: ${theme.palette.background.default}; */
      background: rgba(0, 0, 0, 0);
    }
    .notion-aside-table-of-contents-header {
      align-self: flex-start;
    }
    .notion-table-of-contents-active-item {
      color: ${theme.palette.primary.main} !important;
    }
    .notion-external-block {
      border: 1px solid ${theme.palette.divider};
    }
  `
}

import { css, Global } from '@emotion/react'
import { createTheme, PaletteOptions, useTheme } from '@mui/material'

export const defaultdarkpallete: PaletteOptions = {
  mode: 'dark',
  text: {
    primary: '#fff'
  },
  primary: {
    main: '#00FFCA'
  },
  secondary: {
    main: '#ff6060'
  },
  background: {
    paper: '#0e1118',
    default: '#06080c'
  }
}

export const defaultlightpallete: PaletteOptions = {
  mode: 'light',
  text: {
    primary: '#161616'
  },
  primary: {
    main: '#00FFCA'
  },
  secondary: {
    main: '#ff6060'
  },
  background: {
    default: '#ffffff',
    paper: '#f5ffff'
  }
}

// window.data = { accent, background };
export const GlobalStyle = () => {
  const theme = useTheme()
  // console.log(theme);
  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <Global
      styles={css`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          /* font-family: "Product Sans", sans-serif; */
        }
        body {
          background: ${theme.palette.background.default};
          color: ${theme.palette.text.primary};
        }
        .ReactModalPortal .notion-search {
          background: ${theme.palette.background.paper};
          .searchBar {
            color: ${theme.palette.getContrastText(
              theme.palette.background.paper
            )};
          }
          .searchBar .searchInput {
            color: ${theme.palette.getContrastText(
              theme.palette.background.paper
            )};
            background: ${theme.palette.background.paper};
          }
        }
      `}
    />
  )
}

export const defaultTheme = createTheme({
  palette: defaultdarkpallete,
  typography: {
    fontFamily: 'Product Sans'
  }
})

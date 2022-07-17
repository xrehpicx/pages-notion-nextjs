import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { Theme as ETheme } from '@emotion/react'
import { IThemer } from '../types'
import {
  GlobalStyle,
  defaultdarkpallete,
  defaultlightpallete,
  defaultTheme
} from '../theme'
import { ThemeOptions } from '@mui/material/styles'

type actionprops = {
  type: 'updatehw' | 'darkmode' | 'toggle' | 'lightmode' | 'global-warn'
  payload?: any
}

function reducer(state: ThemeOptions, action: actionprops): ETheme {
  switch (action.type) {
    case 'darkmode':
      return {
        ...state,
        palette: defaultdarkpallete
      }
    case 'lightmode':
      return {
        ...state,
        palette: defaultlightpallete
      }
    case 'updatehw':
      console.log(action.type)
      return state

    case 'toggle':
      return state.palette?.mode === 'dark'
        ? {
            ...state,
            palette: defaultlightpallete
          }
        : {
            ...state,
            palette: defaultdarkpallete
          }
    /* case "global-warn":
      if (!state.palette?.primary?.main) {
        return state;
      }
      localStorage.setItem("accent", state.palette.primary.main);
      return {
        ...state,
        palette: { ...state.palette },
      };
 */
    default:
      return {
        ...state,
        palette: defaultdarkpallete
      }
  }
}

export function useThemer() {
  const [theme, dispatch] = useReducer(reducer, defaultTheme)

  useEffect(() => {
    // dispatch({ type: "lightmode" });
  }, [])

  const toggle = useCallback(() => {
    dispatch({ type: 'toggle' })
  }, [])

  /* useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]); */

  return useMemo<IThemer>(() => {
    return { theme, Global: GlobalStyle, toggle, dispatch }
  }, [theme, toggle])
}

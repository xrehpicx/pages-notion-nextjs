// import { IStoryFields } from "./../@types/generated/contentful.d";
import React from 'react'
// import { DefaultTheme, GlobalStyleComponent } from "styled-components";

import { DefaultTheme } from '@mui/system'
export interface DefaultContextProps {
  themer: IThemer
}

export interface IThemer {
  theme: DefaultTheme
  Global: any
  toggle: () => void
  dispatch: React.Dispatch<any>
}

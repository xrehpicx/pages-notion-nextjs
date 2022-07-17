import React, { PropsWithChildren } from "react";
import { GlobalStyle } from "../theme";

import { DefaultContextProvider } from "./DefaultContext";

export const ContextRender = ({ children }: PropsWithChildren<{}>) => {
  return (
    <DefaultContextProvider>
      <GlobalStyle />
      {children}
    </DefaultContextProvider>
  );
};

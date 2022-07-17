import { createContext, FC, PropsWithChildren } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import { DefaultContextProps } from "../types";
import { useThemer } from "../hooks/useThemer";
// import { useWantCode } from "../hooks/useWantCode";

export const DefaultContext = createContext<DefaultContextProps>(
  {} as DefaultContextProps
);

export const DefaultContextProvider = ({ children }: PropsWithChildren<{}>) => {
  // custom hookss
  const themer = useThemer();

  return (
    <DefaultContext.Provider value={{ themer }}>
      {themer.theme && (
        <ThemeProvider theme={themer.theme}>
          <MuiThemeProvider theme={themer.theme}>{children}</MuiThemeProvider>
        </ThemeProvider>
      )}
    </DefaultContext.Provider>
  );
};

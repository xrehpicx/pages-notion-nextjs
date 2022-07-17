import { useEffect } from "react";

import { ThemeOptions } from "@mui/material";

export function useWantCode(theme: ThemeOptions) {
  useEffect(() => {
    if (theme && process.env.NODE_ENV === "production") {
      console.clear();
      console.log(
        "%cHeyy\n%clooking for the code?\nforget it",
        `color:${theme.palette?.primary};font-size:2rem;background:${theme.palette?.primary}`
        /* `color:${theme.colors.main.text};font-size:0.8rem;background:${theme.colors.main.background}` */
      );
    }
  }, [theme]);
}

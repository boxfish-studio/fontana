import { createContext, useContext } from "react";

type Refresh = {
  r: boolean;
  refresh: (r: boolean) => void;
};

export const SiteMintingContext = createContext<Refresh>({
  r: false,
  refresh: () => {},
});

export const useRefresh = () => useContext(SiteMintingContext);

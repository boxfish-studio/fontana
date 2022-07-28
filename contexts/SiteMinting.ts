import { createContext, useContext } from "react";

type Success = {
  message: string;
  setMessage: (message: string) => void;
  mint: string | undefined;
  setMint: (mint: string) => void;
};

export const SuccessContext = createContext<Success>({
  message: "",
  setMessage: (message: string) => {
    message = message;
  },
  mint: undefined,
  setMint: (mint: string) => (mint = mint),
});

export const useSuccess = () => useContext(SuccessContext);

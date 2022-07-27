import { createContext, useContext } from "react";

type HasMongoUri = {
  hasMongoUri: boolean;
};

export const HasMongoUriContext = createContext<HasMongoUri>({
  hasMongoUri: false,
});

export const useHasMongoUri = () => useContext(HasMongoUriContext);

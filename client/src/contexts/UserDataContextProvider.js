import React, { useState } from "react";
import UserDataContext from "./UserDataContext";

const UserDataContextProvider = ({ children }) => {
  const [contextValue, setContextValue] = useState(null);

  const updateValue = (newValue) => {
    setContextValue(newValue);
  };

  return (
    <UserDataContext.Provider
      value={{
        userDataContextValue: contextValue,
        updateUserDataContextValue: updateValue,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataContextProvider;

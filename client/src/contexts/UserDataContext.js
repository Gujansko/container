import React from "react";

const UserDataContext = React.createContext({
  userDataContextValue: null,
  updateUserDataContextValue: () => {},
});

export default UserDataContext;

import "./Navbar.css";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Bike, LogIn, KeyRound, LogOut, User } from "lucide-react";
import UserDataContext from "../../contexts/UserDataContext";

const Navbar = () => {
  const { userDataContextValue, updateUserDataContextValue } =
    useContext(UserDataContext);
  return (
    <nav>
      <ul>
        <div className="nav-content">
          <Link className="title" to="/">
            <Bike size="40" />
            <span>Let's Bike</span>
          </Link>
        </div>
        <div className="nav-content">
          {userDataContextValue ? (
            <>
              <li>
                <Link to="/">
                  <User size="20" />
                  <span>{userDataContextValue.userName}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  onClick={() => {
                    updateUserDataContextValue(null);
                  }}
                >
                  <LogOut size="20" />
                  <span>Log Out</span>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">
                  <LogIn size="20" />
                  <span>Login</span>
                </Link>
              </li>
              <li>
                <Link to="/register">
                  <KeyRound size="20" />
                  <span>Register</span>
                </Link>
              </li>
            </>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;

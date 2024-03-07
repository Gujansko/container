import "./LoginForm.css";
import { useState, useContext } from "react";
import axios from "axios";
import UserDataContext from "../../contexts/UserDataContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const { updateUserDataContextValue } = useContext(UserDataContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    if (password.trim().length < 3) {
      setError("Password must be at least 3 characters long");
      return;
    }

    axios
      .get(`http://localhost:4002/login/${username.trim()}/${password.trim()}`)
      .then((res) => {
        alert("Logged in successfully!");
        updateUserDataContextValue({
          userName: res.data.userName,
          id: res.data._id,
        });

        setUsername("");
        setPassword("");
        setError(null);
        navigate("/");
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="submit">
        Submit
      </button>
    </form>
  );
};

export default LoginForm;

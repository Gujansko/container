import "./RegisterForm.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setUsername(username.trim());
    setPassword(password.trim());

    if (username.length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    if (password.length < 3) {
      setError("Password must be at least 3 characters long");
      return;
    }

    axios
      .post(`http://localhost:4002/register`, {
        userName: username,
        password: password,
      })
      .then((res) => {
        alert("Account created successfully!");

        setUsername("");
        setPassword("");
        setError(null);
        navigate("/login");
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="register-form">
      <h2>Register</h2>
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

export default RegisterForm;

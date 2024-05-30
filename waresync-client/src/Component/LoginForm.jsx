import { useState, useEffect } from "react";
import PropTypes from "prop-types";


function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isTypingPassword, setIsTypingPassword] = useState(false);

  useEffect(() => {
    if (username.trim()) {
      fetchQrCode(username);
    }
  }, [username]);

  const fetchQrCode = async (username) => {
    try {
      const response = await fetch("http://localhost:4000/get-secret", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username })
      });

      if (response.ok) {
        const data = await response.json();
        setQrCodeUrl(data.qrCodeImageUrl);
      } else {
        console.error("Failed to fetch QR code");
      }
    } catch (error) {
      console.error("Error fetching QR code", error);
    }
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim() || !token.trim()) {
      alert("Please enter username, password, and token");
      return;
    }

    if (username === "admin" && password === "password") {
      try {
        const validateResponse = await fetch(
          "http://localhost:4000/validate-token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, token })
          }
        );

        if (validateResponse.ok) {
          setIsLoggedIn(true);
        } else {
          alert("Invalid token");
        }
      } catch (error) {
        console.error("Error during login", error);
        alert("An error occurred during login");
      }
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <div className="card">
        <div className="card-body">
          <div
            className={`card-body-content ${
              isTypingPassword ? "card-body-left" : ""
            }`}
          >
            <h3>Admin Login</h3>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setIsTypingPassword(true);
                }}
              />
            </div>
            {qrCodeUrl && (
              <div className="form-group">
                <label htmlFor="token">Token:</label>
                <input
                  type="text"
                  className="form-control"
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
                <img src={qrCodeUrl} alt="QR Code" className="qr-code" />
              </div>
            )}
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired
};

export default Login;

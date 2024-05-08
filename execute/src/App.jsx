
import { useState } from "react";


import "./App.css";
import Inventory from "./Component/InventorySystem";
import Login from "./Component/LoginForm";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  return (
    <div className="App">
      {!loggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Inventory/>
      )}
    </div>
  );
}

export default App;

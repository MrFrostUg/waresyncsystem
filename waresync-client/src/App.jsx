import { useState } from "react";
import Login from "./Component/LoginForm.jsx";
import Inventory from "./Component/InventorySystem.jsx";
import Logout from "./Component/Logout.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      {!isLoggedIn && <Login setIsLoggedIn={setIsLoggedIn} />}
      {isLoggedIn && (
        <>
          <Inventory />
          <Logout setIsLoggedIn={setIsLoggedIn} />
        </>
      )}
    </div>
  );
}

export default App;

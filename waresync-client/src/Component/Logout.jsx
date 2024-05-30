import PropTypes from "prop-types";

function Logout({ setIsLoggedIn }) {
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <button onClick={handleLogout} className="btn btn-danger">
      Logout
    </button>
  );
}

Logout.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired
};

export default Logout;

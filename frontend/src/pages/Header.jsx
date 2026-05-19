import { Navbar, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../redux/userslice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

 
  const user = useSelector((state) => state.user?.user);

  const isLoggedIn = !!localStorage.getItem("token") || user;

  const handleLogout = () => {
    dispatch(userLogout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar
      style={{
        background: "linear-gradient(90deg, #11998e, #38ef7d)",
      }}
      variant="dark"
    >
      <Container>
        <Navbar.Brand
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}
        >
          TaskManager
        </Navbar.Brand>

     
        {isLoggedIn ? (
          <Button
            onClick={handleLogout}
            style={{
              backgroundColor: "#fff",
              color: "#11998e",
              border: "none",
              fontWeight: "600",
              transition: "0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#11998e";
              e.target.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#fff";
              e.target.style.color = "#11998e";
            }}
          >
            Logout
          </Button>
        ) : (
          <Button variant="light" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
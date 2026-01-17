import { Navbar as BNavbar, Button, Container, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearUser } from "../../store/slices/userSlice";

export const Navbar = () => {
  // Get User Logged Or Not
  const { isLoggedIn } = useSelector((state) => state.user);

  // Global Hooks
  const dispatch = useDispatch();
  const go = useNavigate();

  // Handlers
  function handleLogout() {
    // Reset User Data
    dispatch(clearUser());
    // Clear Session
    localStorage.removeItem("token");
    // Redirect Login
    go("/login");
  }

  return (
    <BNavbar expand="md" bg="dark" data-bs-theme="dark">
      <Container>
        <BNavbar.Brand as={Link} to="/">
          Node-118
        </BNavbar.Brand>

        <BNavbar.Toggle />

        <BNavbar.Collapse>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            {/* Hide Auth */}
            {!isLoggedIn && (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}

            {/* Profile */}
            {isLoggedIn && (
              <Nav.Link as={Link} to="/profile">
                Profile
              </Nav.Link>
            )}

            {/* Show Logout */}
            {isLoggedIn && (
              <Button variant="outline-danger" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Nav>
        </BNavbar.Collapse>
      </Container>
    </BNavbar>
  );
};
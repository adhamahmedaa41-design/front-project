import { Navbar as BNavbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom"; 

export const Navbar = () => {
  return (
    <BNavbar expand="md" bg="light" variant="light">
      <Container>
        {/* Brand / Logo */}
        <BNavbar.Brand as={Link} to="/">
          Final Project
        </BNavbar.Brand>

        {/* Toggle button for mobile */}
        <BNavbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Collapsible content */}
        <BNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto"> {/* ms-auto = push to right */}
            <Nav.Item>
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={Link} to="/register">
                Register
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </BNavbar.Collapse>
      </Container>
    </BNavbar>
  );
};
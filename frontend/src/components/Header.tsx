import { Navbar, Container, Nav, Form, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useCurrency, CurrencyType } from "../context/CurrencyContext";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { t, i18n } = useTranslation();
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          {t("title")}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              {t("home", "Home")}
            </Nav.Link>
          </Nav>
          <Nav className="d-flex align-items-center gap-3">
            <Form.Select
              size="sm"
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              style={{ width: "100px" }}
            >
              <option value="en">English</option>
              <option value="vi">Tiếng Việt</option>
            </Form.Select>

            <Form.Select
              size="sm"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyType)}
              style={{ width: "80px" }}
            >
              <option value="USD">USD</option>
              <option value="VND">VND</option>
            </Form.Select>

            {token ? (
              <>
                <span className="text-light">{userEmail}</span>

                <Nav.Link as={Link} to="/cart">
                  {t("cart")}
                </Nav.Link>

                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                >
                  {t("logout", "Logout")}
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  {t("login", "Login")}
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  {t("register", "Register")}
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

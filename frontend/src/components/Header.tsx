import { Navbar, Container, Nav, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { currency, setCurrency } = useCurrency();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand href="#home">{t('title')}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Menu Items */}
          </Nav>
          <Nav className="d-flex align-items-center gap-3">
            <Form.Select 
              size="sm" 
              value={i18n.language} 
              onChange={(e) => changeLanguage(e.target.value)}
              style={{ width: '100px' }}
            >
              <option value="en">English</option>
              <option value="vi">Tiếng Việt</option>
            </Form.Select>

            <Form.Select 
              size="sm" 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value as any)}
              style={{ width: '80px' }}
            >
              <option value="USD">USD</option>
              <option value="VND">VND</option>
            </Form.Select>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

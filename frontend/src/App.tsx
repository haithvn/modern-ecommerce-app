import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import Register from "./pages/Register";
import VerifyAccount from "./pages/VerifyAccount";
import { CurrencyProvider } from "./context/CurrencyContext";
import "./i18n"; // Init i18n

function App() {
  return (
    <CurrencyProvider>
      <BrowserRouter>
        <div className="min-vh-100 bg-light">
          <Header />
          <Container className="py-4">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify" element={<VerifyAccount />} />
              {/* Fallback route or login route can be added later */}
            </Routes>
          </Container>
        </div>
      </BrowserRouter>
    </CurrencyProvider>
  );
}

export default App;

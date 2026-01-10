import { Container } from "react-bootstrap";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import { CurrencyProvider } from "./context/CurrencyContext";
import "./i18n"; // Init i18n

function App() {
  return (
    <CurrencyProvider>
      <div className="min-vh-100 bg-light">
        <Header />
        <Container className="py-4">
          <ProductList />
        </Container>
      </div>
    </CurrencyProvider>
  );
}

export default App;

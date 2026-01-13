import React from "react";
import { Container, Table, Button, Row, Col, Card } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../context/CurrencyContext";
import { Link } from "react-router-dom";

const Cart: React.FC = () => {
  const { t } = useTranslation();
  const { convertPrice } = useCurrency();
  const {
    cart,
    loading,
    removeFromCart,
    updateCartQuantity: handleQuantityChange,
  } = useCart();

  const handleRemove = async (itemId: number) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  if (loading) return <Container className="mt-4">{t("loading")}</Container>;

  if (!cart || cart.items.length === 0) {
    return (
      <Container className="mt-4 text-center">
        <h2>{t("cart")}</h2>
        <p>{t("empty_cart")}</p>
        <Link to="/" className="btn btn-primary">
          {t("go_shopping", "Go Shopping")}
        </Link>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">{t("cart")}</h2>
      <Row>
        <Col lg={8}>
          <Table responsive hover>
            <thead>
              <tr>
                <th>{t("product", "Product")}</th>
                <th>{t("price")}</th>
                <th>{t("quantity")}</th>
                <th>{t("subtotal", "Subtotal")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={item.productImageUrl}
                        alt={item.productName}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          marginRight: "10px",
                        }}
                      />
                      <span>{item.productName}</span>
                    </div>
                  </td>
                  <td>{convertPrice(item.unitPrice)}</td>
                  <td>
                    <div
                      className="d-flex align-items-center"
                      style={{ width: "120px" }}
                    >
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td>{convertPrice(item.subTotal)}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemove(item.id)}
                    >
                      {t("remove")}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col lg={4}>
          <Card>
            <Card.Body>
              <Card.Title>{t("summary", "Order Summary")}</Card.Title>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <span>{t("total")}</span>
                <h4 className="text-primary">
                  {convertPrice(cart.totalAmount)}
                </h4>
              </div>
              <Link to="/checkout" className="btn btn-success w-100 btn-lg">
                {t("checkout")}
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;

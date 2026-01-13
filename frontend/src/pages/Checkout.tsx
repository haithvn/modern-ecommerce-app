import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../api/orderApi";
import { useNavigate } from "react-router-dom";

const Checkout: React.FC = () => {
  const { t } = useTranslation();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [shippingName, setShippingName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await placeOrder({
        shippingName,
        shippingPhone,
        shippingAddress,
        paymentMethod,
      });
      clearCart();
      navigate("/order-success");
    } catch (error) {
      console.error("Order failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <Container className="mt-5">
        <h2>Your cart is empty</h2>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4">{t("checkout", "Checkout")}</h2>
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              {t("shipping_info", "Shipping Information")}
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit} id="checkout-form">
                <Form.Group className="mb-3" controlId="shippingName">
                  <Form.Label>{t("full_name", "Full Name")}</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="shippingPhone">
                  <Form.Label>{t("phone_number", "Phone Number")}</Form.Label>
                  <Form.Control
                    type="tel"
                    required
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="shippingAddress">
                  <Form.Label>{t("address", "Address")}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                  />
                </Form.Group>

                <h4 className="mt-4 mb-3">
                  {t("payment_method", "Payment Method")}
                </h4>
                <Form.Check
                  type="radio"
                  label={t("payment_cod", "Cash on Delivery (COD)")}
                  name="paymentMethod"
                  id="payment-cod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  label={t("payment_bank", "Bank Transfer")}
                  name="paymentMethod"
                  id="payment-bank"
                  value="BANK_TRANSFER"
                  checked={paymentMethod === "BANK_TRANSFER"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  label={t("payment_card", "VISA/MASTER Card")}
                  name="paymentMethod"
                  id="payment-card"
                  value="CARD"
                  checked={paymentMethod === "CARD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  label={t("payment_momo", "Momo Wallet")}
                  name="paymentMethod"
                  id="payment-momo"
                  value="MOMO"
                  checked={paymentMethod === "MOMO"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mb-2"
                />

                {paymentMethod !== "COD" && (
                  <Card className="bg-light mt-3">
                    <Card.Body>
                      <p>
                        {t(
                          "payment_instruction",
                          "Please confirm your order. You will be redirected to the payment gateway or receive payment instructions via email.",
                        )}
                      </p>
                    </Card.Body>
                  </Card>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>{t("order_summary", "Order Summary")}</Card.Header>
            <Card.Body>
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between mb-2"
                >
                  <span>
                    {item.productName} x {item.quantity}
                  </span>
                  <span>
                    {item.subTotal.toLocaleString()} {cart.currency}
                  </span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>{t("total", "Total")}</span>
                <span>
                  {cart.totalAmount.toLocaleString()} {cart.currency}
                </span>
              </div>
              <Button
                variant="primary"
                type="submit"
                form="checkout-form"
                className="w-100 mt-3"
                disabled={loading}
              >
                {loading
                  ? t("processing", "Processing...")
                  : paymentMethod === "COD"
                    ? t("place_order", "Place Order")
                    : t("confirm_payment", "Confirm Payment")}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;

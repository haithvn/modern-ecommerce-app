import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const OrderSuccess: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container className="mt-5 text-center">
      <Card className="p-5">
        <Card.Body>
          <h2 className="text-success mb-4">
            {t("thank_you", "Thank You for Your Order!")}
          </h2>
          <p className="lead">
            {t(
              "order_confirmation_sent",
              "Your order has been placed successfully. A confirmation email has been sent to your email address.",
            )}
          </p>
          <div className="mt-4">
            <Link to="/">
              <Button variant="primary">
                {t("continue_shopping", "Continue Shopping")}
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderSuccess;

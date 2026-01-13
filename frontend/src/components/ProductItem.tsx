import { Card, Button, Badge } from "react-bootstrap";
import { Product } from "../types";
import { useCurrency } from "../context/CurrencyContext";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Props {
  product: Product;
}

const ProductItem = ({ product }: Props) => {
  const { convertPrice } = useCurrency();
  const { t } = useTranslation();
  const { addToCart: addCartItem } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      await addCartItem(product.id, 1);
      alert(t("added_to_cart", "Added to cart!"));
    } catch (error) {
      console.error("Failed to add to cart", error);
      alert(t("add_to_cart_failed", "Failed to add to cart"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={product.imageUrl}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title>{product.name}</Card.Title>
          <Badge bg="info">{product.categoryName}</Badge>
        </div>
        <Card.Text className="text-muted small flex-grow-1">
          {product.description}
        </Card.Text>
        <div className="mt-auto">
          <h5 className="text-primary mb-3">{convertPrice(product.price)}</h5>
          <Button
            variant="primary"
            className="w-100"
            onClick={handleAddToCart}
            disabled={loading}
          >
            {loading ? t("adding", "Adding...") : t("buy", "Add to Cart")}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductItem;

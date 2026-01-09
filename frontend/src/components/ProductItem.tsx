import { Card, Button, Badge } from 'react-bootstrap';
import { Product } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useTranslation } from 'react-i18next';

interface Props {
  product: Product;
}

const ProductItem = ({ product }: Props) => {
  const { convertPrice } = useCurrency();
  const { t } = useTranslation();

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img variant="top" src={product.imageUrl} style={{ height: '200px', objectFit: 'cover' }} />
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
            <Card.Title>{product.name}</Card.Title>
            <Badge bg="info">{product.categoryName}</Badge>
        </div>
        <Card.Text className="text-muted small flex-grow-1">
          {product.description}
        </Card.Text>
        <div className="mt-auto">
            <h5 className="text-primary mb-3">
                {convertPrice(product.price, product.currency)}
            </h5>
            <Button variant="primary" className="w-100">
                {t('buy')}
            </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductItem;

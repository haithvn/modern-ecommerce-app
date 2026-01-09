import { useEffect, useState } from 'react';
import { Row, Col, Spinner, Alert, Container } from 'react-bootstrap';
import { Product } from '../types';
import { productApi } from '../api/productApi';
import ProductItem from './ProductItem';
import { useTranslation } from 'react-i18next';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productApi.getAll();
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products. Please check if Backend is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return (
      <Container className="text-center mt-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">{t('loading')}</p>
      </Container>
  );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Row xs={1} md={2} lg={4} className="g-4">
      {products.map((product) => (
        <Col key={product.id}>
          <ProductItem product={product} />
        </Col>
      ))}
    </Row>
  );
};

export default ProductList;

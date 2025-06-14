import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Container, Table, Image, Alert } from 'react-bootstrap';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => {
        console.error('Error fetching products:', err);
        setError('Failed to load products.');
      });
  }, []);

  return (
    <Container className="mt-4">
      <h2>Product List</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Price</th><th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>
                {p.thumbnailUrl && (
                  <Image src={p.thumbnailUrl} alt={p.name} width={40} height={40} rounded className="me-2" />
                )}
                {p.name}
              </td>
              <td>₹{p.price}</td>
              <td>{p.stock ?? p.quantity ?? '-'}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="4" className="text-center">No products found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default ProductList;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Container, Alert, Spinner } from 'react-bootstrap';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashboardRes, lowStockRes] = await Promise.all([
          axios.get('http://localhost:8080/api/dashboard'),
          axios.get('http://localhost:8080/api/products/low-stock')
        ]);
        setDashboardData(dashboardRes.data);
        setLowStockProducts(lowStockRes.data);
      } catch (err) {
        console.error('Dashboard loading failed:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />{' '}
        <p className="mt-3">Loading dashboard...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">Dashboard</h2>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <Alert variant="danger">
          <h5>
            <ExclamationTriangleFill className="me-2 text-danger" />
            Low Stock Products
          </h5>
          <ul className="mb-0">
            {lowStockProducts.map((product) => (
              <li
                key={product.id}
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => navigate(`/edit-product/${product.id}`)}
              >
                {product.name} (Stock: {product.stock})
              </li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Products</Card.Title>
              <h3>{dashboardData.totalProducts}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Sales</Card.Title>
              <h3>{dashboardData.totalSales}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Revenue</Card.Title>
              <h3>₹{dashboardData.totalRevenue}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Sales Chart */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Sales Over Time</Card.Title>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.salesChart || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>

      {/* Recent Sales */}
      <h4 className="mb-3">Recent Sales</h4>
      <Row>
        {dashboardData.recentSales?.length > 0 ? (
          dashboardData.recentSales.map((sale, index) => (
            <Col md={6} lg={4} key={index} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Subtitle className="mb-2 text-muted">
                    {new Date(sale.saleDate).toLocaleString()}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Amount:</strong> ₹{sale.totalAmount} <br />
                    <strong>Items:</strong>
                    <ul className="mb-0">
                      {sale.items.map((item, i) => (
                        <li key={i}>
                          Product ID: {item.productId}, Qty: {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-muted">No recent sales available.</p>
        )}
      </Row>
    </Container>
  );
}

export default Dashboard;
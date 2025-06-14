import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Alert } from 'react-bootstrap';

const AddSale = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/products')
      .then(res => {
        setProducts(res.data);
        setFilteredProducts(res.data);
      })
      .catch(err => {
        console.error('Error loading products:', err);
        setError('Failed to load products.');
      });
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];
  useEffect(() => {
    let result = products;
    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }
    if (searchTerm) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(result);
  }, [searchTerm, categoryFilter, products]);

  const handleAddItem = (productId) => {
    if (items.some(i => i.productId === productId)) return;
    const p = products.find(p => p.id === productId);
    if (p) setItems([...items, { productId, name: p.name, quantity: 1, price: p.price }]);
  };

  const handleQuantityChange = (idx, val) => {
    const updated = [...items];
    updated[idx].quantity = parseInt(val) || 1;
    setItems(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/sales', {
      items: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price }))
    })
      .then(_ => {
        alert('Sale created!');
        setItems([]);
      })
      .catch(err => {
        console.error('Error creating sale:', err);
        setError('Failed to create sale.');
      });
  };

  return (
    <Container className="mt-4">
      <h2>Add Sale</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="mb-4">
        <div className="row mb-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <select
              className="form-select"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="row">
          {filteredProducts.map(p => (
            <div key={p.id} className="col-md-3 mb-3">
              <div className="card h-100 d-flex flex-column justify-content-between">
                <div style={{
                  position: 'relative', width: '100%', paddingTop: '100%',
                  overflow: 'hidden', borderTopLeftRadius: '0.375rem',
                  borderTopRightRadius: '0.375rem', backgroundColor: '#f8f9fa'
                }}>
                  {p.thumbnailUrl
                    ? <img
                        src={p.thumbnailUrl}
                        alt={p.name}
                        style={{
                          position: 'absolute', top: 0, left: 0,
                          width: '100%', height: '100%',
                          objectFit: 'contain', padding: '5px'
                        }}
                      />
                    : <div style={{
                        position: 'absolute', top: 0, left: 0,
                        width: '100%', height: '100%',
                        backgroundColor: '#e0e0e0',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#999'
                      }}>
                        No Image
                      </div>
                  }
                </div>
                <div className="card-body text-center d-flex flex-column">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">₹{p.price}</p>
                  <button
                    className="btn btn-outline-primary btn-sm mt-auto"
                    onClick={() => handleAddItem(p.id)}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <h4>Sale Items</h4>
        {items.length === 0 && <p>No items added.</p>}
        {items.map((item, i) => (
          <div key={i} className="mb-2">
            {item.name} - ₹{item.price} ×
            <input
              type="number"
              value={item.quantity}
              min="1"
              onChange={e => handleQuantityChange(i, e.target.value)}
              style={{ width: '60px', marginLeft: '5px' }}
            />
          </div>
        ))}
        {items.length > 0 &&
          <div className="mt-2">
            <strong>Total: ₹ {items.reduce((s, it) => s + it.price * it.quantity, 0)}</strong>
          </div>
        }
        <button type="submit" className="btn btn-success mt-3" disabled={items.length === 0}>
          Submit Sale
        </button>
      </form>
    </Container>
  );
};

export default AddSale;
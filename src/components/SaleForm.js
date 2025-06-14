import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

function SaleForm({ show, onClose, onSave, saleToEdit }) {
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState(saleToEdit?.items || []);
  const [saleDate, setSaleDate] = useState(saleToEdit?.saleDate || new Date().toISOString());

  useEffect(() => {
    axios.get('http://localhost:8080/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  useEffect(() => {
    if (saleToEdit) {
      setItems(saleToEdit.items || []);
      setSaleDate(saleToEdit.saleDate || new Date().toISOString());
    }
  }, [saleToEdit]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'productId' ? parseInt(value) : value
    };

    // Auto-set price when product changes
    if (field === 'productId') {
      const selectedProduct = products.find(p => p.id === parseInt(value));
      if (selectedProduct) {
        updatedItems[index].price = selectedProduct.price;
      }
    }

    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: '', price: '' }]);
  };

  const handleRemoveItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const handleSubmit = () => {
    if (items.some(item => !item.productId || !item.quantity)) {
      alert("Please fill in all product and quantity fields.");
      return;
    }

    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const payload = {
      saleDate,
      items,
      totalAmount
    };

    onSave(payload);
    onClose(); // Close modal
  };

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{saleToEdit ? 'Edit Sale' : 'Add Sale'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {items.map((item, index) => (
            <div key={index} className="mb-3 row align-items-center">
              <div className="col-md-4">
                <Form.Label>Product</Form.Label>
                <Form.Select
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                >
                  <option value="">Select product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <div className="col-md-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                />
              </div>
              <div className="col-md-3">
                <Form.Label>Price (auto)</Form.Label>
                <Form.Control type="number" value={item.price} readOnly />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <Button variant="danger" onClick={() => handleRemoveItem(index)}>Remove</Button>
              </div>
            </div>
          ))}
          <Button onClick={handleAddItem} className="mb-3">+ Add Item</Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>
          {saleToEdit ? 'Update' : 'Create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SaleForm;
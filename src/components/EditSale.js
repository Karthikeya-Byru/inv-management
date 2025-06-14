import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditSale = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get(`/sales/${id}`)
      .then(res => {
        setSale(res.data);
        setItems(res.data.items || []);
      })
      .catch(err => {
        console.error('Error fetching sale:', err);
        alert('Failed to fetch sale data.');
      });
  }, [id]);

  const handleQuantityChange = (index, value) => {
    const updated = [...items];
    updated[index].quantity = parseInt(value) || 1;
    setItems(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const updatedSale = {
      ...sale,
      items,
      totalAmount
    };

    api.put(`/sales/${id}`, updatedSale)
      .then(() => {
        alert('Sale updated successfully!');
        navigate('/sales'); // Adjust route as needed
      })
      .catch(err => {
        console.error('Update failed:', err);
        alert('Failed to update sale.');
      });
  };

  if (!sale) return <div>Loading sale...</div>;

  return (
    <div className="container mt-4">
      <h2>Edit Sale (ID: {id})</h2>

      <form onSubmit={handleSubmit}>
        {items.map((item, index) => (
          <div key={index} className="mb-2">
            <strong>{item.name}</strong> - ₹{item.price} ×
            <input
              type="number"
              value={item.quantity}
              min="1"
              onChange={(e) => handleQuantityChange(index, e.target.value)}
              style={{ width: '60px', marginLeft: '5px' }}
            />
          </div>
        ))}

        <div className="mt-2">
          <strong>Total: ₹{items.reduce((sum, item) => sum + item.price * item.quantity, 0)}</strong>
        </div>

        <button type="submit" className="btn btn-primary mt-3">Update Sale</button>
      </form>
    </div>
  );
};

export default EditSale;
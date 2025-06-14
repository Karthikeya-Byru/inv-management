import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SaleForm from './SaleForm';
import { Container, Table, Button, Alert } from 'react-bootstrap';

function SaleList() {
  const [sales, setSales] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [saleToEdit, setSaleToEdit] = useState(null);
  const [error, setError] = useState('');

  const fetchSales = () => {
    axios.get('http://localhost:8080/api/sales')
      .then(res => {
        setSales(Array.isArray(res.data) ? res.data : []);
        setError('');
      })
      .catch(err => {
        console.error('Error fetching sales:', err);
        setError('Failed to load sales.');
      });
  };

  useEffect(fetchSales, []);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this sale?')) return;
    axios.delete(`http://localhost:8080/api/sales/${id}`)
      .then(() => setSales(prev => prev.filter(s => s.id !== id)))
      .catch(err => {
        console.error('Failed to delete sale:', err);
        setError('Delete failed.');
      });
  };

  const handleSave = (data) => {
    const req = saleToEdit
      ? axios.put(`http://localhost:8080/api/sales/${saleToEdit.id}`, data)
      : axios.post('http://localhost:8080/api/sales', data);

    req.then(() => {
      fetchSales();
      setShowForm(false);
      setSaleToEdit(null);
    })
    .catch(err => {
      console.error('Save failed:', err);
      setError('Save failed.');
    });
  };

  const downloadInvoice = (id) => {
    axios({
      url: `http://localhost:8080/api/sales/${id}/invoice`,
      method: 'GET',
      responseType: 'blob',
    })
    .then(res => {
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `sale_${id}_invoice.pdf`;
      link.click();
    })
    .catch(err => {
      console.error('Invoice download error:', err);
      setError('Failed to download invoice.');
    });
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Sales List</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="text-end mb-3">
        <Button variant="success" onClick={() => { setSaleToEdit(null); setShowForm(true); }}>
          + Add Sale
        </Button>
      </div>
      <Table bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th>Sale Date</th><th>Total Amount</th><th>Items</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.length ? sales.map(s => (
            <tr key={s.id}>
              <td>{new Date(s.saleDate).toLocaleString()}</td>
              <td>₹{s.totalAmount}</td>
              <td>
                <ul className="mb-0 ps-3">
                  {s.items.map((i, idx) => (
                    <li key={idx}>
                      Product ID: {i.productId}, Qty: {i.quantity}, Price: ₹{i.price}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="text-center">
                <Button size="sm" variant="primary" className="me-2" onClick={() => { setSaleToEdit(s); setShowForm(true); }}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" className="me-2" onClick={() => handleDelete(s.id)}>
                  Delete
                </Button>
                <Button size="sm" variant="secondary" onClick={() => downloadInvoice(s.id)}>
                  Invoice
                </Button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="4" className="text-center">No sales found.</td></tr>
          )}
        </tbody>
      </Table>
      {showForm && (
        <SaleForm
          show={showForm}
          onClose={() => { setShowForm(false); setSaleToEdit(null); }}
          onSave={handleSave}
          saleToEdit={saleToEdit}
        />
      )}
    </Container>
  );
}

export default SaleList;
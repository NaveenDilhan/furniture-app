import React, { useState, useMemo } from 'react';

export default function CheckoutModal({ isOpen, onClose, items, onOrderSuccess }) {
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate Cart Totals
  const { cartItems, totalAmount } = useMemo(() => {
    const total = items.reduce((sum, item) => sum + (item.price || 0), 0);
    // Group items for display
    const grouped = items.reduce((acc, item) => {
      const existing = acc.find(i => i.name === (item.name || item.type));
      if (existing) existing.quantity += 1;
      else acc.push({ ...item, name: item.name || item.type, quantity: 1 });
      return acc;
    }, []);
    return { cartItems: grouped, totalAmount: total };
  }, [items]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderData = {
      customer,
      items: cartItems.map(i => ({ furnitureId: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      totalAmount
    };

    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        onOrderSuccess();
        onClose();
      } else {
        alert('Failed to place order.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
    }}>
      <div style={{
        background: '#1e1e1e', padding: '30px', borderRadius: '12px', width: '800px', maxWidth: '95%',
        display: 'flex', gap: '30px', border: '1px solid #333', boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        color: '#eee'
      }}>
        
        {/* Left: Order Summary */}
        <div style={{ flex: 1, borderRight: '1px solid #333', paddingRight: '30px' }}>
          <h2 style={{ marginTop: 0 }}>Order Summary</h2>
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
            {cartItems.length === 0 ? <p style={{color:'#888'}}>Your design is empty.</p> : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #444', textAlign: 'left', color: '#888' }}>
                    <th style={{ padding: '8px 0' }}>Item</th>
                    <th style={{ padding: '8px 0' }}>Qty</th>
                    <th style={{ padding: '8px 0', textAlign: 'right' }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #333' }}>
                      <td style={{ padding: '12px 0' }}>{item.name}</td>
                      <td style={{ padding: '12px 0' }}>x{item.quantity}</td>
                      <td style={{ padding: '12px 0', textAlign: 'right' }}>${(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold', borderTop: '2px solid #444', paddingTop: '15px' }}>
            <span>Total</span>
            <span style={{ color: '#4ade80' }}>${totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Right: Customer Form */}
        <div style={{ flex: 1 }}>
          <h2 style={{ marginTop: 0 }}>Customer Details</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              placeholder="Full Name" required 
              style={inputStyle} 
              value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} 
            />
            <input 
              placeholder="Email Address" type="email" required 
              style={inputStyle} 
              value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} 
            />
            <input 
              placeholder="Phone Number" required 
              style={inputStyle} 
              value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} 
            />
            <textarea 
              placeholder="Shipping Address" required rows="4" 
              style={{...inputStyle, resize: 'none'}} 
              value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})} 
            />
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="button" onClick={onClose} style={btnSecondary}>Cancel</button>
              <button type="submit" disabled={isSubmitting || cartItems.length === 0} style={btnPrimary}>
                {isSubmitting ? 'Processing...' : 'Complete Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  background: '#2a2a2a', border: '1px solid #444', padding: '12px', borderRadius: '6px', color: 'white', fontSize: '1rem'
};
const btnPrimary = {
  flex: 1, padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
};
const btnSecondary = {
  padding: '12px 20px', background: 'transparent', color: '#aaa', border: '1px solid #444', borderRadius: '6px', cursor: 'pointer'
};
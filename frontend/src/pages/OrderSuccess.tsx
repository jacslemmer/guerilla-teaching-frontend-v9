import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const orderId = location.state?.orderId || new URLSearchParams(location.search).get('orderId');
    if (orderId) {
      setOrderDetails({
        id: orderId,
        status: 'paid',
        total: 'R 299.99',
        items: [
          { name: 'IGCSE Mathematics Study Guide', quantity: 1, price: 'R 299.99' }
        ]
      });
    }
  }, [location]);

  return (
    <div className="order-success">
      <div className="success-container">
        <div className="success-icon">✅</div>
        <h1>Payment Successful!</h1>
        <p>Thank you for your purchase. Your order has been confirmed.</p>
        
        {orderDetails && (
          <div className="order-details">
            <h2>Order Details</h2>
            <div className="order-info">
              <p><strong>Order ID:</strong> {orderDetails.id}</p>
              <p><strong>Status:</strong> <span className="status-paid">Paid</span></p>
              <p><strong>Total:</strong> {orderDetails.total}</p>
            </div>
          </div>
        )}
        
        <div className="next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li>You will receive a confirmation email shortly</li>
            <li>For digital products, download links will be sent to your email</li>
            <li>For physical products, tracking information will be provided</li>
            <li>Our support team is available if you need assistance</li>
          </ul>
        </div>
        
        <div className="action-buttons">
          <Link to="/shop" className="continue-shopping-btn">
            Continue Shopping
          </Link>
          <Link to="/" className="home-btn">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess; 
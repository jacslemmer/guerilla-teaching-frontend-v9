import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../components/PaymentModal';
import './Checkout.css';

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderData, setOrderData] = useState<any | null>(null);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'paygate',
      name: 'Credit Card (PayGate)',
      description: 'Pay securely by credit or debit card via PayGate',
      icon: '💳',
      enabled: true
    },
    {
      id: 'stripe',
      name: 'Credit Card (Stripe)',
      description: 'Pay securely by credit or debit card via Stripe',
      icon: '💳',
      enabled: true
    },
    {
      id: 'payfast',
      name: 'PayFast',
      description: 'Quick and secure payments via PayFast (EFT, card, more)',
      icon: '⚡',
      enabled: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: '🔵',
      enabled: true
    }
  ];

  useEffect(() => {
    const savedCart = localStorage.getItem('shopCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      navigate('/shop');
    }
  }, [navigate]);

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotal = () => {
    return getSubtotal();
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    return requiredFields.every(field => customerInfo[field as keyof typeof customerInfo].trim() !== '');
  };

  const processPayment = async () => {
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order data
      const newOrderData = {
        id: Date.now().toString(),
        items: cart,
        customer: customerInfo,
        paymentMethod: selectedPaymentMethod,
        subtotal: getSubtotal(),
        total: getTotal(),
        currency: 'ZAR'
      };
      setOrderData(newOrderData);
      setShowPaymentModal(true);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = (result: any) => {
    setShowPaymentModal(false);
    // Clear cart
    localStorage.removeItem('shopCart');
    setCart([]);
    // Navigate to success page
    navigate('/order-success', { 
      state: { 
        orderId: result.orderId || Date.now().toString(),
        paymentResult: result 
      } 
    });
  };

  const handlePaymentError = (error: any) => {
    setShowPaymentModal(false);
    console.error('Payment failed:', error);
    alert('Payment failed. Please try again or contact support.');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
      localStorage.setItem('shopCart', JSON.stringify(cart.filter(item => item.product.id !== productId)));
    } else {
      setCart(prevCart => {
        const newCart = prevCart.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        );
        localStorage.setItem('shopCart', JSON.stringify(newCart));
        return newCart;
      });
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('shopCart');
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <p>Please add some items to your cart before checkout.</p>
        <button onClick={() => navigate('/shop')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="checkout-header">
        <div className="container">
          <h1>Checkout</h1>
          <p>Complete your purchase securely. Download links will be sent to your email after payment.</p>
        </div>
      </div>
      
      <div className="checkout-content">
        <div className="container">
          <div className="checkout-grid">
            <div className="checkout-form">
              <div className="form-section">
                <h2>Customer Information</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      value={customerInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      value={customerInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h2>Payment Method</h2>
                <div className="payment-methods">
                  {paymentMethods.map(method => (
                    <div
                      key={method.id}
                      className={`payment-method ${selectedPaymentMethod === method.id ? 'selected' : ''} ${!method.enabled ? 'disabled' : ''}`}
                      onClick={() => method.enabled && handlePaymentMethodSelect(method.id)}
                    >
                      <div className="payment-method-icon">{method.icon}</div>
                      <div className="payment-method-info">
                        <h4>{method.name}</h4>
                        <p>{method.description}</p>
                      </div>
                      <div className="payment-method-radio">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={() => method.enabled && handlePaymentMethodSelect(method.id)}
                          disabled={!method.enabled}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="order-summary">
              <h2>Order Summary</h2>
              
              <div className="order-items">
                {cart.map(item => (
                  <div key={item.product.id} className="order-item">
                    <img src={item.product.image} alt={item.product.name} />
                    <div className="item-details">
                      <h4>{item.product.name}</h4>
                      <p>Quantity: 
                        <input
                          type="number"
                          min="0"
                          value={item.quantity}
                          onChange={e => updateQuantity(item.product.id, parseInt(e.target.value) || 0)}
                          style={{ width: '60px', marginLeft: '0.5rem' }}
                        />
                        <button onClick={() => updateQuantity(item.product.id, 0)} style={{ marginLeft: '0.5rem', color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                      </p>
                    </div>
                    <div className="item-price">
                      R {(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-totals">
                <div className="total-row">
                  <span>Total:</span>
                  <span>R {getTotal().toFixed(2)}</span>
                </div>
              </div>
              <button className="place-order-btn" onClick={processPayment} disabled={isProcessing || !validateForm() || !selectedPaymentMethod}>
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
              <button className="clear-cart-btn" onClick={clearCart} style={{ marginTop: '1rem', background: '#e74c3c', color: 'white' }}>
                Clear Cart
              </button>
              <div className="security-notice">
                <p>🔒 Your payment information is secure and encrypted</p>
                <p>After payment, download links will be sent to your email address.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        paymentMethod={selectedPaymentMethod}
        orderData={orderData}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </div>
  );
};

export default Checkout; 
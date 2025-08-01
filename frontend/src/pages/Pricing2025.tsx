import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pricing2025.css';

interface PricingTier {
  id: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  category: 'IGCSE' | 'AS Level';
  type: 'Standard' | 'Premium';
  subjects: number;
}

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

const Pricing2025: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'IGCSE' | 'AS Level' | 'all'>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('shopCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showAdded, setShowAdded] = useState<string | null>(null);
  const navigate = useNavigate();

  const pricingTiers: PricingTier[] = [
    // IGCSE Offerings
    {
      id: 'igcse-standard-1',
      title: 'Standard Service: 1 IGCSE Subject',
      price: 'R350/month',
      description: 'Choose any ONE subject from our choice of courses. Our standard Service includes access to all course material, computer assessed material, and memos for self assessment. This is the most affordable option for SELF STUDY at your own pace.',
      features: [
        'Access to all course material',
        'Computer assessed material',
        'Memos for self assessment',
        'Self-study at your own pace'
      ],
      category: 'IGCSE',
      type: 'Standard',
      subjects: 1
    },
    {
      id: 'igcse-standard-bundle',
      title: 'Standard Service IGCSE Bundle',
      price: 'R1200/month',
      description: 'Choose any SIX subjects from our choice of courses. Our standard Service includes access to all course material, computer assessed material, and memos for self assessment. This is the most affordable option for SELF STUDY at your own pace.',
      features: [
        'Access to all course material',
        'Computer assessed material',
        'Memos for self assessment',
        'Six subjects included',
        'Self-study at your own pace'
      ],
      category: 'IGCSE',
      type: 'Standard',
      subjects: 6
    },
    {
      id: 'igcse-premium-1',
      title: 'Premium Service: 1 IGCSE Subject',
      price: 'R650/month',
      description: 'Choose any ONE subject from our choice of courses. Our Premium Service includes everything as per the standard service, but provides expert assessment, feedback, MOCK examinations, progress tracking, and personalised support via the platform\'s messaging systems.',
      features: [
        'Everything from Standard Service',
        'Expert assessment and feedback',
        'Mock examinations',
        'Progress tracking',
        'Personalised support via messaging'
      ],
      category: 'IGCSE',
      type: 'Premium',
      subjects: 1
    },
    {
      id: 'igcse-premium-bundle',
      title: 'Premium Service IGCSE Bundle',
      price: 'R2999/month',
      description: 'Choose any SIX subjects from our choice of courses. Our Premium Service includes everything as per the standard service, but provides expert assessment, feedback, MOCK examinations, progress tracking, and personalised support via the platform\'s messaging systems.',
      features: [
        'Everything from Standard Service',
        'Expert assessment and feedback',
        'Mock examinations',
        'Progress tracking',
        'Personalised support via messaging',
        'Six subjects included'
      ],
      category: 'IGCSE',
      type: 'Premium',
      subjects: 6
    },
    // AS Level Offerings
    {
      id: 'as-standard-1',
      title: 'Standard Service IAS Level Subject',
      price: 'R350/month',
      description: 'Choose any ONE subject from our choice of courses. Our standard Service includes access to all course material, computer assessed material, and memos for self assessment. This is the most affordable option for SELF STUDY at your own pace.',
      features: [
        'Access to all course material',
        'Computer assessed material',
        'Memos for self assessment',
        'Self-study at your own pace'
      ],
      category: 'AS Level',
      type: 'Standard',
      subjects: 1
    },
    {
      id: 'as-standard-bundle',
      title: 'Standard Service IAS Bundle',
      price: 'R1200/month',
      description: 'Choose any FOUR subjects from our choice of courses. Our standard Service includes access to all course material, computer assessed material, and memos for self assessment. This is the most affordable option for SELF STUDY at your own pace.',
      features: [
        'Access to all course material',
        'Computer assessed material',
        'Memos for self assessment',
        'Four subjects included',
        'Self-study at your own pace'
      ],
      category: 'AS Level',
      type: 'Standard',
      subjects: 4
    },
    {
      id: 'as-premium-1',
      title: 'Premium Service: 1 IAS Subject',
      price: 'R650/month',
      description: 'Choose any ONE subject from our choice of courses. Our Premium Service includes everything as per the standard service, but provides expert assessment, feedback, MOCK examinations, progress tracking, and personalised support via the platform\'s messaging systems.',
      features: [
        'Everything from Standard Service',
        'Expert assessment and feedback',
        'Mock examinations',
        'Progress tracking',
        'Personalised support via messaging'
      ],
      category: 'AS Level',
      type: 'Premium',
      subjects: 1
    },
    {
      id: 'as-premium-bundle',
      title: 'Premium Service: IAS Bundle',
      price: 'R2500/month',
      description: 'Choose any FOUR subjects from our choice of courses. Our Premium Service includes everything as per the standard service, but provides expert assessment, feedback, MOCK examinations, progress tracking, and personalised support via the platform\'s messaging systems.',
      features: [
        'Everything from Standard Service',
        'Expert assessment and feedback',
        'Mock examinations',
        'Progress tracking',
        'Personalised support via messaging',
        'Four subjects included'
      ],
      category: 'AS Level',
      type: 'Premium',
      subjects: 4
    }
  ];

  const filteredTiers = pricingTiers.filter(tier => 
    selectedCategory === 'all' || tier.category === selectedCategory
  );

  const handlePricingClick = (tierId: string) => {
    setShowDetails(showDetails === tierId ? null : tierId);
  };

  // Add to Cart logic (same as Shop)
  const addToCart = (tier: PricingTier) => {
    const priceValue = parseFloat(tier.price.replace(/[^\d.]/g, ''));
    const product = {
      id: `pricing-${tier.id}`,
      name: tier.title,
      price: priceValue,
      image: '/images/logo.png', // Placeholder or use a relevant image
    };
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      let newCart;
      if (existingItem) {
        newCart = prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prevCart, { product, quantity: 1 }];
      }
      localStorage.setItem('shopCart', JSON.stringify(newCart));
      return newCart;
    });
    setShowAdded(tier.id);
    setTimeout(() => setShowAdded(null), 1500);
  };

  // Cart summary helpers
  const getCartItemCount = () => cart.reduce((total, item) => total + item.quantity, 0);
  const getCartTotal = () => cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <div className="pricing-2025">
      <div className="hero-section">
        <div className="container">
          <h1>Pricing 2025</h1>
          <p>Choose the perfect plan for your educational journey</p>
        </div>
      </div>
      
      <div className="content-section">
        <div className="container">
          {/* Cart Summary and Go to Cart */}
          <div className="cart-summary-bar">
            <div className="cart-summary-info">
              <span className="cart-icon">🛒</span>
              <span className="cart-count">{getCartItemCount()} item{getCartItemCount() !== 1 ? 's' : ''}</span>
              <span className="cart-total">Total: R {getCartTotal().toFixed(2)}</span>
            </div>
            <button className="go-to-cart-btn" onClick={() => navigate('/checkout')}>
              Go to Cart
            </button>
          </div>

          <div className="pricing-header">
            <h2>International GCSE & AS Level Pricing 2025</h2>
            <p>Flexible options designed to meet your learning needs and budget</p>
          </div>
          
          <div className="category-tabs">
            <button
              className={`category-tab ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Programs
            </button>
            <button
              className={`category-tab ${selectedCategory === 'IGCSE' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('IGCSE')}
            >
              International GCSE
            </button>
            <button
              className={`category-tab ${selectedCategory === 'AS Level' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('AS Level')}
            >
              International AS Level
            </button>
          </div>
          
          {(selectedCategory === 'all' || selectedCategory === 'IGCSE') && (
            <>
              <h2 className="section-title">International GCSE Programs</h2>
              <div className="pricing-grid">
                {filteredTiers
                  .filter(tier => tier.category === 'IGCSE')
                  .sort((a, b) => {
                    // Sort order: standard single, standard bundle, premium single, premium bundle
                    if (a.type === 'Standard' && b.type === 'Premium') return -1;
                    if (a.type === 'Premium' && b.type === 'Standard') return 1;
                    if (a.type === b.type) {
                      if (a.subjects === 1 && b.subjects > 1) return -1;
                      if (a.subjects > 1 && b.subjects === 1) return 1;
                    }
                    return 0;
                  })
                  .map((tier) => (
                    <div
                      key={tier.id}
                      className={`pricing-card ${tier.popular ? 'popular' : ''} ${showDetails === tier.id ? 'expanded' : ''}`}
                      onClick={() => handlePricingClick(tier.id)}
                    >
                      {tier.popular && <div className="popular-badge">Most Popular</div>}
                      <div className="pricing-header">
                        <div className="tier-category">{tier.category}</div>
                        <div className="tier-type">{tier.type}</div>
                        <h3>{tier.title}</h3>
                        <div className="price">{tier.price}</div>
                        <div className="subjects-count">{tier.subjects} {tier.subjects === 1 ? 'Subject' : 'Subjects'}</div>
                      </div>
                      <div className="pricing-description">
                        <p>{tier.description}</p>
                      </div>
                      <div className="pricing-features">
                        <h4>What's Included:</h4>
                        <ul>
                          {tier.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pricing-actions">
                        <button className="learn-more-btn">
                          {showDetails === tier.id ? 'Show Less' : 'Learn More'}
                        </button>
                        <button
                          className="enroll-btn add-to-cart-btn"
                          onClick={e => {
                            e.stopPropagation();
                            addToCart(tier);
                          }}
                        >
                          {showAdded === tier.id ? 'Added!' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}

          {(selectedCategory === 'all' || selectedCategory === 'AS Level') && (
            <>
              <h2 className="section-title">International AS Level Programs</h2>
              <div className="pricing-grid">
                {filteredTiers
                  .filter(tier => tier.category === 'AS Level')
                  .sort((a, b) => {
                    // Sort order: standard single, standard bundle, premium single, premium bundle
                    if (a.type === 'Standard' && b.type === 'Premium') return -1;
                    if (a.type === 'Premium' && b.type === 'Standard') return 1;
                    if (a.type === b.type) {
                      if (a.subjects === 1 && b.subjects > 1) return -1;
                      if (a.subjects > 1 && b.subjects === 1) return 1;
                    }
                    return 0;
                  })
                  .map((tier) => (
                    <div
                      key={tier.id}
                      className={`pricing-card ${tier.popular ? 'popular' : ''} ${showDetails === tier.id ? 'expanded' : ''}`}
                      onClick={() => handlePricingClick(tier.id)}
                    >
                      {tier.popular && <div className="popular-badge">Most Popular</div>}
                      <div className="pricing-header">
                        <div className="tier-category">{tier.category}</div>
                        <div className="tier-type">{tier.type}</div>
                        <h3>{tier.title}</h3>
                        <div className="price">{tier.price}</div>
                        <div className="subjects-count">{tier.subjects} {tier.subjects === 1 ? 'Subject' : 'Subjects'}</div>
                      </div>
                      <div className="pricing-description">
                        <p>{tier.description}</p>
                      </div>
                      <div className="pricing-features">
                        <h4>What's Included:</h4>
                        <ul>
                          {tier.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pricing-actions">
                        <button className="learn-more-btn">
                          {showDetails === tier.id ? 'Show Less' : 'Learn More'}
                        </button>
                        <button
                          className="enroll-btn add-to-cart-btn"
                          onClick={e => {
                            e.stopPropagation();
                            addToCart(tier);
                          }}
                        >
                          {showAdded === tier.id ? 'Added!' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
          
          <div className="pricing-footer">
            <div className="contact-section">
              <h3>Need Help Choosing?</h3>
              <p>Our education consultants are here to help you find the perfect plan for your learning goals.</p>
              <button className="contact-btn">Contact Us</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing2025; 
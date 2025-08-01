import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Shop.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  featured?: boolean;
  tags: string[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [showCart, setShowCart] = useState<boolean>(false);

  const categories = useMemo(() => [
    { id: 'all', name: 'All Products', icon: '🛍️' },
    { id: 'Study Guides', name: 'Study Guides', icon: '📚' },
    { id: 'Workbooks', name: 'Workbooks', icon: '📝' },
    { id: 'Course Bundles', name: 'Course Bundles', icon: '📦' },
    { id: 'Career Guidance', name: 'Career Guidance', icon: '🎯' },
    { id: 'Tutoring', name: 'Tutoring', icon: '👨‍🏫' },
    { id: 'Digital Content', name: 'Digital Content', icon: '💻' }
  ], []);

  useEffect(() => {
    // Sample products data
    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'IGCSE Mathematics Study Guide',
        description: 'Comprehensive study guide covering all IGCSE Mathematics topics with practice questions and solutions.',
        price: 299.99,
        originalPrice: 399.99,
        image: '/images/products/math-guide.jpg',
        category: 'Study Guides',
        inStock: true,
        featured: true,
        tags: ['IGCSE', 'Mathematics', 'Study Guide']
      },
      {
        id: '2',
        name: 'AS Level Physics Workbook',
        description: 'Interactive workbook with practical exercises and detailed explanations for AS Level Physics.',
        price: 249.99,
        image: '/images/products/physics-workbook.jpg',
        category: 'Workbooks',
        inStock: true,
        featured: true,
        tags: ['AS Level', 'Physics', 'Workbook']
      },
      {
        id: '3',
        name: 'Exam Preparation Course Bundle',
        description: 'Complete bundle including study materials, practice tests, and online support for IGCSE exams.',
        price: 599.99,
        originalPrice: 799.99,
        image: '/images/products/exam-bundle.jpg',
        category: 'Course Bundles',
        inStock: true,
        tags: ['IGCSE', 'Exam Prep', 'Bundle']
      },
      {
        id: '4',
        name: 'University Application Guide',
        description: 'Step-by-step guide for university applications, personal statements, and interview preparation.',
        price: 199.99,
        image: '/images/products/uni-guide.jpg',
        category: 'Career Guidance',
        inStock: true,
        tags: ['University', 'Applications', 'Career']
      },
      {
        id: '5',
        name: 'Online Tutoring Session (1 Hour)',
        description: 'One-on-one online tutoring session with an expert educator in your chosen subject.',
        price: 150.00,
        image: '/images/products/tutoring.jpg',
        category: 'Tutoring',
        inStock: true,
        tags: ['Tutoring', 'Online', '1-on-1']
      },
      {
        id: '6',
        name: 'Study Skills Masterclass Recording',
        description: 'Access to recorded masterclass on effective study techniques and time management.',
        price: 99.99,
        image: '/images/products/masterclass.jpg',
        category: 'Digital Content',
        inStock: true,
        tags: ['Study Skills', 'Digital', 'Recording']
      }
    ];
    
    setProducts(sampleProducts);
    // Load cart from localStorage
    const savedCart = localStorage.getItem('shopCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem('shopCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="shop">
      <div className="hero-section">
        <div className="container">
          <h1>Educational Shop</h1>
          <p>Quality study materials, courses, and resources to support your learning journey</p>
        </div>
      </div>
      
      <div className="content-section">
        <div className="container">
          <div className="shop-header">
            <div className="search-filters">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="search-icon">🔍</span>
              </div>
              
              <div className="filter-controls">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
            
            <div className="cart-summary" onClick={() => setShowCart(!showCart)}>
              <span className="cart-icon">🛒</span>
              <span className="cart-count">{getCartItemCount()}</span>
              <span className="cart-total">R {getCartTotal().toFixed(2)}</span>
            </div>
          </div>
          
          <div className="category-tabs">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
          
          {showCart && (
            <div className="cart-sidebar">
              <div className="cart-header">
                <h3>Shopping Cart</h3>
                <button className="close-cart" onClick={() => setShowCart(false)}>×</button>
              </div>
              
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <p>Your cart is empty</p>
                  <button onClick={() => setShowCart(false)}>Continue Shopping</button>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.product.id} className="cart-item">
                        <img src={item.product.image} alt={item.product.name} />
                        <div className="cart-item-details">
                          <h4>{item.product.name}</h4>
                          <p>R {item.product.price.toFixed(2)}</p>
                          <div className="quantity-controls">
                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                          </div>
                        </div>
                        <button className="remove-item" onClick={() => removeFromCart(item.product.id)}>×</button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="cart-footer">
                    <div className="cart-total">
                      <strong>Total: R {getCartTotal().toFixed(2)}</strong>
                    </div>
                    <Link to="/checkout" className="checkout-btn" onClick={() => setShowCart(false)}>
                      Proceed to Checkout
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
          
          <div className="products-grid">
            {sortedProducts.map(product => (
              <div key={product.id} className="product-card">
                {product.featured && <div className="featured-badge">Featured</div>}
                {product.originalPrice && (
                  <div className="discount-badge">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </div>
                )}
                
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  
                  <div className="product-tags">
                    {product.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  
                  <div className="product-price">
                    <span className="current-price">R {product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="original-price">R {product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  
                  <div className="product-actions">
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <button className="view-details-btn">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {sortedProducts.length === 0 && (
            <div className="no-products">
              <h3>No products found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop; 
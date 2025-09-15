import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './ServiceCatalog.css';
import { CartItem, Product } from '@guerilla-teaching/shared-types';

// Service Catalog - Browse services and add to quote request

const ServiceCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [quote, setQuote] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [showQuote, setShowQuote] = useState<boolean>(false);

  const categories = useMemo(() => [
    { id: 'all', name: 'All Services', icon: '📋' },
    { id: 'Courses', name: 'Courses', icon: '🎓' },
    { id: 'Pricing 2025', name: 'Service Tiers', icon: '💰' },
    { id: 'Study Guides', name: 'Study Guides', icon: '📚' },
    { id: 'Workbooks', name: 'Workbooks', icon: '📝' },
    { id: 'Course Bundles', name: 'Course Bundles', icon: '📦' }
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
    
    // Fetch products from backend API
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const productsData = await response.json();
          setProducts(productsData);
        } else {
          console.error('Failed to fetch products');
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
    };

    fetchProducts();
    
    // Load quote from localStorage
    const savedQuote = localStorage.getItem('quoteRequest');
    if (savedQuote) {
      setQuote(JSON.parse(savedQuote));
    }
  }, []);

  useEffect(() => {
    // Save quote to localStorage
    localStorage.setItem('quoteRequest', JSON.stringify(quote));
  }, [quote]);

  const addToQuote = (product: Product) => {
    setQuote(prevQuote => {
      const existingItem = prevQuote.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevQuote.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevQuote, { product, quantity: 1 }];
      }
    });
  };

  const removeFromQuote = (productId: string) => {
    setQuote(prevQuote => prevQuote.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromQuote(productId);
    } else {
      setQuote(prevQuote =>
        prevQuote.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const getQuoteTotal = () => {
    return quote.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getQuoteItemCount = () => {
    return quote.reduce((total, item) => total + item.quantity, 0);
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
    <div className="service-catalog">
      <div className="hero-section">
        <div className="container">
          <h1>Educational Services</h1>
          <p>Quality study materials, courses, and resources to support your learning journey</p>
        </div>
      </div>
      
      <div className="content-section">
        <div className="container">
          <div className="catalog-header">
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
            
            <div className="quote-summary" onClick={() => setShowQuote(!showQuote)}>
              <span className="quote-icon">📋</span>
              <span className="quote-count">{getQuoteItemCount()}</span>
              <span className="quote-total">R {getQuoteTotal().toFixed(2)}</span>
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

          {/* Featured Courses Section */}
          {selectedCategory === 'Courses' && (
            <div className="featured-courses-section">
              <div className="courses-hero">
                <h2>🎓 IGCSE & A-Level Courses</h2>
                <p>Explore our comprehensive educational courses with expert support and proven results.</p>
              </div>
              
              <div className="course-pathways">
                <div className="pathway-card featured">
                  <div className="pathway-header">
                    <h3>International GCSE</h3>
                    <div className="pathway-badge">Most Popular</div>
                  </div>
                  <div className="pathway-content">
                    <p>11 comprehensive IGCSE courses with Pearson Edexcel and Cambridge qualifications. Choose from Mathematics, Sciences, Languages, Humanities, and Business.</p>
                    <div className="pathway-features">
                      <span>✓ 11 Course Options</span>
                      <span>✓ Expert Support</span>
                      <span>✓ Proven Results</span>
                    </div>
                    <div className="pathway-pricing">
                      <span className="from-price">From R350/month</span>
                      <span className="price-note">per subject</span>
                    </div>
                    <div className="pathway-actions">
                      <Link to="/learning-portal/igcse" className="pathway-btn primary">
                        View Service Tiers
                      </Link>
                      <Link to="/learning-portal/igcse/courses" className="pathway-btn secondary">
                        Browse Courses
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="pathway-card">
                  <div className="pathway-header">
                    <h3>International A-Levels</h3>
                  </div>
                  <div className="pathway-content">
                    <p>Advanced level qualifications for university entry. Build on your IGCSE foundation with in-depth subject knowledge and critical thinking skills.</p>
                    <div className="pathway-features">
                      <span>✓ University Preparation</span>
                      <span>✓ Advanced Content</span>
                      <span>✓ Critical Thinking</span>
                    </div>
                    <div className="pathway-pricing">
                      <span className="from-price">From R350/month</span>
                      <span className="price-note">per subject</span>
                    </div>
                    <div className="pathway-actions">
                      <Link to="/learning-portal/as-levels" className="pathway-btn primary">
                        View Service Tiers
                      </Link>
                      <Link to="/learning-portal/as-levels/courses" className="pathway-btn secondary">
                        Browse Courses
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="course-highlights">
                <h3>Why Choose Our Courses?</h3>
                <div className="highlights-grid">
                  <div className="highlight-item">
                    <div className="highlight-icon">🌟</div>
                    <h4>Expert Support</h4>
                    <p>Premium service includes expert assessment, feedback, and personalized support.</p>
                  </div>
                  <div className="highlight-item">
                    <div className="highlight-icon">📚</div>
                    <h4>Comprehensive Materials</h4>
                    <p>Complete course materials, practice questions, and mock examinations.</p>
                  </div>
                  <div className="highlight-item">
                    <div className="highlight-icon">🎯</div>
                    <h4>Proven Results</h4>
                    <p>Track record of student success with globally recognized qualifications.</p>
                  </div>
                  <div className="highlight-item">
                    <div className="highlight-icon">⏰</div>
                    <h4>Flexible Learning</h4>
                    <p>Self-paced study options that fit around your schedule.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {showQuote && (
            <div className="quote-sidebar">
              <div className="quote-header">
                <h3>Quote Request</h3>
                <button className="close-quote" onClick={() => setShowQuote(false)}>×</button>
              </div>
              
              {quote.length === 0 ? (
                <div className="empty-quote">
                  <p>Your quote request is empty</p>
                  <button onClick={() => setShowQuote(false)}>Continue Exploring Services</button>
                </div>
              ) : (
                <>
                  <div className="quote-items">
                    {quote.map(item => (
                      <div key={item.product.id} className="quote-item">
                        <img src={item.product.image} alt={item.product.name} />
                        <div className="quote-item-details">
                          <h4>{item.product.name}</h4>
                          <p>R {item.product.price.toFixed(2)}</p>
                          <div className="quantity-controls">
                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                          </div>
                        </div>
                        <button className="remove-item" onClick={() => removeFromQuote(item.product.id)}>×</button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="quote-footer">
                    <div className="quote-total">
                      <strong>Total: R {getQuoteTotal().toFixed(2)}</strong>
                    </div>
                    <Link to="/checkout" className="view-quote-btn" onClick={() => setShowQuote(false)}>
                      View Quote
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
                      className="add-to-quote-btn"
                      onClick={() => addToQuote(product)}
                      disabled={!product.inStock}
                    >
                      {product.inStock ? 'Add to Quote' : 'Out of Stock'}
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

export default ServiceCatalog; 
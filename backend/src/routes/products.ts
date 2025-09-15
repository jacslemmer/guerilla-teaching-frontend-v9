import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '@guerilla-teaching/shared-types';

const router = express.Router();

// Product catalog routes - no order processing, just product management

// In-memory storage (replace with database in production)
// Products array cleaned up - freestyle/example products removed
// Ready to be populated by proper product sources (Learning Portal, Pricing 2025)

// Pricing 2025 Products converted from frontend pricing tiers
const pricing2025Products: Product[] = [
  // IGCSE Standard Products
  {
    id: 'pricing-igcse-standard-1',
    name: 'Standard Service: 1 IGCSE Subject',
    description: 'Choose any ONE subject from our choice of courses. Our standard Service includes access to all course material, computer assessed material, and memos for self assessment. This is the most affordable option for SELF STUDY at your own pace.',
    price: 350,
    image: '/images/pricing/igcse-standard.jpg',
    category: 'Pricing 2025',
    inStock: true,
    featured: false,
    tags: ['IGCSE', 'Standard', 'Self Study', 'Monthly']
  },
  {
    id: 'pricing-igcse-standard-bundle',
    name: 'Standard Service IGCSE Bundle',
    description: 'Choose any SIX subjects from our choice of courses. Our standard Service includes access to all course material, computer assessed material, and memos for self assessment. Six subjects included for comprehensive IGCSE preparation.',
    price: 1200,
    image: '/images/pricing/igcse-standard-bundle.jpg',
    category: 'Pricing 2025',
    inStock: true,
    featured: true,
    tags: ['IGCSE', 'Standard', 'Bundle', 'Six Subjects', 'Monthly']
  },
  // IGCSE Premium Products
  {
    id: 'pricing-igcse-premium-1',
    name: 'Premium Service: 1 IGCSE Subject',
    description: 'Choose any ONE subject from our choice of courses. Our Premium Service includes everything as per the standard service, but provides expert assessment, feedback, MOCK examinations, progress tracking, and personalised support via the platform\'s messaging systems.',
    price: 650,
    image: '/images/pricing/igcse-premium.jpg',
    category: 'Pricing 2025',
    inStock: true,
    featured: true,
    tags: ['IGCSE', 'Premium', 'Expert Assessment', 'Mock Exams', 'Monthly']
  },
  {
    id: 'pricing-igcse-premium-bundle',
    name: 'Premium Service IGCSE Bundle',
    description: 'Choose any SIX subjects from our choice of courses. Our Premium Service includes everything as per the standard service, but provides expert assessment, feedback, MOCK examinations, progress tracking, and personalised support. Six subjects included.',
    price: 2999,
    image: '/images/pricing/igcse-premium-bundle.jpg',
    category: 'Pricing 2025',
    inStock: true,
    featured: true,
    tags: ['IGCSE', 'Premium', 'Bundle', 'Six Subjects', 'Expert Support', 'Monthly']
  },
  // AS Level Standard Products
  {
    id: 'pricing-as-standard-1',
    name: 'Standard Service IAS Level Subject',
    description: 'Choose any ONE subject from our choice of courses. Our standard Service includes access to all course material, computer assessed material, and memos for self assessment. This is the most affordable option for SELF STUDY at your own pace.',
    price: 350,
    image: '/images/pricing/as-standard.jpg',
    category: 'Pricing 2025',
    inStock: true,
    featured: false,
    tags: ['AS Level', 'Standard', 'Self Study', 'Monthly']
  },
  {
    id: 'pricing-as-standard-bundle',
    name: 'Standard Service IAS Bundle',
    description: 'Choose any FOUR subjects from our choice of courses. Our standard Service includes access to all course material, computer assessed material, and memos for self assessment. Four subjects included for AS Level preparation.',
    price: 1200,
    image: '/images/pricing/as-standard-bundle.jpg',
    category: 'Pricing 2025',
    inStock: true,
    featured: false,
    tags: ['AS Level', 'Standard', 'Bundle', 'Four Subjects', 'Monthly']
  },
  // AS Level Premium Products
  {
    id: 'pricing-as-premium-1',
    name: 'Premium Service: 1 IAS Subject',
    description: 'Choose any ONE subject from our choice of courses. Our Premium Service includes everything as per the standard service, but provides expert assessment, feedback, MOCK examinations, progress tracking, and personalised support via the platform\'s messaging systems.',
    price: 650,
    image: '/images/pricing/as-premium.jpg',
    category: 'Pricing 2025',
    inStock: true,
    featured: false,
    tags: ['AS Level', 'Premium', 'Expert Assessment', 'Mock Exams', 'Monthly']
  },
  {
    id: 'pricing-as-premium-bundle',
    name: 'Premium Service: IAS Bundle',
    description: 'Choose any FOUR subjects from our choice of courses. Our Premium Service includes everything as per the standard service, but provides expert assessment, feedback, MOCK examinations, progress tracking, and personalised support. Four subjects included.',
    price: 2500,
    image: '/images/pricing/as-premium-bundle.jpg',
    category: 'Pricing 2025',
    inStock: true,
    featured: true,
    tags: ['AS Level', 'Premium', 'Bundle', 'Four Subjects', 'Expert Support', 'Monthly']
  }
];

let products: Product[] = [...pricing2025Products];

let orders: Order[] = [];

// Get all products
router.get('/products', (req, res) => {
  try {
    const { category, search, featured } = req.query;
    
    let filteredProducts = [...products];
    
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (search) {
      const searchTerm = search.toString().toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(p => p.featured);
    }
    
    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product
router.get('/products/:id', (req, res) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (admin only)
router.post('/products', (req, res) => {
  try {
    const { name, description, price, originalPrice, image, category, inStock, featured, tags } = req.body;
    
    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newProduct: Product = {
      id: uuidv4(),
      name,
      description,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      image,
      category,
      inStock: Boolean(inStock),
      featured: Boolean(featured),
      tags: Array.isArray(tags) ? tags : []
    };
    
    products.push(newProduct);
    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (admin only)
router.put('/products/:id', (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const { name, description, price, originalPrice, image, category, inStock, featured, tags } = req.body;
    
    products[productIndex] = {
      ...products[productIndex],
      name: name || products[productIndex].name,
      description: description || products[productIndex].description,
      price: price ? parseFloat(price) : products[productIndex].price,
      originalPrice: originalPrice ? parseFloat(originalPrice) : products[productIndex].originalPrice,
      image: image || products[productIndex].image,
      category: category || products[productIndex].category,
      inStock: inStock !== undefined ? Boolean(inStock) : products[productIndex].inStock,
      featured: featured !== undefined ? Boolean(featured) : products[productIndex].featured,
      tags: Array.isArray(tags) ? tags : products[productIndex].tags
    };
    
    return res.json(products[productIndex]);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin only)
router.delete('/products/:id', (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    products.splice(productIndex, 1);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Create order
router.post('/orders/create', (req, res) => {
  try {
    const { items, customer, paymentMethod, subtotal, shipping, total, currency } = req.body;
    
    if (!items || !customer || !paymentMethod || !total) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newOrder: Order = {
      id: uuidv4(),
      items,
      customer,
      paymentMethod,
      subtotal: parseFloat(subtotal),
      shipping: parseFloat(shipping),
      total: parseFloat(total),
      currency: currency || 'ZAR',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    
    // Generate payment URL based on payment method
    let paymentUrl = '';
    switch (paymentMethod) {
      case 'paygate':
        paymentUrl = `/api/payment/paygate/${newOrder.id}`;
        break;
      case 'payfast':
        paymentUrl = `/api/payment/payfast/${newOrder.id}`;
        break;
      case 'stripe':
        paymentUrl = `/api/payment/stripe/${newOrder.id}`;
        break;
      case 'paypal':
        paymentUrl = `/api/payment/paypal/${newOrder.id}`;
        break;
      default:
        paymentUrl = `/api/payment/generic/${newOrder.id}`;
    }
    
    return res.status(201).json({
      orderId: newOrder.id,
      paymentUrl,
      message: 'Order created successfully'
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get order status
router.get('/orders/:id', (req, res) => {
  try {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.json(order);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Get all orders (admin only)
router.get('/orders', (req, res) => {
  try {
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

export default router; 
import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Product interface
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  featured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Order interface
interface Order {
  id: string;
  items: Array<{
    product: Product;
    quantity: number;
  }>;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  createdAt: string;
}

// In-memory storage (replace with database in production)
let products: Product[] = [
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
    tags: ['IGCSE', 'Mathematics', 'Study Guide'],
    createdAt: '2025-01-15',
    updatedAt: '2025-01-15'
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
    tags: ['AS Level', 'Physics', 'Workbook'],
    createdAt: '2025-01-10',
    updatedAt: '2025-01-12'
  }
];

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
      tags: Array.isArray(tags) ? tags : [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
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
      tags: Array.isArray(tags) ? tags : products[productIndex].tags,
      updatedAt: new Date().toISOString().split('T')[0]
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
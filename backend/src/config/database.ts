/**
 * D1 Database Configuration
 * Cloudflare D1 database setup and connection management
 */

// Simple in-memory storage for development (replace with D1 in production)
interface QuoteStorage {
  id: string;
  referenceNumber: string;
  customerData: string;
  items: string;
  subtotal: number;
  total: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  comments?: string;
  createdAt: string;
  expiresAt: string;
  lastModifiedAt?: string;
}

// In-memory quote storage for development
const quoteStorage: QuoteStorage[] = [];

// Database service interface (simplified)
export interface DatabaseService {
  createQuote: (quote: QuoteStorage) => Promise<QuoteStorage>;
  findQuoteByReference: (reference: string) => Promise<QuoteStorage | null>;
  findQuoteById: (id: string) => Promise<QuoteStorage | null>;
  updateQuoteStatus: (id: string, status: 'pending' | 'approved' | 'rejected' | 'expired') => Promise<QuoteStorage | null>;
  getAllReferences: () => Promise<string[]>;
  getAllQuotes: (limit?: number, offset?: number) => Promise<QuoteStorage[]>;
  deleteQuote: (id: string) => Promise<boolean>;
}

// Simple in-memory database implementation for development
export const createDatabaseService = (): DatabaseService => ({
  createQuote: async (quote: QuoteStorage) => {
    quoteStorage.push(quote);
    return quote;
  },

  findQuoteByReference: async (reference: string) => {
    return quoteStorage.find(q => q.referenceNumber === reference) || null;
  },

  findQuoteById: async (id: string) => {
    return quoteStorage.find(q => q.id === id) || null;
  },

  updateQuoteStatus: async (id: string, status: 'pending' | 'approved' | 'rejected' | 'expired') => {
    const quote = quoteStorage.find(q => q.id === id);
    if (quote) {
      quote.status = status;
      quote.lastModifiedAt = new Date().toISOString();
      return quote;
    }
    return null;
  },

  getAllReferences: async () => {
    return quoteStorage.map(q => q.referenceNumber);
  },

  getAllQuotes: async (limit = 50, offset = 0) => {
    return quoteStorage.slice(offset, offset + limit);
  },

  deleteQuote: async (id: string) => {
    const index = quoteStorage.findIndex(q => q.id === id);
    if (index >= 0) {
      quoteStorage.splice(index, 1);
      return true;
    }
    return false;
  }
});

// Health check for database
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    // Simple health check - just verify storage is accessible
    return Array.isArray(quoteStorage);
  } catch (error) {
    return false;
  }
};
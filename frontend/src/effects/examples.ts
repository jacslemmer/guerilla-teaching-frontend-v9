/**
 * Effect-RX Usage Examples for Frontend
 * 
 * This module demonstrates how to use Effect-RX patterns
 * in React components and frontend workflows.
 */

import * as Rx from "@effect-rx/rx-react";
import { Effect, pipe } from "effect";
import { 
  apiGet, 
  apiPost, 
  createAsyncRx, 
  createFormRx, 
  createCacheRx,
  createLoadingState
} from "./index";
import { Product, CartItem } from "@guerilla-teaching/shared-types";

// Example: Product data management
export const useProducts = () => {
  // Create cached reactive state for products
  const productsCache = createCacheRx<Product[]>("products", 300000); // 5 min cache
  
  // Create async reactive state with API loading
  const productsAsync = createAsyncRx(
    "products",
    [] as Product[],
    pipe(
      Effect.sync(() => productsCache.get("all")),
      Effect.andThen((cached) => {
        if (cached) {
          return Effect.succeed(cached);
        }
        
        // Fetch from API if not cached
        return pipe(
          apiGet<Product[]>("/products"),
          Effect.andThen((response) => {
            if (response.success) {
              productsCache.set("all", response.data);
              return Effect.succeed(response.data);
            }
            return Effect.fail(response.error || "Failed to fetch products");
          })
        );
      })
    )
  );

  return {
    products: productsAsync.data,
    loading: productsAsync.loading,
    refresh: productsAsync.refresh,
    invalidateCache: () => productsCache.invalidate("all")
  };
};

// Example: Shopping cart management with Effect-RX
export const useShoppingCart = () => {
  // Cart state atom
  const cartRx = Rx.atom<CartItem[]>("cart", []);
  
  // Loading state for cart operations
  const cartLoadingRx = Rx.atom("cartLoading", createLoadingState());

  // Load cart from localStorage on initialization
  const loadCart = Rx.fn("loadCart", () =>
    pipe(
      Effect.sync(() => {
        try {
          const saved = localStorage.getItem('quoteCart');
          return saved ? JSON.parse(saved) : [];
        } catch {
          return [];
        }
      }),
      Effect.tap((cart) => Effect.sync(() => Rx.set(cartRx, cart)))
    )
  );

  // Save cart to localStorage
  const saveCart = (cart: CartItem[]) =>
    Effect.sync(() => {
      try {
        localStorage.setItem('quoteCart', JSON.stringify(cart));
        Rx.set(cartRx, cart);
      } catch (error) {
        console.error("Failed to save cart:", error);
      }
    });

  // Add item to cart
  const addToCart = Rx.fn("addToCart", (product: Product, quantity: number = 1) => {
    const currentCart = Rx.get(cartRx);
    const existingItem = currentCart.find(item => item.id === product.id);
    
    let newCart: CartItem[];
    
    if (existingItem) {
      newCart = currentCart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCart = [...currentCart, { ...product, quantity }];
    }
    
    return saveCart(newCart);
  });

  // Remove item from cart
  const removeFromCart = Rx.fn("removeFromCart", (productId: string) => {
    const currentCart = Rx.get(cartRx);
    const newCart = currentCart.filter(item => item.id !== productId);
    return saveCart(newCart);
  });

  // Update item quantity
  const updateQuantity = Rx.fn("updateQuantity", (productId: string, quantity: number) => {
    const currentCart = Rx.get(cartRx);
    
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    
    const newCart = currentCart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    
    return saveCart(newCart);
  });

  // Clear cart
  const clearCart = Rx.fn("clearCart", () => saveCart([]));

  // Calculate total
  const cartTotal = Rx.derived("cartTotal", (get) => {
    const cart = get(cartRx);
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  // Calculate item count
  const cartItemCount = Rx.derived("cartItemCount", (get) => {
    const cart = get(cartRx);
    return cart.reduce((count, item) => count + item.quantity, 0);
  });

  return {
    cart: cartRx,
    loading: cartLoadingRx,
    total: cartTotal,
    itemCount: cartItemCount,
    loadCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
};

// Example: User authentication with Effect-RX
export const useAuth = () => {
  interface User {
    id: string;
    email: string;
    name: string;
  }

  interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;
  }

  const initialAuthState: AuthState = {
    user: null,
    isAuthenticated: false,
    token: null
  };

  const authRx = Rx.atom("auth", initialAuthState);
  const authLoadingRx = Rx.atom("authLoading", createLoadingState());

  // Login effect
  const login = Rx.fn("login", (email: string, password: string) =>
    pipe(
      Effect.sync(() => {
        Rx.set(authLoadingRx, {
          isLoading: true,
          error: null,
          lastUpdated: null
        });
      }),
      Effect.andThen(() =>
        apiPost<{ user: User; token: string }>("/auth/login", { email, password })
      ),
      Effect.tap((response) =>
        Effect.sync(() => {
          if (response.success) {
            const { user, token } = response.data;
            Rx.set(authRx, {
              user,
              token,
              isAuthenticated: true
            });
            localStorage.setItem("authToken", token);
          }
          
          Rx.set(authLoadingRx, {
            isLoading: false,
            error: response.success ? null : (response.error || "Login failed"),
            lastUpdated: new Date()
          });
        })
      )
    )
  );

  // Logout effect
  const logout = Rx.fn("logout", () =>
    Effect.sync(() => {
      Rx.set(authRx, initialAuthState);
      localStorage.removeItem("authToken");
    })
  );

  // Check auth status from localStorage
  const checkAuth = Rx.fn("checkAuth", () =>
    pipe(
      Effect.sync(() => {
        const token = localStorage.getItem("authToken");
        return token;
      }),
      Effect.andThen((token) => {
        if (!token) {
          return Effect.succeed(null);
        }
        
        return apiGet<User>("/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
      }),
      Effect.tap((response) =>
        Effect.sync(() => {
          if (response && response.success) {
            Rx.set(authRx, {
              user: response.data,
              token: localStorage.getItem("authToken"),
              isAuthenticated: true
            });
          } else {
            localStorage.removeItem("authToken");
            Rx.set(authRx, initialAuthState);
          }
        })
      )
    )
  );

  return {
    auth: authRx,
    loading: authLoadingRx,
    login,
    logout,
    checkAuth
  };
};

// Example: Contact form with validation
export const useContactForm = () => {
  interface ContactFormData {
    name: string;
    email: string;
    message: string;
  }

  const initialFormData: ContactFormData = {
    name: "",
    email: "",
    message: ""
  };

  const contactForm = createFormRx("contact", initialFormData);
  const submissionLoadingRx = Rx.atom("contactSubmission", createLoadingState());

  // Validation effects
  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : "Please enter a valid email address";
  };

  const validateRequired = (value: string, fieldName: string): string | null => {
    return value.trim() ? null : `${fieldName} is required`;
  };

  // Submit form effect
  const submitForm = Rx.fn("submitContactForm", () => {
    const formData = contactForm.getValues();
    
    // Validate form
    contactForm.setError("name", validateRequired(formData.name, "Name"));
    contactForm.setError("email", validateEmail(formData.email));
    contactForm.setError("message", validateRequired(formData.message, "Message"));
    
    if (contactForm.hasErrors()) {
      return Effect.succeed(false);
    }

    return pipe(
      Effect.sync(() => {
        Rx.set(submissionLoadingRx, {
          isLoading: true,
          error: null,
          lastUpdated: null
        });
      }),
      Effect.andThen(() =>
        apiPost("/contact", formData)
      ),
      Effect.tap((response) =>
        Effect.sync(() => {
          if (response.success) {
            contactForm.resetForm();
            Rx.set(submissionLoadingRx, {
              isLoading: false,
              error: null,
              lastUpdated: new Date()
            });
          } else {
            Rx.set(submissionLoadingRx, {
              isLoading: false,
              error: response.error || "Failed to submit form",
              lastUpdated: new Date()
            });
          }
        })
      )
    );
  });

  return {
    form: contactForm.form,
    loading: submissionLoadingRx,
    setValue: contactForm.setValue,
    setError: contactForm.setError,
    resetForm: contactForm.resetForm,
    submitForm,
    hasErrors: contactForm.hasErrors,
    isDirty: contactForm.isDirty
  };
};

// Export examples for documentation
export const examples = {
  useProducts,
  useShoppingCart,
  useAuth,
  useContactForm
};
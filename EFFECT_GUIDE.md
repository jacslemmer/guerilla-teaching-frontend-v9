# Effect-TS/RX Integration Guide

This guide explains how to use Effect-TS in the backend and Effect-RX in the frontend for functional programming patterns and reactive state management.

## Backend: Effect-TS

### Overview

Effect-TS is used in the backend for:
- Functional error handling
- Composable async operations
- Type-safe side effects
- Centralized logging and configuration

### Key Files

- `backend/src/config/effects.ts` - Configuration and runtime setup
- `backend/src/effects/index.ts` - Core utilities and patterns  
- `backend/src/effects/examples.ts` - Usage examples

### Basic Usage

```typescript
import { Effect, pipe } from "effect";
import { runEffect } from "../config/effects";
import { createSuccessResponse, dbOperation } from "../effects";

// Simple database operation
const getUser = (id: string) =>
  dbOperation(
    async () => {
      // Your database logic here
      return { id, name: "User Name" };
    },
    `getUser(${id})`
  );

// Use in Express route
export const handleGetUser = async (req: Request, res: Response) => {
  try {
    const user = await runEffect(getUser(req.params.id));
    const response = await runEffect(createSuccessResponse(user));
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to get user" });
  }
};
```

### Common Patterns

#### Database Operations with Timeout and Retry
```typescript
const saveData = (data: any) =>
  pipe(
    dbOperation(() => database.save(data), "saveData"),
    withTimeout(5000),    // 5 second timeout
    withRetry(2)          // Retry twice on failure
  );
```

#### HTTP Requests with Fallback
```typescript
const fetchExternalData = (id: string) =>
  pipe(
    httpRequest(() => fetch(`/api/data/${id}`), "fetchData"),
    withFallback(Effect.succeed({ id, data: "fallback" }))
  );
```

#### Concurrent Operations
```typescript
const getUserWithPosts = (userId: string) =>
  pipe(
    runConcurrently([
      getUser(userId),
      getUserPosts(userId)
    ]),
    Effect.andThen(([user, posts]) => ({ user, posts }))
  );
```

## Frontend: Effect-RX

### Overview

Effect-RX is used in the frontend for:
- Reactive state management
- Type-safe API calls
- Form handling and validation
- Caching and data synchronization

### Key Files

- `frontend/src/config/effects.ts` - Configuration and utilities
- `frontend/src/effects/index.ts` - Core reactive patterns
- `frontend/src/effects/examples.ts` - React hook examples

### Basic Usage

#### API Calls
```typescript
import { apiGet, apiPost } from "../effects";

// GET request
const fetchProducts = () => apiGet<Product[]>("/products");

// POST request
const createProduct = (product: Product) => 
  apiPost<Product>("/products", product);
```

#### Reactive State Management
```typescript
import { createAsyncRx } from "../effects";

// Create reactive state that auto-updates
const useProducts = () => {
  const productsAsync = createAsyncRx(
    "products",
    [] as Product[],
    apiGet<Product[]>("/products")
  );

  return {
    products: productsAsync.data,
    loading: productsAsync.loading,
    refresh: productsAsync.refresh
  };
};
```

#### Form Management
```typescript
import { createFormRx } from "../effects";

const useContactForm = () => {
  const form = createFormRx("contact", {
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = () => {
    const data = form.getValues();
    return apiPost("/contact", data);
  };

  return { form, handleSubmit };
};
```

### React Component Integration

```typescript
import * as Rx from "@effect-rx/rx-react";
import { useProducts, useShoppingCart } from "../effects/examples";

const ProductList: React.FC = () => {
  const { products, loading, refresh } = useProducts();
  const { addToCart } = useShoppingCart();
  
  // Subscribe to reactive state
  const productList = Rx.useValue(products);
  const loadingState = Rx.useValue(loading);
  
  if (loadingState.isLoading) {
    return <div>Loading products...</div>;
  }
  
  if (loadingState.error) {
    return <div>Error: {loadingState.error}</div>;
  }
  
  return (
    <div>
      {productList.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <button onClick={() => Rx.run(addToCart(product, 1))}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};
```

## Environment Configuration

### Backend (.env)
```
# Effect-TS Configuration
EFFECT_CONCURRENCY=10
EFFECT_TIMEOUT=30000
EFFECT_RETRY_ATTEMPTS=3
LOG_LEVEL=info
```

### Frontend (.env)
```
# Effect-RX Configuration  
REACT_APP_API_BASE_URL=/api
REACT_APP_TIMEOUT=10000
REACT_APP_RETRY_ATTEMPTS=2
REACT_APP_LOG_LEVEL=info
```

## Architecture Benefits

### Type Safety
- End-to-end type safety from frontend to backend
- Shared types ensure consistency
- Compile-time error catching

### Error Handling
- Centralized error management
- Predictable error flows
- Automatic logging and recovery

### Performance
- Intelligent caching strategies
- Concurrent operation support
- Optimized re-rendering

### Developer Experience
- Functional programming patterns
- Composable operations
- Clear separation of concerns

## Migration Strategy

### From Existing Code

1. **Gradual Migration**: Start with new features using Effect patterns
2. **Wrap Existing APIs**: Use `dbOperation` and `httpRequest` to wrap current code
3. **State Replacement**: Replace useState/useEffect with Effect-RX patterns
4. **Form Handling**: Migrate forms to `createFormRx` for better validation

### Best Practices

- Use shared types for all API communications
- Implement proper error boundaries
- Cache frequently accessed data
- Log all side effects for debugging
- Test Effect chains independently

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure all Effect packages are installed
2. **Runtime Errors**: Check Effect configuration and environment variables
3. **Type Mismatches**: Verify shared types are up to date
4. **Performance**: Use caching and avoid unnecessary Effect chains

### Debugging

- Enable debug logging: `LOG_LEVEL=debug`
- Use Effect-RX devtools in development
- Check browser network tab for API calls
- Review server logs for Effect-TS operations

## Next Steps

After implementing Effect-TS/RX:

1. Migrate existing API calls to Effect patterns
2. Implement proper caching strategies
3. Add comprehensive error boundaries
4. Set up monitoring and observability
5. Document team-specific patterns

For questions or issues, refer to:
- [Effect-TS Documentation](https://effect.website/)
- [Effect-RX Documentation](https://github.com/Effect-TS/effect-rx)
- Project team Slack/Discord channels
# STORY 1.1: Cart to Quote Terminology Conversion

**Epic**: Cart to Quote System Conversion  
**Priority**: P1 - Critical  
**Assignee**: dev1  
**Status**: Ready for Development  

## Objective
Replace every instance of shopping cart terminology with quote terminology throughout the entire codebase. This is the foundation for converting from e-commerce to educational service quotes.

## Files to Update

### Frontend Files (Priority Order):
1. `frontend/src/pages/Pricing2025.tsx`
2. `frontend/src/pages/Shop.tsx` 
3. `frontend/src/pages/Checkout.tsx`
4. `frontend/src/pages/ASLevelQuoteCourses.tsx`
5. `frontend/src/pages/IGCSEQuoteCourses.tsx`
6. `frontend/src/effects/examples.ts`

## Terminology Changes Required

| Current | New |
|---------|-----|
| cart | quote |
| addToCart | addToQuote |
| Cart | Quote |
| Shopping Cart | Quote Request |
| cart-related | quote-related |
| getCartTotal | getQuoteTotal |
| getCartCount | getQuoteCount |
| removeFromCart | removeFromQuote |
| clearCart | clearQuote |

## UI Text Changes

| Current Text | New Text |
|--------------|----------|
| "Add to Cart" | "Add to Quote" |
| "Cart" | "Quote" |
| "Shopping Cart" | "Quote Request" |
| "Your cart is empty" | "Your quote request is empty" |
| "Go to Cart" | "View Quote" |
| "Clear Cart" | "Clear Quote" |
| "Continue Shopping" | "Continue Browsing" |
| 🛒 (cart icon) | 📋 (quote icon) |

## LocalStorage Updates
- Change `'quoteCart'` → `'quoteRequest'` throughout all files

## Implementation Steps
1. Start with Pricing2025.tsx (has most cart references)
2. Update variable/function names
3. Update UI text and messaging  
4. Change localStorage keys consistently
5. Update icon references
6. Test each page after changes

## Testing Requirements
- [ ] All pages load without errors
- [ ] Quote functionality works end-to-end
- [ ] LocalStorage saves/loads correctly
- [ ] UI text is consistent throughout
- [ ] No cart terminology visible to users

## Definition of Done
- All cart terminology replaced with quote terminology
- All UI text updated appropriately
- LocalStorage keys updated consistently
- No console errors on any page
- Quote functionality works as before

## Notes
- Focus ONLY on terminology - don't change business logic yet
- Test thoroughly on each page
- Do not modify node_modules or backend files in this story
- Business logic changes come in Story 1.2

## When Complete
- Add comment with summary of changes
- List any issues encountered  
- Move to "review" status for code review



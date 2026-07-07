## ADDED Requirements

### Requirement: POS screen at root route

The system SHALL display the sales (POS) screen as the root route `/`.

#### Scenario: Root route shows sales screen
- **WHEN** the user navigates to `/`
- **THEN** the sales screen SHALL be displayed with product search, frequent products grid, and cart

#### Scenario: Sales screen uses full-height layout
- **WHEN** the sales screen is displayed
- **THEN** it SHALL use a full-height layout without the shared navigation header

### Requirement: Inline product search

The system SHALL provide an inline search bar that filters active products by name.

#### Scenario: User types in search bar
- **WHEN** the user types at least 2 characters in the search bar
- **THEN** results SHALL appear after a 300ms debounce

#### Scenario: Search result selection
- **WHEN** the user selects a search result
- **THEN** the product SHALL be added to the cart with quantity 1

### Requirement: Frequent products grid

The system SHALL display a grid of frequent products for quick-access.

#### Scenario: Grid shows quick-access buttons
- **WHEN** the sales screen loads
- **THEN** a grid of product buttons SHALL be displayed, each showing product name and price

#### Scenario: Tapping a frequent product adds to cart
- **WHEN** the user taps a frequent product button
- **THEN** the product SHALL be added to the cart with quantity 1

### Requirement: Cart with quantity editing

The system SHALL maintain an editable cart during the sale.

#### Scenario: Product appears in cart
- **WHEN** a product is added to the cart
- **THEN** it SHALL appear in the cart panel with name, unit price, quantity, and subtotal

#### Scenario: Increment quantity
- **WHEN** the user presses "+" on a cart item
- **THEN** the quantity SHALL increase by 1

#### Scenario: Decrement quantity
- **WHEN** the user presses "-" on a cart item and quantity > 1
- **THEN** the quantity SHALL decrease by 1

#### Scenario: Remove item
- **WHEN** the user presses "-" on a cart item with quantity = 1
- **THEN** the item SHALL be removed from the cart

#### Scenario: Manual quantity input
- **WHEN** the user edits the quantity field directly
- **THEN** the quantity SHALL update to the entered value

#### Scenario: Real-time total
- **WHEN** any cart item changes
- **THEN** the cart total SHALL be recalculated and displayed in real-time

### Requirement: Payment method selection

The system SHALL allow selecting a payment method before charging.

#### Scenario: Payment options displayed
- **WHEN** the user views the cart
- **THEN** three payment options SHALL be displayed: Efectivo, Transferencia, QR Mercado Pago

#### Scenario: Default payment selection
- **WHEN** the sales screen loads
- **THEN** the payment method SHALL default to "Efectivo"

#### Scenario: Change payment method
- **WHEN** the user selects a different payment method
- **THEN** the selection SHALL update immediately

### Requirement: Cobrar button and confirmation

The system SHALL provide a prominent "Cobrar" button with confirmation.

#### Scenario: Cobrar button is prominent
- **WHEN** the cart is not empty
- **THEN** the "Cobrar" button SHALL be large and visually prominent

#### Scenario: Cobrar button is disabled for empty cart
- **WHEN** the cart is empty
- **THEN** the "Cobrar" button SHALL be disabled (RN-04)

#### Scenario: Confirmation dialog
- **WHEN** the user presses "Cobrar"
- **THEN** a confirmation dialog SHALL show the total and selected payment method

#### Scenario: Confirm sale
- **WHEN** the user confirms the sale
- **THEN** the system SHALL call POST /api/ventas with cart details and payment method

#### Scenario: Success feedback
- **WHEN** the sale is confirmed and API returns success
- **THEN** the cart SHALL be cleared and a success toast SHALL be shown

### Requirement: Product availability check

The system SHALL check product availability before adding to cart.

#### Scenario: Out of stock product not shown
- **WHEN** displaying search results or frequent products
- **THEN** products with stock_actual <= 0 SHALL not be displayed

#### Scenario: Insufficient stock warning
- **WHEN** the user adds a product to cart and stock_actual < requested quantity
- **THEN** the system SHALL show an error and prevent the addition

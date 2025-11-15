PROJECT: OT-OnlyThing - Intelligent Skincare & Wellness E-Commerce Platform

## CORE CONCEPT
Build a complete, production-ready e-commerce platform for intelligent, science-backed skincare and wellness products. The platform should feel premium, modern, and trustworthy with a primary BLACK & WHITE design theme (accent colors allowed for highlights, CTAs, and visual interest).

## DESIGN PHILOSOPHY
- **Primary Theme**: Black and white as the foundation
- **Accent Colors**: Use strategic pops of color for:
  - Call-to-action buttons (e.g., vibrant blue/green for "Add to Cart", "Buy Now")
  - Status indicators (green for success, red for errors, yellow for warnings)
  - Rating stars (gold/yellow)
  - Discount badges (red)
  - Feature highlights
- **Typography**: Bold, modern, clean fonts with strong hierarchy
- **Layout**: Clean, spacious, professional with high-quality product imagery
- **Feel**: Premium, trustworthy, science-backed, modern minimalism
- **Inspiration**: Think Apple-like minimalism meets luxury skincare brands

## CORE FEATURES REQUIRED

### 1. USER AUTHENTICATION & PROFILES
- Email/password signup and login
- Google OAuth sign-in option
- User profile management (name, email, phone, avatar)
- Role-based access (regular users vs admins)
- Password reset functionality
- Secure session management

### 2. PRODUCT CATALOG
- Product listing with beautiful grid layout
- Product details page with:
  - Multiple product images (gallery/carousel)
  - Product name, description, price
  - Specifications table
  - Stock availability
  - Add to cart with quantity selector
  - Add to wishlist button
  - Customer reviews and ratings
  - Related products section
- Product categories and subcategories
- Product variants (size, color, etc.) if applicable
- Product search with autocomplete
- Filter products by:
  - Category
  - Price range
  - Rating
  - Availability
- Sort products by:
  - Newest
  - Price (low to high, high to low)
  - Popularity
  - Highest rated

### 3. SHOPPING EXPERIENCE
- **Shopping Cart**:
  - Add/remove products
  - Update quantities
  - View cart summary (subtotal, tax, shipping, total)
  - Persist cart across sessions
  - Empty cart state
- **Wishlist**:
  - Save products for later
  - Move from wishlist to cart
  - Remove from wishlist
- **Checkout Process**:
  - Shipping address form (save multiple addresses)
  - Order review page
  - Payment integration (Razorpay)
  - Order confirmation page
  - Email confirmation (optional)

### 4. ORDER MANAGEMENT
- Order history for users
- Order tracking with status updates:
  - Pending → Processing → Shipped → Delivered
  - Cancelled/Refunded states
- Order details page showing:
  - Items ordered
  - Quantities and prices
  - Shipping address
  - Payment status
  - Tracking number (once shipped)
- Download invoice/receipt option

### 5. PRODUCT REVIEWS & RATINGS
- Users can submit reviews after purchase
- Star rating system (1-5 stars)
- Review title and detailed comment
- "Verified Purchase" badge
- Admin approval for reviews before publishing
- Sort reviews by newest, highest rated, lowest rated
- Helpful/not helpful voting (optional)

### 6. ADMIN DASHBOARD (Full CMS)
- **Dashboard Overview**:
  - Total products, orders, users, revenue stats
  - Recent orders
  - Pending customer queries
  - Quick action buttons
- **Product Management**:
  - View all products in a table
  - Add new product with form (name, description, price, images, category, stock, etc.)
  - Edit existing products
  - Delete products
  - Bulk actions (activate/deactivate, delete)
  - Image upload functionality
  - Mark products as featured
- **Order Management**:
  - View all orders with filters (status, date, payment status)
  - Update order status
  - Add tracking numbers
  - View detailed order information
  - Mark orders as shipped/delivered
- **Category Management**:
  - Create, edit, delete product categories
  - Organize categories hierarchy
- **Customer Queries**:
  - View all customer inquiries from contact form
  - Respond to queries
  - Mark queries as resolved/pending
  - Priority management (low, medium, high, urgent)
- **Review Management**:
  - View all product reviews
  - Approve or reject pending reviews
  - Delete inappropriate reviews
- **Blog Management** (optional but recommended):
  - Create, edit, delete blog posts
  - Rich text editor for content
  - Publish/draft status
  - Featured image
  - SEO meta tags
- **User Management**:
  - View all registered users
  - Promote users to admin
  - View user order history

### 7. CUSTOMER PAGES

#### Homepage:
- Hero section with main headline and CTA buttons
- Trust badges (free shipping, secure payment, 24/7 support, quality guarantee)
- Featured products carousel/grid
- Product categories showcase
- Customer testimonials or review highlights
- Why choose us section (clinically proven, personalized care, premium quality)
- Newsletter subscription form
- Instagram feed or social proof section
- Latest blog posts preview

#### Shop Page:
- All products in a responsive grid
- Sidebar with filters and sorting options
- Search bar at the top
- Pagination or infinite scroll
- Grid/list view toggle
- Product count display
- Empty state when no products match filters

#### Product Detail Page:
- Large product image gallery
- Product title and price (with compare price/discount if applicable)
- Add to cart button (prominent, accent color)
- Add to wishlist button
- Product description (short and detailed versions)
- Specifications/ingredients table
- Stock availability indicator
- Quantity selector
- Reviews and ratings section
- Related products carousel
- "You may also like" section
- Share buttons (social media)

#### Cart Page:
- List of cart items with images, names, prices, quantities
- Quantity adjustment controls
- Remove item button
- Subtotal per item
- Order summary box:
  - Subtotal
  - Tax (18% GST)
  - Shipping cost (free over ₹500)
  - Total amount
- Proceed to checkout button
- "Continue shopping" link
- Empty cart state with CTA to browse products

#### Checkout Page:
- Shipping address form (with saved addresses option)
- Billing address (same as shipping option)
- Order review section
- Payment method selection
- Apply coupon code (optional)
- Terms and conditions checkbox
- Place order button
- Security badges (secure payment icons)
- Order summary sidebar

#### Order Confirmation Page:
- "Thank you for your order" message
- Order number
- Estimated delivery date
- Order summary
- Shipping address
- Payment details
- "Continue shopping" or "View order details" buttons

#### My Account Page:
- Dashboard with tabs/sections:
  - **Overview**: Profile summary, recent orders
  - **Profile**: Edit personal information (name, email, phone)
  - **Orders**: Order history with status
  - **Addresses**: Manage shipping addresses (add, edit, delete, set default)
  - **Wishlist**: Saved products
  - **Settings**: Change password, notification preferences
  - **Logout**: Sign out option

#### Contact Page:
- Contact form (name, email, phone, subject, message)
- Contact information (email, phone, address)
- Google Maps embed (optional)
- Social media links
- FAQ link

#### About Page:
- Company story and mission
- "Our Science" section (why products are effective)
- Values and commitments
- Team section (optional)
- Customer testimonials

#### Blog Page:
- Blog post grid/list
- Categories/tags filter
- Search blog posts
- Featured post highlight
- Individual blog post page with full content

#### FAQ Page:
- Frequently asked questions in accordion format
- Categories: Orders, Shipping, Returns, Products, Payments
- Search FAQs functionality

### 8. PAYMENT INTEGRATION
- Razorpay payment gateway integration
- Support for cards, UPI, net banking, wallets
- Test mode for development
- Payment success/failure handling
- Order creation only after successful payment
- Payment verification and security

### 9. SHIPPING & TAX CALCULATION
- Automatic tax calculation (18% GST on subtotal)
- Shipping cost:
  - Free for orders above ₹500
  - ₹50 flat rate for orders below ₹500
- Display breakdown clearly in cart and checkout

### 10. ADDITIONAL FEATURES

#### Search Functionality:
- Global search bar in header
- Search products by name, description, category
- Autocomplete suggestions
- Recent searches (optional)

#### Wishlist:
- Heart icon on product cards
- Save unlimited products
- Persistent across sessions
- Quick view from wishlist page
- Move to cart from wishlist

#### Customer Support:
- Contact form submissions saved in database
- Admin can view and respond to queries
- Status tracking (new, in progress, resolved)

#### SEO & Performance:
- Dynamic meta tags for all pages
- Open Graph tags for social sharing
- Sitemap generation
- Robots.txt file
- Fast loading times
- Mobile-responsive design
- Lazy loading for images

#### Security:
- Secure authentication (bcrypt password hashing)
- HTTPS only
- SQL injection prevention
- XSS protection
- CSRF protection
- Input validation and sanitization
- Environment variables for sensitive data

#### Responsive Design:
- Mobile-first approach
- Works perfectly on all devices (mobile, tablet, desktop)
- Touch-friendly interfaces
- Hamburger menu on mobile

### 11. NOTIFICATIONS & FEEDBACK
- Toast notifications for user actions (added to cart, removed from wishlist, order placed, etc.)
- Loading states for async operations
- Error messages for form validation
- Success messages for completed actions

## DATABASE REQUIREMENTS

Create these tables in your database:

1. **users/profiles**: Store user account information
2. **categories**: Product categories with hierarchical structure
3. **products**: Product details (name, description, price, stock, etc.)
4. **product_images**: Multiple images per product
5. **product_variants**: Size, color, or other variations
6. **product_specifications**: Technical specs or ingredients
7. **addresses**: User shipping addresses
8. **orders**: Order information with status tracking
9. **order_items**: Individual items in each order
10. **cart_items**: Shopping cart (persisted for logged-in users)
11. **wishlist_items**: Saved products
12. **reviews**: Product reviews and ratings
13. **blog_posts**: Blog content (if implementing blog)
14. **customer_queries**: Contact form submissions

## SUCCESS CRITERIA

The platform is complete when:
1. Users can browse products, add to cart, checkout, and pay successfully
2. Admins can manage all products, orders, and content through the dashboard
3. The design is clean, modern, premium with black & white primary theme
4. All pages are fully responsive
5. Payment integration works in test mode
6. Users can track their orders
7. Product reviews system is functional
8. Search and filters work correctly
9. The site is secure and performant
10. All features are thoroughly tested

## BRAND IDENTITY
- **Brand Name**: OT-OnlyThing
- **Tagline**: "The Future of Skincare is Intelligent" or "Science-Backed, Personalized Skincare"
- **Target Audience**: Health-conscious consumers seeking premium, science-backed skincare
- **Brand Values**: Intelligence, Science, Quality, Personalization, Wellness
- **Tone**: Professional, trustworthy, modern, approachable

## EXAMPLE USER FLOWS

**New Customer Journey:**
1. Lands on homepage → sees hero and featured products
2. Clicks "Shop Now" → browses products with filters
3. Clicks product → views details, reviews
4. Adds to cart → sees toast notification
5. Continues shopping or goes to cart
6. Proceeds to checkout → creates account or logs in
7. Fills shipping address → reviews order
8. Pays via Razorpay → sees confirmation page
9. Receives order confirmation email
10. Tracks order status in account page

**Admin Journey:**
1. Logs into admin dashboard
2. Sees overview stats (orders, products, queries)
3. Clicks "Add Product" → fills form with details and images
4. Product appears in catalog
5. Customer places order → admin sees it in orders list
6. Admin updates order status to "Shipped" with tracking number
7. Customer sees updated status in their account

## IMPORTANT NOTES

1. **Design Balance**: While black and white is the primary theme, use accent colors strategically to guide users (bright CTAs, status colors, highlights) - don't make it boring!

2. **User Experience**: Prioritize smooth, intuitive navigation. Every action should feel instant with proper loading states.

3. **Mobile-First**: Most users will shop on mobile. Test thoroughly on small screens.

4. **Performance**: Optimize images, lazy load where appropriate, minimize bundle size.

5. **Trust Signals**: Include security badges, customer reviews, trust indicators throughout the site.

6. **Content**: Use placeholder content where needed but make it realistic and professional.

7. **Testing**: Test the payment flow thoroughly in sandbox/test mode before going live.

8. **Scalability**: Structure the code so it's easy to add more features later (wishlists, loyalty points, referral system, etc.).

## DELIVERABLES EXPECTED

1. Fully functional e-commerce website
2. Working admin dashboard
3. Integrated payment system (test mode)
4. Responsive design on all devices
5. User authentication system
6. Order management system
7. Product catalog with search and filters
8. Shopping cart and checkout flow
9. Customer account pages
10. Contact form and customer query management

---

BUILD THIS PLATFORM AS A MODERN, PREMIUM, FULLY-FUNCTIONAL E-COMMERCE SOLUTION WITH EXCELLENT UX/UI AND ROBUST FUNCTIONALITY.
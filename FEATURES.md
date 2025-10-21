# Features Documentation

Complete feature breakdown of the Supreme Temple Jewellery Tracker.

## 🎯 Core Features

### 1. Authentication System

#### Mobile-Based Login
- **Simple Credentials**: Users log in with mobile number as username and password
- **Session Management**: Auto-logout after 30 minutes of inactivity
- **Role-Based Access**: Separate portals for customers and admin
- **Secure Storage**: Credentials stored in localStorage with activity tracking

#### Login Pages
- **Customer Login** (`/login`): Clean, gold-themed interface
- **Admin Login** (`/admin/login`): Dark-themed admin portal
- **Auto-Redirect**: Redirects based on user role

---

### 2. Customer Dashboard

#### Order Overview Card
- **Order Details**: Product name, Order ID, status badge
- **Visual Progress**: 5-stage progress bar with animations
- **Stage Indicators**: 
  - ✅ Completed (green checkmark)
  - 🔵 In Progress (pulsing blue dot)
  - ⚪ Pending (gray circle)

#### Process Stages
Each of the 5 stages displays:
1. **Design Phase** - Initial design and blueprint
2. **Casting Phase** - Metal casting
3. **Polishing Phase** - Surface refinement
4. **Stone Setting** - Gem placement
5. **Final Delivery** - Quality check and packaging

#### Smart Photo Visibility
Intelligent photo display logic:
- Current stage photos always visible
- Previous stage photos visible while next stage is in progress
- Photos automatically hide when next stage completes
- Example: Stage 3 in progress → Stage 2 photos visible
- Example: Stage 3 completed → Stage 2 photos hidden

#### Advance Bills Section
- **Bill Display**: List of uploaded payment receipts
- **File Types**: PDF and image support
- **Download Links**: Direct access to bills
- **Upload Date**: Shows when bill was added

#### Courier Tracking
- **Tracking ID**: Display courier tracking number
- **Direct Link**: "Track Package" button opens courier website
- **Conditional Display**: Only shows when courier details are added

#### Real-Time Chat
- **Live Messaging**: Instant communication with admin
- **Unread Badges**: Shows count of unread messages
- **File Attachments**: Send and receive images/PDFs
- **Timestamps**: Message time display
- **Floating Button**: Accessible from anywhere on dashboard
- **Slide-Up Panel**: Smooth animation for chat window

---

### 3. Admin Dashboard

#### Statistics Overview
Three key metrics cards:
- **Total Orders**: All orders in system
- **Active Orders**: Currently in progress
- **Total Customers**: Registered users

#### Order Management Table
- **Columns**: Order ID, Customer, Product, Stage, Status, Actions
- **Search**: Filter by name, order ID, or product
- **Status Filter**: All, Active, Completed, Cancelled
- **Quick Actions**: 
  - Edit order (pencil icon)
  - Chat with customer (message icon)

#### Dark Mode
- **Toggle Switch**: Sun/Moon icon in header
- **Persistent**: Saves preference
- **Full Coverage**: All components adapt to dark theme
- **Color-Coded Status**: Clear indicators in both modes

---

### 4. Order Management (Admin)

#### Stage Control
- **Dropdown Selector**: Choose current stage (1-5)
- **Auto-Status Update**: Updates all process statuses
- **Visual Feedback**: Immediate UI updates

#### Photo Upload
- **Per-Stage Upload**: Individual photos for each stage
- **Drag & Drop**: Easy file selection
- **Preview**: See uploaded photos immediately
- **Replace**: Update photos anytime
- **Storage**: Supabase storage integration

#### Courier Management
- **Tracking ID Input**: Enter courier tracking number
- **Link Input**: Add courier website URL
- **Validation**: Ensures proper URL format
- **Customer Notification**: Updates visible to customer instantly

#### Bill Upload
- **Multiple Bills**: Upload multiple advance payment receipts
- **File Types**: PDF and images supported
- **Public Access**: Customers can download bills
- **Organized Storage**: Stored in Supabase storage

---

### 5. User Management (Admin)

#### Add New User
- **Customer Details**: Name and mobile number
- **Password Setup**: Custom or default to mobile number
- **Order Creation**: Automatically creates first order
- **Process Initialization**: Sets up all 5 stages
- **Validation**: Checks for duplicate mobile numbers

#### User List
- **All Customers**: View all registered users
- **Contact Info**: Name and mobile number
- **Order Count**: See orders per customer
- **Quick Access**: Jump to customer's orders

---

### 6. Real-Time Chat System

#### Customer Chat
- **Floating Button**: Always accessible chat icon
- **Unread Counter**: Red badge with message count
- **Slide-Up Panel**: Smooth animation
- **Message Bubbles**: 
  - Gold bubbles for customer messages
  - Gray bubbles for admin messages
- **Timestamps**: Time display on each message
- **File Sharing**: Attach images and PDFs
- **Auto-Scroll**: Scrolls to latest message
- **Read Receipts**: Marks messages as read

#### Admin Chat
- **Full-Screen Interface**: Dedicated chat page
- **Customer Info**: Name and mobile in header
- **Message History**: All past conversations
- **File Attachments**: Send documents and images
- **Real-Time Updates**: Instant message delivery
- **Back Navigation**: Return to dashboard easily

#### Real-Time Features
- **Supabase Realtime**: WebSocket connections
- **Instant Delivery**: No page refresh needed
- **Typing Indicators**: See when messages arrive
- **Offline Queue**: Messages sent when reconnected

---

### 7. Responsive Design

#### Mobile (< 768px)
- **Single Column**: Stacked layout
- **Touch-Friendly**: Large buttons and inputs
- **Drawer Chat**: Bottom slide-up chat panel
- **Hamburger Menu**: Compact navigation
- **Optimized Images**: Smaller sizes for mobile

#### Tablet (768px - 1024px)
- **Two Columns**: Side-by-side cards
- **Flexible Grid**: Adapts to screen size
- **Touch & Click**: Works with both inputs
- **Readable Text**: Optimized font sizes

#### Desktop (> 1024px)
- **Multi-Column**: Full grid layout
- **Hover Effects**: Interactive elements
- **Keyboard Shortcuts**: Enter to send messages
- **Large Previews**: Full-size images

---

### 8. Animations & Transitions

#### Framer Motion Animations
- **Page Transitions**: Smooth fade-in on load
- **Card Animations**: Staggered appearance
- **Progress Bar**: Animated width changes
- **Button Hover**: Scale and shadow effects
- **Chat Bubbles**: Slide-in animations
- **Modal Dialogs**: Fade and scale

#### CSS Transitions
- **Color Changes**: Smooth hover states
- **Border Effects**: Focus ring animations
- **Shadow Growth**: Elevation on hover
- **Opacity Fades**: Subtle state changes

---

### 9. Design System

#### Color Palette
- **Primary Gold**: `#D4AF37` - Main brand color
- **Dark Gold**: `#B8860B` - Accents and hover states
- **Cream**: `#FFF8DC` - Background tint
- **White**: `#FFFFFF` - Card backgrounds

#### Typography
- **Font Family**: Georgia serif for elegance
- **Headings**: Bold, temple-gold color
- **Body Text**: Gray-800 for readability
- **Labels**: Semibold, smaller size

#### Components
- **temple-card**: Rounded cards with gold borders
- **temple-button**: Gradient gold buttons
- **temple-input**: Gold-focused input fields
- **Stage Badges**: Color-coded status indicators

---

### 10. Data Management

#### Database Tables
- **users**: Customer and admin accounts
- **orders**: Order information and tracking
- **process_updates**: Stage-wise progress
- **bills**: Payment receipts
- **messages**: Chat conversations

#### Storage Buckets
- **process-photos**: Stage progress images
- **bills**: Payment documents
- **attachments**: Chat files

#### Real-Time Subscriptions
- **Orders**: Live order updates
- **Messages**: Instant chat delivery
- **Process Updates**: Stage changes

---

### 11. Security Features

#### Row Level Security (RLS)
- **User Isolation**: Users see only their data
- **Admin Access**: Admins see all data
- **Secure Queries**: Database-level protection

#### Session Management
- **Activity Tracking**: Monitors user activity
- **Auto Logout**: 30-minute timeout
- **Secure Storage**: LocalStorage with validation

#### File Upload Security
- **Type Validation**: Only allowed file types
- **Size Limits**: Prevents large uploads
- **Public Buckets**: Controlled access

---

### 12. Performance Optimizations

#### Image Optimization
- **Next.js Image**: Automatic optimization
- **Lazy Loading**: Load images on scroll
- **Responsive Sizes**: Different sizes per device
- **WebP Format**: Modern image format

#### Code Splitting
- **Route-Based**: Separate bundles per page
- **Component Lazy Load**: Load on demand
- **Tree Shaking**: Remove unused code

#### Caching
- **Static Generation**: Pre-render pages
- **API Caching**: Reduce database calls
- **Image Caching**: Browser caching headers

---

### 13. Accessibility

#### Keyboard Navigation
- **Tab Order**: Logical focus flow
- **Enter to Submit**: Forms and messages
- **Escape to Close**: Modals and panels

#### Screen Reader Support
- **Alt Text**: All images described
- **ARIA Labels**: Interactive elements
- **Semantic HTML**: Proper heading structure

#### Visual Accessibility
- **High Contrast**: Gold on white
- **Large Touch Targets**: 44px minimum
- **Clear Focus States**: Visible outlines

---

### 14. Error Handling

#### User Feedback
- **Error Messages**: Clear, actionable errors
- **Success Alerts**: Confirmation messages
- **Loading States**: Spinners and skeletons
- **Empty States**: Helpful placeholders

#### Graceful Degradation
- **Offline Support**: Queue messages
- **Fallback UI**: Show cached data
- **Retry Logic**: Auto-retry failed requests

---

### 15. Future-Ready Features

#### Planned Enhancements
- **WhatsApp Notifications**: Order updates via WhatsApp
- **SMS Alerts**: Text message notifications
- **Email Reports**: Weekly order summaries
- **Rating System**: Customer feedback
- **Time Predictions**: Estimated completion
- **Multi-Language**: i18n support
- **Payment Gateway**: Online payments
- **Analytics Dashboard**: Order insights

---

## 🎨 UI/UX Highlights

### Visual Design
- **Luxury Feel**: Gold and white theme
- **Temple Motifs**: Jewelry-inspired icons
- **Elegant Typography**: Serif fonts
- **Smooth Animations**: Framer Motion
- **Consistent Spacing**: 4px grid system

### User Experience
- **Intuitive Navigation**: Clear paths
- **Minimal Clicks**: Quick actions
- **Visual Feedback**: Immediate responses
- **Mobile-First**: Touch-optimized
- **Fast Loading**: Optimized assets

---

**Built for Excellence** ✨

Every feature designed with care for the ultimate temple jewellery tracking experience.

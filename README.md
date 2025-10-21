# Supreme Temple Jewellery Tracker

A full-stack responsive web application for tracking custom-made temple jewellery orders. Built with **Next.js 14**, **React**, **Tailwind CSS**, and **MongoDB**.

## 🎯 Features

### Customer Features
- **Mobile-based Authentication** - Login using mobile number
- **Real-time Order Tracking** - Track 5 production stages with live updates
- **Progress Visualization** - Beautiful progress bar showing current stage
- **Photo Gallery** - View stage-wise photos with smart visibility rules
- **Advance Bill Access** - Download payment receipts and invoices
- **Courier Tracking** - Track package delivery with courier links
- **Live Chat** - Real-time messaging with admin support
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop

### Admin Features
- **Dashboard Overview** - View all orders and customer statistics
- **Order Management** - Update stages, upload photos, manage progress
- **User Management** - Add new customers and create orders
- **Bill Upload** - Upload advance payment bills (PDF/Images)
- **Courier Management** - Add tracking IDs and links
- **Real-time Chat** - Communicate with customers
- **Dark Mode** - Toggle between light and dark themes
- **Search & Filter** - Find orders by name, ID, or status

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: MongoDB with Mongoose
- **Real-time**: Polling (Socket.io optional)
- **Storage**: Local file system
- **Authentication**: Custom mobile-based auth with API routes

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB (local) or MongoDB Atlas account (free tier)
- Git

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd sts
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up MongoDB

1. Install and start MongoDB locally, OR
2. Create a free MongoDB Atlas cluster at [mongodb.com](https://mongodb.com)
3. Get your MongoDB connection string

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
```

### 5. Set Up Database

The application will automatically create MongoDB collections when you first run it. No manual setup required!

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
sts/
├── app/
│   ├── admin/              # Admin panel pages
│   │   ├── add-user/       # Add new user page
│   │   ├── chat/[userId]/  # Admin chat with customer
│   │   ├── login/          # Admin login page
│   │   ├── orders/[id]/    # Order management page
│   │   └── page.tsx        # Admin dashboard
│   ├── dashboard/          # Customer dashboard
│   ├── login/              # Customer login page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page (redirects)
├── components/
│   ├── ChatBox.tsx         # Real-time chat component
│   ├── ProgressBar.tsx     # Order progress visualization
│   └── StageCard.tsx       # Process stage card
├── lib/
│   ├── auth.ts             # Authentication utilities
│   ├── constants.ts        # App constants and helpers
│   ├── mongodb.ts          # MongoDB connection handler
│   ├── models.ts           # Mongoose schemas and types
│   └── types.ts            # TypeScript type definitions and API helpers
├── public/                 # Static assets
├── .env.local.example      # Environment variables template
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json            # Dependencies
```

## 🎨 Design System

### Color Palette
- **Primary Gold**: `#D4AF37` (temple-gold)
- **Dark Gold**: `#B8860B` (temple-darkGold)
- **Cream**: `#FFF8DC` (temple-cream)
- **White**: `#FFFFFF`

### Custom CSS Classes
- `temple-card` - Card with gold border and shadow
- `temple-button` - Primary gold gradient button
- `temple-button-secondary` - Outlined gold button
- `temple-input` - Input field with gold focus
- `chat-bubble-user` - User message bubble
- `chat-bubble-admin` - Admin message bubble

## 📱 Usage Guide

### For Customers

1. **Login**: Use your mobile number and password provided by admin
2. **View Order**: See your order details and current stage
3. **Track Progress**: Monitor the 5 production stages
4. **View Photos**: See stage-wise progress photos (with smart visibility)
5. **Download Bills**: Access advance payment receipts
6. **Track Delivery**: Use courier tracking link when available
7. **Chat**: Message admin for queries or updates

### For Admin

1. **Login**: Use admin credentials at `/admin/login`
2. **Dashboard**: View all orders and statistics
3. **Add User**: Create new customer with order
4. **Manage Order**: 
   - Update current stage
   - Upload stage photos
   - Add courier details
   - Upload bills
5. **Chat**: Communicate with customers
6. **Toggle Dark Mode**: Switch themes for comfort

## 🔐 Default Credentials

After setting up the database, create an admin user:

```sql
INSERT INTO users (name, mobile_number, password, role)
VALUES ('Admin', '9999999999', '9999999999', 'admin');
```

**Admin Login:**
- Mobile: `9999999999`
- Password: `9999999999`

## 📊 Database Schema

### MongoDB Collections

1. **users** - Customer and admin accounts
2. **orders** - Order information and status
3. **processupdates** - Stage-wise progress tracking
4. **bills** - Advance payment bills
5. **messages** - Chat messages

### File Storage

Files are stored locally in:
1. **public/uploads/process-photos** - Stage progress photos
2. **public/uploads/bills** - Payment receipts and invoices
3. **public/uploads/attachments** - Chat attachments

## 🔄 Photo Visibility Logic

The app implements smart photo visibility:

- When **Process N is in progress** → Process N-1 photos are **visible**
- Once **Process N is completed** → Process N-1 photos **disappear**
- Current and future stage photos are always visible if uploaded

Example:
- Stage 3 in progress → Stage 2 photos visible
- Stage 3 completed → Stage 2 photos hidden

## 🔄 Real-time Updates

The application uses **polling** for updates (checks every 5 seconds). For true real-time with WebSockets, you can optionally implement Socket.io. See `MIGRATION_GUIDE.md` for details.

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Deploy to Netlify

1. Push your code to GitHub
2. Import project in [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables
6. Deploy

## 🔧 Customization

### Change Color Theme

Edit `tailwind.config.js`:

```js
colors: {
  temple: {
    gold: '#YOUR_COLOR',
    darkGold: '#YOUR_COLOR',
    cream: '#YOUR_COLOR',
  }
}
```

### Modify Process Stages

Edit `lib/constants.ts`:

```ts
export const PROCESS_STAGES = [
  { id: 1, name: 'Your Stage', description: 'Description' },
  // Add more stages
];
```

### Update Session Timeout

Edit `lib/auth.ts`:

```ts
// Change 30 minutes to your desired duration
if (diff > 30 * 60 * 1000) {
  logout();
}
```

## 🐛 Troubleshooting

### Images not loading
- Check file paths in MongoDB database
- Verify image files exist in public/uploads directories
- Ensure proper file permissions

### Real-time not working
- Application uses polling (checks every 5 seconds)
- Check network connectivity
- Verify MongoDB connection is stable

### Authentication issues
- Clear browser localStorage
- Check user credentials in database
- Verify session timeout settings

## 📝 Future Enhancements

- [ ] WhatsApp/SMS notifications
- [ ] User ratings and feedback
- [ ] Completion time predictions
- [ ] Multiple orders per user
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Export order reports
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 💬 Support

For issues and questions:
- Create an issue on GitHub
- Contact: your-email@example.com

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the flexible database
- Mongoose for elegant MongoDB object modeling
- Tailwind CSS for styling utilities
- Framer Motion for animations
- Lucide for beautiful icons

---

**Built with ❤️ for Supreme Temple Jewellery**

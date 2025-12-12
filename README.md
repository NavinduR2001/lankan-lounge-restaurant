# Lankan Lounge Restaurant 🍽️
## Smart Takeaway Ordering and Management System

A full-stack web application for "Lankan Lounge" — an authentic Sri Lankan restaurant offering online food ordering, scheduled pickup and comprehensive restaurant management.

![Project Banner](https://img.shields.io/badge/Stack-MERN-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Status](https://img.shields.io/badge/Status-Active-success)

## 🌟 Features

### Customer Features
- **User Authentication**: Secure registration and login system with JWT tokens
- **Menu Browsing**: Explore categorized menu items (Sri Lankan, Indian, Chinese, Pizza, etc.)
- **Shopping Cart**: Add/remove items with real-time cart management
- **Order Management**: Place orders with pickup time scheduling
- **Order History**: Track past orders and order status
- **PDF Receipts**: Download order confirmations as PDF tokens
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Admin Dashboard**: Comprehensive management interface
- **Order Management**: View, accept, reject, and track orders
- **Menu Management**: Add, edit, and remove menu items with image uploads
- **Sales Analytics**: Visual charts for sales and item performance
- **Order History**: Complete order tracking and history
- **Restaurant Settings**: Manage restaurant information and settings

### Technical Features
- **Real-time Updates**: Dynamic order status updates
- **File Upload**: Image upload for menu items
- **Data Validation**: Client and server-side validation
- **Secure Authentication**: JWT-based authentication system
- **Responsive Charts**: Interactive sales and analytics charts

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface library
- **React Router** - Client-side routing
- **Chart.js** - Data visualization
- **jsPDF** - PDF generation
- **CSS3** - Styling and animations
- **Vite** - Build tool and development server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Multer** - File upload middleware
- **bcrypt** - Password hashing

## 📁 Project Structure

```
gami-gedara-restaurant/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── navbar/
│   │   │   ├── footer/
│   │   │   ├── header/
│   │   │   ├── admin-navbar/
│   │   │   ├── chart/
│   │   │   └── item-summary/
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   ├── menu/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── admin-dashboard/
│   │   │   ├── about-us/
│   │   │   └── contact-us/
│   │   ├── services/
│   │   └── assets/
│   └── package.json
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── utils/
│   ├── models/
│   └── uploads/
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gami-gedara-restaurant.git
   cd gami-gedara-restaurant
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/gami-gedara
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   # Server runs on http://localhost:5000
   ```

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   # Application runs on http://localhost:5173
   ```

3. **Create Admin Account**
   ```bash
   cd backend
   node seedAdmin.js
   ```

## 📱 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/admin-login` - Admin login

### Menu Management
- `GET /api/items` - Get all menu items
- `GET /api/items/category/:category` - Get items by category
- `POST /api/items` - Add new menu item (Admin)
- `DELETE /api/items/:id` - Remove menu item (Admin)

### Order Management
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `GET /api/order-history` - Get order history

## 🎨 Screenshots

### Customer Interface
- **Home Page**: Showcases trending dishes and restaurant information
- **Menu Page**: Categorized menu with search and filtering
- **Cart Page**: Shopping cart with quantity management
- **Checkout**: Order confirmation with PDF receipt generation

### Admin Interface
- **Dashboard**: Order management and analytics
- **Menu Management**: Add/remove menu items with image upload
- **Sales Reports**: Interactive charts and statistics
- **Order History**: Complete order tracking system

## 🔧 Configuration

### Database Models
- **User Model**: Customer information and authentication
- **Admin Model**: Administrator accounts
- **Item Model**: Menu items with categories and pricing
- **Order Model**: Active orders with status tracking
- **Order History Model**: Completed order records

### File Upload
- Images are stored in the `backend/uploads/` directory
- Supported formats: JPG, PNG, JPEG
- Maximum file size: 5MB

## 🛡️ Security Features

- **Password Hashing**: bcrypt encryption for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Client and server-side data validation
- **File Upload Security**: Restricted file types and size limits
- **CORS Configuration**: Proper cross-origin resource sharing setup

## 📊 Features in Detail

### Order Management System
- Real-time order tracking
- Order status updates (Pending → Accepted → Ready → Completed)
- Automatic order history archiving
- PDF receipt generation with order tokens

### Analytics Dashboard
- Sales summary with date filtering
- Item performance tracking
- Category-wise sales analysis
- Interactive charts using Chart.js

### Menu Management
- Category-based organization
- Image upload for menu items
- Trending items feature
- Real-time inventory management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development**: React.js, CSS3, Chart.js
- **Backend Development**: Node.js, Express.js, MongoDB
- **Database Design**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based security system

## 📞 Contact
- **Project Repository**: [GitHub Link](https://github.com/yourusername/gami-gedara-restaurant)

## 🙏 Acknowledgments

- Sri Lankan Cultural Restaurant inspiration
- MERN Stack community
- React community for excellent documentation

---

**Made with ❤️ for authentic Sri Lankan cuisine lovers**

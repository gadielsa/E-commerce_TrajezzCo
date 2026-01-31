const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Coupon = require('../models/Coupon');

// Get admin dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalCoupons = await Coupon.countDocuments();

    // Revenue calculation
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Orders by status
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    const canceledOrders = await Order.countDocuments({ status: 'canceled' });

    // Monthly sales (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const monthlySales = await Order.find({ createdAt: { $gte: thirtyDaysAgo } });
    const monthlyRevenue = monthlySales.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalCoupons,
        totalRevenue,
        monthlyRevenue,
        pendingOrders,
        completedOrders,
        canceledOrders,
        stats: {
          products: totalProducts,
          orders: totalOrders,
          users: totalUsers,
          coupons: totalCoupons,
          revenue: totalRevenue
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders (admin view)
exports.getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate('items.product');

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get product analytics
exports.getProductAnalytics = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const products = await Product.find();
    
    // Get best selling products
    const orders = await Order.find().populate('items.product');
    const productSales = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.product._id]) {
          productSales[item.product._id] = {
            name: item.product.name,
            sold: 0,
            revenue: 0
          };
        }
        productSales[item.product._id].sold += item.quantity;
        productSales[item.product._id].revenue += item.price * item.quantity;
      });
    });

    const bestSellers = Object.values(productSales)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    res.json({
      success: true,
      data: {
        totalProducts: products.length,
        bestSellers,
        products
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user analytics
exports.getUserAnalytics = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Users with orders
    const usersWithOrders = await Order.distinct('user');
    
    // Average order value
    const orders = await Order.find();
    const averageOrderValue = orders.length > 0 
      ? orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0) / orders.length
      : 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers: usersWithOrders.length,
        totalOrders,
        averageOrderValue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get recent orders
exports.getRecentOrders = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const limit = req.query.limit || 10;
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get pending orders
exports.getPendingOrders = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const orders = await Order.find({ status: 'pending' })
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export admin data
exports.exportData = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const { type } = req.query; // 'orders', 'products', 'users'

    let data;
    switch (type) {
      case 'orders':
        data = await Order.find().populate('user').populate('items.product');
        break;
      case 'products':
        data = await Product.find();
        break;
      case 'users':
        data = await User.find().select('-password');
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid export type' });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, firstName, lastName, phone, address, city, state, zipCode, country } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (city) updateData.city = city;
    if (state) updateData.state = state;
    if (zipCode) updateData.zipCode = zipCode;
    if (country) updateData.country = country;
    
    updateData.updatedAt = Date.now();

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select('-password');

    res.json({ success: true, user, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add address
exports.addAddress = async (req, res) => {
  try {
    const { street, number, complement, city, state, zipCode, country = 'Brasil', isDefault = false } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: {
          addresses: {
            street,
            number,
            complement,
            city,
            state,
            zipCode,
            country,
            isDefault
          }
        }
      },
      { new: true }
    ).select('-password');

    res.json({ success: true, user, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { street, number, complement, city, state, zipCode, isDefault } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          'addresses.$[elem]': {
            street,
            number,
            complement,
            city,
            state,
            zipCode,
            country: 'Brasil',
            isDefault
          }
        }
      },
      {
        arrayFilters: [{ 'elem._id': addressId }],
        new: true
      }
    ).select('-password');

    res.json({ success: true, user, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    ).select('-password');

    res.json({ success: true, user, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user by ID (admin only)
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, role, status } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, role, status },
      { new: true }
    ).select('-password');

    res.json({ success: true, user, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await User.findByIdAndDelete(userId);

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

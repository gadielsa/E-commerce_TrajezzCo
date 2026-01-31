const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, phone, updatedAt: Date.now() },
      { new: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/address', auth, async (req, res) => {
  try {
    const { street, number, complement, city, state, zipCode } = req.body;

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
            country: 'Brasil'
          }
        }
      },
      { new: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/address/:addressId', auth, async (req, res) => {
  try {
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
        arrayFilters: [{ 'elem._id': req.params.addressId }],
        new: true
      }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/address/:addressId', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { addresses: { _id: req.params.addressId } } },
      { new: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const melhorEnvioService = require('../services/melhorEnvioService');
const auth = require('../middleware/auth');

router.get('/address/:cep', async (req, res) => {
  try {
    const result = await melhorEnvioService.getAddressByCEP(req.params.cep);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/calculate', auth, async (req, res) => {
  try {
    const { destinyZipCode, weight, width, height, length } = req.body;

    if (!destinyZipCode) {
      return res.status(400).json({ success: false, message: 'Destiny ZIP code is required' });
    }

    const result = await melhorEnvioService.calculateShipping(
      destinyZipCode,
      weight,
      width,
      height,
      length
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({ success: true, data: result.data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/track/:tracking', async (req, res) => {
  try {
    const result = await melhorEnvioService.trackShipment(req.params.tracking);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json({ success: true, data: result.tracking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

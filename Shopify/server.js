const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;

const SHOP = 'https://masonstones.com/'; 
const ACCESS_TOKEN = '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'; 
const METAFIELD_NAMESPACE = 'custom'; 
const METAFIELD_KEY = 'custom_image'; 

app.get('/fetch-image', async (req, res) => {
  const { order_id } = req.query;

  try {
    const orderResponse = await axios.get(`https://${SHOP}/admin/api/2024-04/orders/${order_id}/metafields.json`, {
      headers: {
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    const metafields = orderResponse.data.metafields;

    const imageMetafield = metafields.find(
      mf => mf.namespace === METAFIELD_NAMESPACE && mf.key === METAFIELD_KEY
    );

    if (imageMetafield) {
      res.json({ image_url: imageMetafield.value });
    } else {
      res.status(404).json({ error: 'Image metafield not found' });
    }
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong fetching the metafield' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const axios = require("axios");
const SteadfastConfig = require("../models/SteadfastConfigModel");

const configCache = {
  config: null,
  expiry: null,
};

const getSteadfastConfig = async () => {
  const now = new Date();

  if (configCache.config && configCache.expiry > now) {
    return configCache.config;
  }

  const config = await SteadfastConfig.findOne({ isActive: true });
  if (!config) {
    throw new Error("No active Steadfast config found in DB");
  }

  configCache.config = config;
  configCache.expiry = new Date(now.getTime() + 10 * 60 * 1000); // Cache for 10 minutes

  return config;
};

const createSteadfastOrderService = async (orderData) => {
  const config = await getSteadfastConfig();

  const {
    invoice,
    recipient_name,
    recipient_phone,
    recipient_address,
    cod_amount,
    note,
  } = orderData;

  const payload = {
    invoice,
    recipient_name,
    recipient_phone,
    recipient_address,
    cod_amount,
    note,
  };

  const response = await axios.post(
    `${config.baseUrl}/create_order`,
    payload,
    {
      headers: {
        "Api-Key": config.apiKey,
        "Secret-Key": config.secretKey,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

const getSteadfastOrderStatusByInvoiceService = async (invoiceId) => {
  const config = await getSteadfastConfig(); // This throws if no active config

  if (!config.baseUrl) {
    throw new Error("Steadfast API Base URL is not configured.");
  }
  if (!config.apiKey) {
    throw new Error("Steadfast API Key is not configured.");
  }
  if (!config.secretKey) {
    throw new Error("Steadfast API Secret Key is not configured.");
  }

  try {
    const response = await axios.get(
      `${config.baseUrl}/status_by_invoice/${invoiceId}`,
      {
        headers: {
          "Api-Key": config.apiKey,
          "Secret-Key": config.secretKey,
        },
      }
    );
    return response.data;
  } catch (error) {
    // Log the actual error response from the external API
    console.error("Error fetching Steadfast order status from external API:", error.response?.data || error.message);
    throw new Error(`Failed to fetch order status from Steadfast: ${error.response?.data?.message || error.message}`);
  }
};

module.exports = {
  createSteadfastOrderService,
  getSteadfastOrderStatusByInvoiceService,
};

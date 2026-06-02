// Flutterwave hosted payment link (merchant name hidden by overlay in iframe)
export const FLUTTERWAVE_PAYMENT_URL = "https://flutterwave.com/pay/gkgwbgpyjxqn";

export const CRYPTO_WALLETS = [
  { symbol: "BTC", name: "Bitcoin", address: "bc1q7gf2tjufxwlx0mj04n9jafa5gjcpznpgqstpcz", network: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum", address: "0x6bcdbad03e9f4d8cb6902ce604249303a3c22ce3", network: "ERC-20" },
  { symbol: "USDT", name: "Tether USD", address: "0x6bcdbad03e9f4d8cb6902ce604249303a3c22ce3", network: "ERC-20" },
  { symbol: "DOGE", name: "Dogecoin", address: "DNyjX3UgTkEpdTQQRWfMvax3KvTFVBoDzq", network: "Dogecoin" },
] as const;

export const BANK_DETAILS = {
  bankName: "MMDVM LLC",
  accountName: "MMDVM LLC",
  accountNumber: "875108498507",
  routingNumber: "125109019",
} as const;

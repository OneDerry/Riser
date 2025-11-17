// Paystack Payment Service
// This service handles Paystack payment initialization

export interface PaystackPaymentData {
  email: string;
  amount: number; // Amount in kobo (lowest currency unit)
  reference: string;
  metadata?: {
    [key: string]: any;
  };
  callback_url?: string;
}

export interface PaystackConfig {
  publicKey: string;
}

// Initialize Paystack payment
export const initializePaystackPayment = (
  data: PaystackPaymentData,
  config: PaystackConfig,
  onSuccess: (reference: string) => void,
  onClose: () => void
) => {
  // Wait for Paystack script to load
  if (!(window as any).PaystackPop) {
    console.error("Paystack script not loaded");
    onClose();
    return;
  }

  const handler = (window as any).PaystackPop.setup({
    key: config.publicKey,
    email: data.email,
    amount: data.amount,
    ref: data.reference,
    metadata: data.metadata || {},
    callback: (response: any) => {
      onSuccess(response.reference);
    },
    onClose: () => {
      onClose();
    },
  });

  handler.openIframe();
};

// Generate a unique reference for the payment
export const generatePaymentReference = (): string => {
  return `RISER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Convert amount to kobo (for Nigerian Naira)
export const convertToKobo = (amount: number): number => {
  return Math.round(amount * 100);
};


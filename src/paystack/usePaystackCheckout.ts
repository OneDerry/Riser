import { useCallback, useEffect, useMemo, useState } from "react";
import { usePaystackPayment } from "react-paystack";

import { v4 as uuidv4 } from "uuid";

import { convertToKobo } from "../app/services/paystackService";
export interface PaystackSuccessResponse {
  reference: string;
  status: string;
  message?: string;
  [key: string]: unknown;
}

interface PaystackCheckoutConfig {
  email: string;
  amount: number;
  metadata?: Record<string, string | number | undefined>;
  publicKey?: string;
  reference?: string;
}

type PaystackMetadata =
  | {
      custom_fields: {
        display_name: string;
        variable_name: string;
        value: string;
      }[];
    }
  | undefined;

const normalizeMetadata = (
  metadata?: Record<string, string | number | undefined>
): PaystackMetadata => {
  if (!metadata) {
    return undefined;
  }

  const customFields =
    Object.entries(metadata)
      .filter(([, value]) => value !== undefined && value !== "")
      .map(([key, value]) => ({
        display_name: key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()),
        variable_name: key,
        value: String(value),
      })) || [];

  if (customFields.length === 0) {
    return undefined;
  }

  return {
    custom_fields: customFields,
  };
};

export const usePaystackCheckout = ({
  email,
  amount,
  metadata,
  publicKey,
  reference: incomingReference,
}: PaystackCheckoutConfig) => {
  const [reference, setReference] = useState(
    incomingReference || `REF_${uuidv4()}`
  );

  useEffect(() => {
    if (incomingReference) {
      setReference(incomingReference);
    }
  }, [incomingReference]);

  const normalizedMetadata = useMemo(
    () => normalizeMetadata(metadata),
    [metadata]
  );

  const config = useMemo(
    () => ({
      reference,
      email,
      amount: convertToKobo(amount || 0),
      publicKey: publicKey || import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "",
      metadata: normalizedMetadata,
    }),
    [reference, email, amount, normalizedMetadata, publicKey]
  );

  const initializePayment = usePaystackPayment(config);

  const launchPayment = useCallback(
    (handlers: {
      onSuccess: (response: PaystackSuccessResponse) => void;
      onClose?: () => void;
    }) => {
      if (!config.publicKey) {
        console.error(
          "Paystack public key is missing. Please set VITE_PAYSTACK_PUBLIC_KEY."
        );
        handlers.onClose?.();
        return;
      }

      if (!config.email || !config.amount) {
        console.error(
          "Paystack configuration requires a valid email and amount."
        );
        handlers.onClose?.();
        return;
      }

      initializePayment({
        onSuccess: handlers.onSuccess,
        onClose: handlers.onClose,
      });
    },
    [initializePayment, config.publicKey, config.email, config.amount]
  );

  const regenerateReference = useCallback(() => {
    setReference(`REF_${uuidv4()}`);
  }, []);

  const isReady =
    Boolean(config.publicKey) && Boolean(config.email) && config.amount > 0;

  return {
    reference,
    regenerateReference,
    initializePayment: launchPayment,
    isReady,
    config,
  };
};

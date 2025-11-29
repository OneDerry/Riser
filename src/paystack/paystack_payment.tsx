import { toast } from "sonner";
import {
  usePaystackCheckout,
  type PaystackSuccessResponse,
} from "./use_paystack_checkout";

const PaystackPayment = () => {
  const { initializePayment, isReady } = usePaystackCheckout({
    email: "user@example.com",
    amount: 200,
  });

  const onSuccess = (response: PaystackSuccessResponse) => {
    const paymentReference = (response as { reference?: string }).reference;

    if (paymentReference) {
      toast.success(`Payment successful! Reference: ${paymentReference}`);
    } else {
      toast.success("Payment successful!");
    }
  };

  const onClose = () => {
    toast.success("Payment window closed. You can try again if you wish.");
  };

  return (
    <main className="h-screen w-full bg-slate-200 flex items-center justify-center">
      <div className="flex-col items-center justify-center space-y-4">
        <h1 className="text-xl font-semibold">Paystack Payment Example</h1>
        <button
          onClick={() => initializePayment({ onSuccess, onClose })}
          className="mx-auto rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          disabled={!isReady}
        >
          Pay Now
        </button>
      </div>
    </main>
  );
};

export default PaystackPayment;

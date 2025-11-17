# Payment Integration Setup Guide

This project integrates **Paystack** for payment processing and **SheetDB** for data storage.

## Prerequisites

1. **Paystack Account**: Sign up at [https://paystack.com](https://paystack.com)
2. **SheetDB Account**: Your SheetDB API endpoint is already configured: `https://sheetdb.io/api/v1/ll7yrru73p0vm`

## Setup Instructions

### 1. Paystack Configuration

1. Log in to your [Paystack Dashboard](https://dashboard.paystack.com)
2. Navigate to **Settings** → **Developer** → **API Keys & Webhooks**
3. Copy your **Public Key** (starts with `pk_test_` for test mode or `pk_live_` for live mode)
4. Create a `.env` file in the root directory of your project
5. Add your Paystack public key:

```env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
```

**Important**: 
- Use `pk_test_...` for development/testing
- Use `pk_live_...` for production
- Never commit your `.env` file to version control

### 2. SheetDB Configuration

Your SheetDB API URL is already configured in the code. The API endpoint is:
```
https://sheetdb.io/api/v1/ll7yrru73p0vm
```

Make sure your Google Sheet has the following columns:
- parentFirstName
- parentLastName
- parentEmail
- parentPhone
- studentFirstName
- studentLastName
- studentDob
- studentGender
- gradeLevel
- academicYear
- semester
- feeType
- paymentMethod
- amount
- paymentReference
- paymentStatus
- additionalInfo
- createdAt
- updatedAt

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Required
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here

# Optional (default is already set)
# VITE_SHEETDB_API_URL=https://sheetdb.io/api/v1/ll7yrru73p0vm
```

### 4. Running the Application

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Payment Flow

### Credit/Debit Card Payments
1. User fills out the enrollment form
2. Selects "Credit/Debit Card" as payment method
3. Clicks "Complete Payment"
4. Paystack payment popup opens
5. User completes payment
6. On success:
   - Payment reference is generated
   - Enrollment data is saved to SheetDB with status "completed"
   - Success message is displayed

### Bank Transfer Payments
1. User fills out the enrollment form
2. Selects "Bank Transfer" as payment method
3. Bank transfer instructions are displayed
4. User uploads payment receipt (optional)
5. Clicks "Complete Payment"
6. Enrollment data is saved to SheetDB with status "pending"
7. Success message is displayed with payment reference

## Testing

### Test Mode (Paystack)
- Use test cards from [Paystack Test Cards](https://paystack.com/docs/payments/test-payments)
- Example: `4084 0840 8408 4081` (CVV: 408, Expiry: any future date)

### Test Mode (SheetDB)
- Check your Google Sheet to verify data is being saved correctly
- Test both payment methods (credit card and bank transfer)

## Deployment (Vercel)

When deploying to Vercel:

1. Add environment variables in Vercel Dashboard:
   - Go to your project settings
   - Navigate to **Environment Variables**
   - Add `VITE_PAYSTACK_PUBLIC_KEY` with your production public key

2. For production, use:
   - `pk_live_...` for Paystack public key
   - Update SheetDB URL if needed (though the default should work)

## Troubleshooting

### Paystack not loading
- Ensure the Paystack script is loaded in `index.html`
- Check browser console for errors
- Verify your public key is correct

### Data not saving to SheetDB
- Verify your SheetDB API URL is correct
- Check that all required columns exist in your Google Sheet
- Check browser console for API errors

### Payment successful but data not saved
- Check browser console for errors
- Verify SheetDB API is accessible
- Check network tab for API call failures

## Security Notes

- Never expose your Paystack **Secret Key** in the frontend
- Only use **Public Key** in the frontend
- Validate all form data server-side (recommended for production)
- Use HTTPS in production
- Implement proper error handling and logging

## Support

For issues or questions:
- Paystack Documentation: [https://paystack.com/docs](https://paystack.com/docs)
- SheetDB Documentation: [https://sheetdb.io/documentation](https://sheetdb.io/documentation)


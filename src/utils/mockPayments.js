// utils/mockPayments.js
import { v4 as uuidv4 } from 'uuid';

// Payment status constants
export const PAYMENT_STATUS = {
  CREATED: "created", // Added 'created' status for the initial timeline event
  PENDING: "pending",
  SUCCEEDED: "succeeded", // Changed 'COMPLETED' to 'succeeded' to match your Timeline component
  FAILED: "failed",
  REFUNDED: "refunded",
  PARTIALLY_REFUNDED: "partially_refunded",
  DISPUTED: "disputed",
  VOIDED: "voided", // Added 'voided' and 'authorized' for more timeline events
  AUTHORIZED: "authorized",
  PAYMENT_METHOD_ADDED: "payment_method_added", // Added this to match your Timeline component
};

// Payment method constants
export const PAYMENT_METHODS = {
  CREDIT_CARD: "credit_card",
  PAYPAL: "paypal",
  BANK_TRANSFER: "bank_transfer",
  STRIPE: "stripe",
  RAZORPAY: "razorpay",
  CASH: "cash",
  CRYPTO: "crypto",
  OTHER: "other",
};

// Currencies
const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

// Customer names for more realistic data
const CUSTOMERS = [
  { id: 'CUST-1001', name: 'Acme Corporation', email: 'billing@acme.com' },
  { id: 'CUST-1002', name: 'Globex Inc', email: 'accounts@globex.com' },
  { id: 'CUST-1003', name: 'Soylent Corp', email: 'finance@soylent.net' },
  { id: 'CUST-1004', name: 'Initech LLC', email: 'payments@initech.com' },
  { id: 'CUST-1005', name: 'Umbrella Corp', email: 'ar@umbrella.org' },
  { id: 'CUST-1006', name: 'Wayne Enterprises', email: 'accounting@wayne.com' },
  { id: 'CUST-1007', name: 'Stark Industries', email: 'billing@stark.com' },
  { id: 'CUST-1008', name: 'Cyberdyne Systems', email: 'finance@cyberdyne.com' },
];

// Product/services for line items
const PRODUCTS = [
  { name: 'Web Design Package', price: 1200 },
  { name: 'SEO Services', price: 800 },
  { name: 'Hosting Plan', price: 50 },
  { name: 'Consulting Hour', price: 150 },
  { name: 'Software License', price: 299 },
  { name: 'Maintenance Contract', price: 400 },
  { name: 'Training Session', price: 250 },
  { name: 'API Access', price: 175 },
];

// Generate random date within last 90 days
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate random IP address
const randomIP = () => {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

// --- New Function to Generate Timeline Events ---
const generateTimelineEvents = (payment) => {
  const timeline = [];
  const initialDate = new Date(payment.date);

  // 1. Payment Created
  timeline.push({
    id: uuidv4(),
    description: `Payment initiated for ${payment.customer.name}`,
    timestamp: initialDate.toISOString(),
    status: PAYMENT_STATUS.CREATED,
  });

  // 2. Payment Method Added (Optional, typically very soon after creation)
  if (Math.random() > 0.3) { // 70% chance to have this step
    timeline.push({
      id: uuidv4(),
      description: `Payment method (${payment.method.replace('_', ' ')}) added`,
      timestamp: new Date(initialDate.getTime() + Math.random() * 60 * 1000).toISOString(), // Within 1 min
      status: PAYMENT_STATUS.PAYMENT_METHOD_ADDED,
    });
  }

  // Simulate pending/authorized state if applicable, before final status
  if (payment.status === PAYMENT_STATUS.PENDING || payment.status === PAYMENT_STATUS.SUCCEEDED || payment.status === PAYMENT_STATUS.REFUNDED || payment.status === PAYMENT_STATUS.PARTIALLY_REFUNDED || payment.status === PAYMENT_STATUS.DISPUTED || payment.status === PAYMENT_STATUS.VOIDED) {
    // If it's not a direct failure, it might go through pending/authorization
    if (Math.random() > 0.2) { // 80% chance for a pending/authorized state
        const pendingDate = new Date(initialDate.getTime() + Math.random() * 5 * 60 * 1000); // Within 5 mins
        timeline.push({
            id: uuidv4(),
            description: "Payment processing initiated",
            timestamp: pendingDate.toISOString(),
            status: PAYMENT_STATUS.PENDING,
        });

        if (Math.random() > 0.4 && payment.method === PAYMENT_METHODS.CREDIT_CARD) { // 60% chance for authorization for credit cards
            const authorizedDate = new Date(pendingDate.getTime() + Math.random() * 2 * 60 * 1000); // Shortly after pending
            timeline.push({
                id: uuidv4(),
                description: "Payment authorized",
                timestamp: authorizedDate.toISOString(),
                status: PAYMENT_STATUS.AUTHORIZED,
            });
        }
    }
  }


  // 3. Final Status Event (based on the payment's main status)
  const finalStatusDate = randomDate(new Date(initialDate.getTime() + 10 * 60 * 1000), new Date()); // At least 10 mins after initial
  switch (payment.status) {
    case PAYMENT_STATUS.SUCCEEDED:
      timeline.push({
        id: uuidv4(),
        description: `Payment successfully captured for ${payment.amount} ${payment.currency}`,
        timestamp: finalStatusDate.toISOString(),
        status: PAYMENT_STATUS.SUCCEEDED,
        amount: payment.amount,
        currency: payment.currency,
      });
      break;
    case PAYMENT_STATUS.FAILED:
      timeline.push({
        id: uuidv4(),
        description: "Payment failed",
        timestamp: finalStatusDate.toISOString(),
        status: PAYMENT_STATUS.FAILED,
        reason: ['card_declined', 'insufficient_funds', 'network_error', 'fraud_detected'][Math.floor(Math.random() * 4)],
        notes: "Please contact your bank or try a different payment method."
      });
      break;
    case PAYMENT_STATUS.REFUNDED:
      timeline.push({
        id: uuidv4(),
        description: `Full refund issued for ${payment.amount} ${payment.currency}`,
        timestamp: finalStatusDate.toISOString(),
        status: PAYMENT_STATUS.REFUNDED,
        amount: payment.amount,
        currency: payment.currency,
        reason: payment.refunds[0]?.reason,
      });
      break;
    case PAYMENT_STATUS.PARTIALLY_REFUNDED:
      const refundedAmount = payment.refunds[0]?.amount;
      timeline.push({
        id: uuidv4(),
        description: `Partial refund issued for ${refundedAmount} ${payment.currency}`,
        timestamp: finalStatusDate.toISOString(),
        status: PAYMENT_STATUS.PARTIALLY_REFUNDED,
        amount: refundedAmount,
        currency: payment.currency,
        reason: payment.refunds[0]?.reason,
      });
      break;
    case PAYMENT_STATUS.DISPUTED:
      timeline.push({
        id: uuidv4(),
        description: "Payment disputed by customer",
        timestamp: finalStatusDate.toISOString(),
        status: PAYMENT_STATUS.DISPUTED,
        reason: "Customer reported an unrecognized transaction."
      });
      break;
    case PAYMENT_STATUS.VOIDED:
        timeline.push({
            id: uuidv4(),
            description: "Payment voided before capture",
            timestamp: finalStatusDate.toISOString(),
            status: PAYMENT_STATUS.VOIDED,
            reason: "Order cancelled by customer."
        });
        break;
    case PAYMENT_STATUS.CANCELLED:
        timeline.push({
            id: uuidv4(),
            description: "Payment cancelled by user",
            timestamp: finalStatusDate.toISOString(),
            status: PAYMENT_STATUS.CANCELLED,
            reason: "User abandoned checkout."
        });
        break;
    case PAYMENT_STATUS.PENDING: // If the payment is still pending as its final state
        timeline.push({
            id: uuidv4(),
            description: "Payment remains pending processing",
            timestamp: finalStatusDate.toISOString(),
            status: PAYMENT_STATUS.PENDING,
            notes: "Awaiting confirmation from payment gateway."
        });
        break;
    default:
        // For any other status not explicitly handled, just add the final status
        timeline.push({
            id: uuidv4(),
            description: `Payment status: ${payment.status.replace('_', ' ')}`,
            timestamp: finalStatusDate.toISOString(),
            status: payment.status,
        });
  }

  // Sort timeline events by timestamp
  timeline.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return timeline;
};
// --- End of New Function ---

// Generate random payment data
export const generateMockPayments = (count = 50) => {
  const statuses = Object.values(PAYMENT_STATUS);
  const methods = Object.values(PAYMENT_METHODS);
  const payments = [];

  for (let i = 0; i < count; i++) {
    const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const method = methods[Math.floor(Math.random() * methods.length)];
    const currency = CURRENCIES[Math.floor(Math.random() * CURRENCIES.length)];
    const date = randomDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), new Date());
    const amount = parseFloat((50 + Math.random() * 3000).toFixed(2));
    const fee = parseFloat((amount * (0.01 + Math.random() * 0.04)).toFixed(2)); // 1-5% fee
    const netAmount = parseFloat((amount - fee).toFixed(2));

    // Generate 1-4 line items
    const itemCount = Math.floor(Math.random() * 4) + 1;
    const items = [];
    for (let j = 0; j < itemCount; j++) {
      const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      const quantity = Math.floor(Math.random() * 5) + 1;
      items.push({
        name: product.name,
        quantity,
        price: product.price,
        amount: quantity * product.price
      });
    }

    // Adjust amount to match sum of line items if status is completed
    const itemsAmount = items.reduce((sum, item) => sum + item.amount, 0);
    // Use SUCCEEDED to match the new constant
    const finalAmount = status === PAYMENT_STATUS.SUCCEEDED ? itemsAmount : amount;

    const payment = {
      id: `PAY-${1000 + i}`,
      customer,
      date: date.toISOString(),
      amount: finalAmount,
      fee: status === PAYMENT_STATUS.FAILED ? 0 : fee, // No fee for failed payments
      netAmount: status === PAYMENT_STATUS.FAILED ? 0 : netAmount,
      currency,
      status,
      method,
      invoiceId: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      items,
      metadata: {
        ip: randomIP(),
        device: Math.random() > 0.5 ? 'desktop' : 'mobile',
        userAgent: Math.random() > 0.5 ?
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' :
          'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        country: ['US', 'GB', 'DE', 'FR', 'CA', 'AU', 'JP', 'IN'][Math.floor(Math.random() * 8)]
      },
      gatewayId: method === PAYMENT_METHODS.STRIPE ? `ch_${uuidv4().substring(0, 24)}` :
        method === PAYMENT_METHODS.PAYPAL ? `PAYID-${uuidv4().substring(0, 17).toUpperCase()}` :
          method === PAYMENT_METHODS.CREDIT_CARD ? `auth_${uuidv4().substring(0, 16)}` : null,
      refunds: status === PAYMENT_STATUS.REFUNDED || status === PAYMENT_STATUS.PARTIALLY_REFUNDED ?
        [{
          id: `rf_${uuidv4().substring(0, 14)}`,
          amount: status === PAYMENT_STATUS.PARTIALLY_REFUNDED ?
            parseFloat((finalAmount * 0.5).toFixed(2)) : finalAmount,
          date: randomDate(date, new Date()).toISOString(),
          reason: ['duplicate', 'fraudulent', 'requested_by_customer', 'product_not_received'][Math.floor(Math.random() * 4)],
          processedBy: `user_${Math.floor(1000 + Math.random() * 9000)}`
        }] : []
    };

    // --- Add the timeline data ---
    payment.timeline = generateTimelineEvents(payment);
    // --- End of adding timeline data ---

    payments.push(payment);
  }

  return payments;
};

// Generate 50 mock payments by default
export const mockPayments = generateMockPayments(50);
import React, { useState } from 'react';
import axios from 'axios';

interface PaymentFormProps {
  projectId: string;
  amount: number;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ projectId, amount }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/payments/create', { projectId, amount, cardNumber, expiry, cvc });
      // Handle successful payment
    } catch (error) {
      // Handle payment error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        placeholder="Card Number"
        required
      />
      <input
        type="text"
        value={expiry}
        onChange={(e) => setExpiry(e.target.value)}
        placeholder="MM/YY"
        required
      />
      <input
        type="text"
        value={cvc}
        onChange={(e) => setCvc(e.target.value)}
        placeholder="CVC"
        required
      />
      <button type="submit">Pay ${amount}</button>
    </form>
  );
};

export default PaymentForm;
import { test, expect } from '@playwright/test';
import axios from 'axios';
const { InvoiceGenerator } = require('../playwrightHelpers');
const createInvoice = async () => {
  const randomNumber = Math.floor(Math.random() * 9999999999) + 1;
  const transactionId = `BK_${randomNumber}`;
  const url = 'https://api.uat.irembopay.com/payments/invoices';

  const requestBody = {
    transactionId: transactionId,
    paymentItems: [
      {
        code: 'RRA-f0394bd305',
        quantity: 5,
        unitAmount: 100.0,
      },
    ],
    paymentAccountIdentifier: 'GOR-0303',
    customer: {
      phoneNumber: '0787680429',
      email: 'payment.operations@irembo.com',
    },
  };

  const headers = {
    key: 'irembopay-secretkey',
    Authorization: 'sk_live_9540fe6964dc4fc1843907d1674b014d',
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    if (response.status === 201 && response.data.success) {
      console.log(JSON.stringify(response.data)); 
      console.log(response.data.data.invoiceNumber);
    } else {
      console.error('Error:', response.data);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

createInvoice();







// Shared in-memory mock databases for order tools.
// All order tool modules import from this single file so mutations are visible across tools.

export const customersDB = [
  {
    name: 'John Doe',
    dob: '1990-01-01',
    occupation: 'Engineer',
    maritalStatus: 'Single',
    gender: 'Male',
    address: '123 Main St',
    balance: 5000,
  },
];

export const ordersDB = [
  { orderId: 'ORD1001', customerName: 'John Doe' },
];

export const productsDB = [
  { name: 'iPhone 16', stock: 10, price: 1200 },
  { name: 'iPad Pro', stock: 5, price: 900 },
  { name: 'AirPods Max', stock: 2, price: 600 },
];

import axios from 'axios';
import { io } from 'socket.io-client';

async function run() {
  try {
    const loginRes = await axios.post('http://localhost:3000/api/v1/auth/login', {
      email: 'test@example.com',
      password: 'password'
    });
    
    const token = loginRes.data.token;
    console.log('Got token:', token);
    
    // Connect to Socket.io
    const socket = io('http://localhost:3000', {
      auth: { token }
    });
    
    socket.on('connect', () => {
      console.log('Socket connected! ID:', socket.id);
    });
    
    socket.on('alert:provider', (data) => {
      console.log('Received socket event [alert:provider]:', JSON.stringify(data, null, 2));
      process.exit(0);
    });
    
    socket.on('alert:new', (data) => {
      console.log('Received socket event [alert:new]:', JSON.stringify(data, null, 2));
      process.exit(0);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    // Wait a bit to ensure socket is connected before sending transaction
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const txRes = await axios.post('http://localhost:3000/api/v1/transactions', {
      agent_id: 'AGT-2048',
      provider_id: '11111111-1111-1111-1111-111111111111',
      transaction_type: 'cash_in',
      amount: 15000,
      customer_ref_hash: 'hash123'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('Transaction response:', JSON.stringify(txRes.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.error('Error response:', err.response.data);
    } else {
      console.error(err);
    }
  }
}

run();

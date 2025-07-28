const fetch = require('node-fetch');

async function testBackend() {
  try {
    console.log('Testing backend health...');
    const healthResponse = await fetch('http://localhost:3001/api/health');
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);
    
    console.log('\nTesting registration...');
    const registerResponse = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      })
    });
    const registerData = await registerResponse.json();
    console.log('Register response:', registerData);
    
  } catch (error) {
    console.error('Error testing backend:', error.message);
  }
}

testBackend();
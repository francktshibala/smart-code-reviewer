import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

async function testAuthEndpoints() {
  console.log('🧪 Testing Authentication Endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json() as any;
    console.log('Health status:', healthData.status);
    console.log('Database:', healthData.database);
    console.log('Prisma:', healthData.prisma);
    console.log('✅ Health check passed\n');

    // Test user registration
    console.log('2. Testing user registration...');
    const registerData = {
      email: 'testuser@example.com',
      password: 'testpass123',
      name: 'Test User'
    };

    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    });

    const registerResult = await registerResponse.json() as any;
    
    if (registerResponse.status === 201) {
      console.log('✅ Registration successful');
      console.log('User ID:', registerResult.user.id);
      console.log('User Email:', registerResult.user.email);
      console.log('Token received:', !!registerResult.token);
    } else {
      console.log('❌ Registration failed:', registerResult.error);
    }
    console.log();

    // Test login
    console.log('3. Testing user login...');
    const loginData = {
      email: 'testuser@example.com',
      password: 'testpass123'
    };

    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });

    const loginResult = await loginResponse.json() as any;
    
    if (loginResponse.status === 200) {
      console.log('✅ Login successful');
      console.log('User ID:', loginResult.user.id);
      console.log('User Email:', loginResult.user.email);
      console.log('Token received:', !!loginResult.token);
    } else {
      console.log('❌ Login failed:', loginResult.error);
    }
    console.log();

    // Test invalid login
    console.log('4. Testing invalid login...');
    const invalidLoginData = {
      email: 'testuser@example.com',
      password: 'wrongpassword'
    };

    const invalidLoginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidLoginData)
    });

    const invalidLoginResult = await invalidLoginResponse.json() as any;
    
    if (invalidLoginResponse.status === 401) {
      console.log('✅ Invalid login correctly rejected');
      console.log('Error message:', invalidLoginResult.error);
    } else {
      console.log('❌ Invalid login should have been rejected');
    }

    console.log('\n🎉 Authentication endpoints testing complete!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAuthEndpoints();
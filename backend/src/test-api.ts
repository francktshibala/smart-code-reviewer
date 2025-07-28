import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

// Sample analysis data
const sampleAnalysisData = {
  complexity: 5,
  maintainability: 85,
  issues: [
    { line: 10, type: 'warning', message: 'Consider using const instead of let' },
    { line: 25, type: 'error', message: 'Undefined variable reference' }
  ],
  metrics: {
    linesOfCode: 150,
    cyclomaticComplexity: 8,
    cognitiveComplexity: 12
  }
};

async function testCompleteAPI() {
  console.log('🧪 Testing Complete API...\n');
  
  let authToken = '';
  let projectId = 0;
  let analysisId = 0;

  try {
    // 1. Test user registration
    console.log('1. Testing user registration...');
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'apitest@example.com',
        password: 'testpass123',
        name: 'API Test User'
      })
    });

    const registerResult = await registerResponse.json() as any;
    
    if (registerResponse.status === 201) {
      console.log('✅ Registration successful');
      authToken = registerResult.token;
    } else if (registerResponse.status === 409) {
      console.log('⚠️  User exists, trying login...');
      
      // Try login instead
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'apitest@example.com',
          password: 'testpass123'
        })
      });

      const loginResult = await loginResponse.json() as any;
      if (loginResponse.status === 200) {
        console.log('✅ Login successful');
        authToken = loginResult.token;
      } else {
        throw new Error('Failed to login: ' + loginResult.error);
      }
    } else {
      throw new Error('Registration failed: ' + registerResult.error);
    }
    console.log();

    if (!authToken) {
      throw new Error('No auth token available');
    }

    // 2. Test project creation
    console.log('2. Testing project creation...');
    const createProjectResponse = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        name: 'Test Project',
        description: 'A test project for API testing'
      })
    });

    const createProjectResult = await createProjectResponse.json() as any;
    
    if (createProjectResponse.status === 201) {
      console.log('✅ Project created successfully');
      projectId = createProjectResult.project.id;
      console.log('Project ID:', projectId);
    } else {
      throw new Error('Project creation failed: ' + createProjectResult.error);
    }
    console.log();

    // 3. Test analysis creation
    console.log('3. Testing analysis creation...');
    const createAnalysisResponse = await fetch(`${API_BASE}/analyses`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        projectId,
        filename: 'test-file.js',
        language: 'javascript',
        analysisData: sampleAnalysisData,
        score: 75
      })
    });

    const createAnalysisResult = await createAnalysisResponse.json() as any;
    
    if (createAnalysisResponse.status === 201) {
      console.log('✅ Analysis created successfully');
      analysisId = createAnalysisResult.analysis.id;
      console.log('Analysis ID:', analysisId);
    } else {
      throw new Error('Analysis creation failed: ' + createAnalysisResult.error);
    }
    console.log();

    // 4. Test getting projects
    console.log('4. Testing get projects...');
    const getProjectsResponse = await fetch(`${API_BASE}/projects`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const getProjectsResult = await getProjectsResponse.json() as any;
    
    if (getProjectsResponse.status === 200) {
      console.log('✅ Projects retrieved successfully');
      console.log('Number of projects:', getProjectsResult.projects.length);
    } else {
      throw new Error('Get projects failed: ' + getProjectsResult.error);
    }
    console.log();

    // 5. Test getting analyses
    console.log('5. Testing get analyses...');
    const getAnalysesResponse = await fetch(`${API_BASE}/analyses`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const getAnalysesResult = await getAnalysesResponse.json() as any;
    
    if (getAnalysesResponse.status === 200) {
      console.log('✅ Analyses retrieved successfully');
      console.log('Number of analyses:', getAnalysesResult.analyses.length);
    } else {
      throw new Error('Get analyses failed: ' + getAnalysesResult.error);
    }
    console.log();

    // 6. Test getting single analysis
    console.log('6. Testing get single analysis...');
    const getSingleAnalysisResponse = await fetch(`${API_BASE}/analyses/${analysisId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const getSingleAnalysisResult = await getSingleAnalysisResponse.json() as any;
    
    if (getSingleAnalysisResponse.status === 200) {
      console.log('✅ Single analysis retrieved successfully');
      console.log('Analysis filename:', getSingleAnalysisResult.analysis.filename);
    } else {
      throw new Error('Get single analysis failed: ' + getSingleAnalysisResult.error);
    }
    console.log();

    // 7. Test getting single project
    console.log('7. Testing get single project...');
    const getSingleProjectResponse = await fetch(`${API_BASE}/projects/${projectId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const getSingleProjectResult = await getSingleProjectResponse.json() as any;
    
    if (getSingleProjectResponse.status === 200) {
      console.log('✅ Single project retrieved successfully');
      console.log('Project name:', getSingleProjectResult.project.name);
      console.log('Analyses in project:', getSingleProjectResult.project.analyses.length);
    } else {
      throw new Error('Get single project failed: ' + getSingleProjectResult.error);
    }
    console.log();

    // 8. Test updating project
    console.log('8. Testing project update...');
    const updateProjectResponse = await fetch(`${API_BASE}/projects/${projectId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        name: 'Updated Test Project',
        description: 'Updated description for testing'
      })
    });

    const updateProjectResult = await updateProjectResponse.json() as any;
    
    if (updateProjectResponse.status === 200) {
      console.log('✅ Project updated successfully');
      console.log('New name:', updateProjectResult.project.name);
    } else {
      throw new Error('Project update failed: ' + updateProjectResult.error);
    }
    console.log();

    // 9. Test authentication middleware
    console.log('9. Testing authentication middleware...');
    const unauthResponse = await fetch(`${API_BASE}/projects`);
    
    if (unauthResponse.status === 401) {
      console.log('✅ Authentication middleware working correctly');
    } else {
      console.log('❌ Authentication middleware not working');
    }
    console.log();

    console.log('🎉 All API tests completed successfully!');

  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

testCompleteAPI();
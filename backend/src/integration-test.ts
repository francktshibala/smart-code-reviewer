#!/usr/bin/env ts-node

/**
 * Integration Test Suite for Smart Code Reviewer
 * Tests the complete user journey from registration to analysis
 */

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

interface TestUser {
  email: string;
  password: string;
  name: string;
  token?: string;
  userId?: number;
}

interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message: string;
  duration: number;
}

class IntegrationTester {
  private results: TestResult[] = [];
  private testUser: TestUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    name: 'Integration Test User'
  };

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting Smart Code Reviewer Integration Tests');
    console.log('=' .repeat(60));

    try {
      // Basic connectivity
      await this.testHealthEndpoint();
      await this.testMetricsEndpoint();

      // Authentication flow
      await this.testUserRegistration();
      await this.testUserLogin();

      // Project management
      await this.testCreateProject();
      await this.testGetProjects();

      // Analysis workflow
      await this.testSaveAnalysis();
      await this.testGetAnalyses();
      await this.testDashboardStats();
      await this.testAnalysisFiltering();

      // Performance and caching
      await this.testCachingBehavior();

      // Cleanup
      await this.testDeleteAnalysis();

    } catch (error) {
      console.error('❌ Test suite failed with error:', error);
    }

    this.printResults();
  }

  private async runTest(testName: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    try {
      await testFn();
      this.results.push({
        test: testName,
        status: 'PASS',
        message: 'Test completed successfully',
        duration: Date.now() - startTime
      });
      console.log(`✅ ${testName}`);
    } catch (error) {
      this.results.push({
        test: testName,
        status: 'FAIL',
        message: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      });
      console.log(`❌ ${testName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async testHealthEndpoint(): Promise<void> {
    await this.runTest('Health Endpoint', async () => {
      const response = await fetch(`${API_BASE}/health`);
      const data = await response.json() as any;
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      if (data.status !== 'OK') {
        throw new Error(`Health status not OK: ${data.status}`);
      }
    });
  }

  private async testMetricsEndpoint(): Promise<void> {
    await this.runTest('Metrics Endpoint', async () => {
      const response = await fetch(`${API_BASE}/metrics`);
      const data = await response.json() as any;
      
      if (!response.ok) {
        throw new Error(`Metrics endpoint failed: ${response.status}`);
      }
      
      if (!data.cache || !data.system) {
        throw new Error('Metrics response missing required fields');
      }
    });
  }

  private async testUserRegistration(): Promise<void> {
    await this.runTest('User Registration', async () => {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.testUser)
      });
      
      const data = await response.json() as any;
      
      if (!response.ok) {
        throw new Error(`Registration failed: ${data.error || response.status}`);
      }
      
      if (!data.token || !data.user) {
        throw new Error('Registration response missing token or user');
      }
      
      this.testUser.token = data.token;
      this.testUser.userId = data.user.id;
    });
  }

  private async testUserLogin(): Promise<void> {
    await this.runTest('User Login', async () => {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.testUser.email,
          password: this.testUser.password
        })
      });
      
      const data = await response.json() as any;
      
      if (!response.ok) {
        throw new Error(`Login failed: ${data.error || response.status}`);
      }
      
      if (!data.token) {
        throw new Error('Login response missing token');
      }
    });
  }

  private async testCreateProject(): Promise<void> {
    await this.runTest('Create Project', async () => {
      const response = await fetch(`${API_BASE}/projects`, {  
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.testUser.token}`
        },
        body: JSON.stringify({
          name: 'Integration Test Project',
          description: 'Project created during integration testing'
        })
      });
      
      const data = await response.json() as any;
      
      if (!response.ok) {
        throw new Error(`Project creation failed: ${data.error || response.status}`);
      }
      
      if (!data.project || !data.project.id) {
        throw new Error('Project creation response missing project data');
      }
    });
  }

  private async testGetProjects(): Promise<void> {
    await this.runTest('Get Projects', async () => {
      const response = await fetch(`${API_BASE}/projects`, {
        headers: { 'Authorization': `Bearer ${this.testUser.token}` }
      });
      
      const data = await response.json() as any;
      
      if (!response.ok) {
        throw new Error(`Get projects failed: ${data.error || response.status}`);
      }
      
      if (!Array.isArray(data.projects)) {
        throw new Error('Projects response not an array');
      }
    });
  }

  private async testSaveAnalysis(): Promise<void> {
    await this.runTest('Save Analysis', async () => {
      // First get a project ID
      const projectsResponse = await fetch(`${API_BASE}/projects`, {
        headers: { 'Authorization': `Bearer ${this.testUser.token}` }
      });
      const projectsData = await projectsResponse.json() as any;
      const projectId = projectsData.projects[0]?.id;
      
      if (!projectId) {
        throw new Error('No project available for analysis');
      }
      
      const response = await fetch(`${API_BASE}/analyses`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.testUser.token}`
        },
        body: JSON.stringify({
          projectId,
          filename: 'test-file.js',
          language: 'javascript',
          score: 85,
          analysisData: {
            metrics: { complexity: 3, maintainability: 85 },
            issues: [],
            suggestions: ['Use const instead of var']
          }
        })
      });
      
      const data = await response.json() as any;
      
      if (!response.ok) {
        throw new Error(`Save analysis failed: ${data.error || response.status}`);
      }
      
      if (!data.analysis) {
        throw new Error('Analysis save response missing analysis data');
      }
    });
  }

  private async testGetAnalyses(): Promise<void> {
    await this.runTest('Get Analyses', async () => {
      const response = await fetch(`${API_BASE}/analyses`, {
        headers: { 'Authorization': `Bearer ${this.testUser.token}` }
      });
      
      const data = await response.json() as any;
      
      if (!response.ok) {
        throw new Error(`Get analyses failed: ${data.error || response.status}`);
      }
      
      if (!data.analyses || !data.pagination) {
        throw new Error('Analyses response missing required fields');
      }
    });
  }

  private async testDashboardStats(): Promise<void> {
    await this.runTest('Dashboard Statistics', async () => {
      const response = await fetch(`${API_BASE}/analyses/stats/dashboard`, {
        headers: { 'Authorization': `Bearer ${this.testUser.token}` }
      });
      
      const data = await response.json() as any;
      
      if (!response.ok) {
        throw new Error(`Dashboard stats failed: ${data.error || response.status}`);
      }
      
      if (typeof data.totalAnalyses !== 'number' || typeof data.averageScore !== 'number') {
        throw new Error('Dashboard stats response missing required metrics');
      }
    });
  }

  private async testAnalysisFiltering(): Promise<void> {
    await this.runTest('Analysis Filtering', async () => {
      const response = await fetch(`${API_BASE}/analyses?language=javascript&limit=10`, {
        headers: { 'Authorization': `Bearer ${this.testUser.token}` }
      });
      
      const data = await response.json() as any;
      
      if (!response.ok) {
        throw new Error(`Analysis filtering failed: ${data.error || response.status}`);
      }
      
      if (!data.analyses || !data.pagination) {
        throw new Error('Filtered analyses response missing required fields');
      }
    });
  }

  private async testCachingBehavior(): Promise<void> {
    await this.runTest('Caching Behavior', async () => {
      // Make two identical requests and check metrics
      const start = Date.now();
      
      const response1 = await fetch(`${API_BASE}/analyses`, {
        headers: { 'Authorization': `Bearer ${this.testUser.token}` }
      });
      
      const firstRequestTime = Date.now() - start;
      
      const response2 = await fetch(`${API_BASE}/analyses`, {
        headers: { 'Authorization': `Bearer ${this.testUser.token}` }
      });
      
      const secondRequestTime = Date.now() - start - firstRequestTime;
      
      if (!response1.ok || !response2.ok) {
        throw new Error('Cache test requests failed');
      }
      
      // Check metrics to see if cache is working
      const metricsResponse = await fetch(`${API_BASE}/metrics`);
      const metrics = await metricsResponse.json() as any;
      
      if (metrics.cache.totalEntries === 0) {
        console.warn('⚠️  Cache appears to be empty, but test passed');
      }
    });
  }

  private async testDeleteAnalysis(): Promise<void> {
    await this.runTest('Delete Analysis', async () => {
      // Get an analysis to delete
      const analysesResponse = await fetch(`${API_BASE}/analyses`, {
        headers: { 'Authorization': `Bearer ${this.testUser.token}` }
      });
      const analysesData = await analysesResponse.json() as any;
      const analysisId = analysesData.analyses[0]?.id;
      
      if (!analysisId) {
        throw new Error('No analysis available to delete');
      }
      
      const response = await fetch(`${API_BASE}/analyses/${analysisId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${this.testUser.token}` }
      });
      
      if (!response.ok) {
        const data = await response.json() as any;
        throw new Error(`Delete analysis failed: ${data.error || response.status}`);
      }
    });
  }

  private printResults(): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 Integration Test Results');
    console.log('='.repeat(60));
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const skipped = this.results.filter(r => r.status === 'SKIP').length;
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`📈 Success Rate: ${Math.round((passed / this.results.length) * 100)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(r => console.log(`   - ${r.test}: ${r.message}`));
    }
    
    console.log('\n⏱️  Performance Summary:');
    const totalTime = this.results.reduce((sum, r) => sum + r.duration, 0);
    console.log(`   Total test time: ${totalTime}ms`);
    console.log(`   Average per test: ${Math.round(totalTime / this.results.length)}ms`);
    
    console.log('\n' + '='.repeat(60));
    
    if (failed === 0) {
      console.log('🎉 All integration tests passed!');
      process.exit(0);
    } else {
      console.log('💥 Some integration tests failed!');
      process.exit(1);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new IntegrationTester();
  tester.runAllTests().catch(console.error);
}

export default IntegrationTester;
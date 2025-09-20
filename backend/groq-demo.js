#!/usr/bin/env node

/**
 * Groq AI Demo Script for MindGuard AI
 * 
 * This script demonstrates the Groq AI integration without requiring
 * a full server setup. It shows how the risk assessment, prompting,
 * and fallback mechanisms work.
 */

const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Test cases to demonstrate different risk levels and responses
const testCases = [
  {
    category: 'Low Risk',
    message: 'I had a difficult day at work today',
    expectedRisk: 'low',
    sentiment: -0.2
  },
  {
    category: 'Medium Risk',
    message: 'I feel hopeless and worthless',
    expectedRisk: 'medium',
    sentiment: -0.6
  },
  {
    category: 'High Risk',
    message: 'I want to end it all tonight',
    expectedRisk: 'high',
    sentiment: -0.9
  },
  {
    category: 'Positive',
    message: 'I am feeling better today and want to practice self-care',
    expectedRisk: 'low',
    sentiment: 0.5
  }
];

async function runGroqDemo() {
  console.log('🤖 MindGuard AI - Groq Integration Demo\n');
  
  try {
    // Import the Groq service (built version)
    const groqModule = require('./dist/utils/groq-ai-service.js');
    const { GroqAIService } = groqModule;
    
    console.log('✅ Groq service loaded successfully\n');
    
    // Create service instance
    const groqService = new GroqAIService();
    
    // Check API key configuration
    const apiKey = process.env.GROQ_API_KEY;
    const hasValidKey = apiKey && apiKey !== 'your-groq-api-key-here' && apiKey.length > 10;
    
    console.log(`🔑 API Key Status: ${hasValidKey ? '✅ Configured' : '⚠️  Not configured (will use fallback)'}\n`);
    
    if (!hasValidKey) {
      console.log('💡 To test with real Groq API:');
      console.log('   1. Get API key from https://console.groq.com/');
      console.log('   2. Add GROQ_API_KEY=your-key-here to .env file');
      console.log('   3. Run this demo again\n');
    }
    
    console.log('🧪 Testing Risk Assessment Algorithm:\n');
    
    // Test risk assessment without API calls
    for (const testCase of testCases) {
      console.log(`📝 Testing: "${testCase.message}"`);
      
      // Access private method for testing
      const riskLevel = groqService.assessRiskLevel(testCase.message, testCase.sentiment);
      
      const riskIcon = riskLevel === 'high' ? '🔴' : riskLevel === 'medium' ? '🟡' : '🟢';
      console.log(`   ${riskIcon} Risk Level: ${riskLevel.toUpperCase()}`);
      console.log(`   📊 Sentiment: ${testCase.sentiment > 0 ? '+' : ''}${testCase.sentiment}`);
      console.log(`   ✓ Expected: ${testCase.expectedRisk}, Got: ${riskLevel} ${riskLevel === testCase.expectedRisk ? '✅' : '❌'}`);
      console.log('');
    }
    
    console.log('🎭 Testing Response Generation:\n');
    
    // Test a couple of responses (will use fallback if no API key)
    const testMessage = 'I feel anxious about my future';
    const userId = 'demo-user-123';
    const userContext = {
      currentMood: 'anxious',
      conversationHistory: []
    };
    
    console.log(`📤 Input: "${testMessage}"`);
    console.log('⏳ Generating response...\n');
    
    const startTime = Date.now();
    const response = await groqService.generateResponse(testMessage, userId, userContext, -0.3);
    const endTime = Date.now();
    
    console.log('📥 Response Generated:');
    console.log('─'.repeat(60));
    console.log(response.response);
    console.log('─'.repeat(60));
    console.log('');
    
    console.log('📊 Response Metadata:');
    console.log(`   ⏱️  Processing Time: ${endTime - startTime}ms`);
    console.log(`   🎭 Personality: ${response.metadata.personality}`);
    console.log(`   🎯 Intervention: ${response.metadata.intervention}`);
    console.log(`   ${response.metadata.riskLevel === 'high' ? '🔴' : response.metadata.riskLevel === 'medium' ? '🟡' : '🟢'} Risk Level: ${response.metadata.riskLevel}`);
    console.log('');
    
    if (response.metadata.followUpQuestions?.length > 0) {
      console.log('❓ Suggested Follow-up Questions:');
      response.metadata.followUpQuestions.forEach((q, i) => {
        console.log(`   ${i + 1}. ${q}`);
      });
      console.log('');
    }
    
    if (response.metadata.suggestedActions?.length > 0) {
      console.log('💡 Suggested Actions:');
      response.metadata.suggestedActions.forEach((action, i) => {
        console.log(`   ${i + 1}. ${action}`);
      });
      console.log('');
    }
    
    console.log('✅ Demo completed successfully!');
    console.log('');
    console.log('🚀 Next Steps:');
    console.log('   • Start the full server: npm run dev');
    console.log('   • Test the chat interface at http://localhost:5173');
    console.log('   • Configure Groq API key for enhanced responses');
    console.log('   • Run tests: npm test');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   • Make sure you built the backend: npm run build');
    console.log('   • Check that dependencies are installed: npm install');
    console.log('   • Verify the service file exists: src/utils/groq-ai-service.ts');
  }
}

// Handle command line execution
if (require.main === module) {
  runGroqDemo();
}

module.exports = { runGroqDemo };
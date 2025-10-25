class MockAdapter {
  async send(to, message) {
    console.log('[Mock SMS] Simulating SMS send...');
    console.log(`[Mock SMS] To: ${to}`);
    console.log(`[Mock SMS] Message: ${message}`);
    
    return {
      success: true,
      provider: 'mock',
      messageId: `mock_${Date.now()}`,
      to,
      message,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = MockAdapter;
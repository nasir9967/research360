'use client'

export default function DashboardPage() {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>📊 Protected Dashboard</h1>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#e8f5e8', 
        borderRadius: '8px',
        border: '1px solid #4caf50',
        marginBottom: '20px'
      }}>
        <h2>✅ Success! You have access!</h2>
        <p>If you can see this page, it means:</p>
        <ul>
          <li>🔒 Middleware ran and checked your token</li>
          <li>🍪 You have a valid token'cookie</li>
          <li>✅ Access was granted</li>
        </ul>
      </div>

      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f0f8ff', 
        borderRadius: '8px',
        border: '1px solid #2196f3',
        marginBottom: '20px'
      }}>
        <h3>🧪 How to Test Middleware:</h3>
        <ol>
          <li><strong>Check Terminal:</strong> Look for middleware logs</li>
          <li><strong>Open DevTools (F12):</strong> 
            <ul>
              <li>Go to Network tab</li>
              <li>Refresh this page</li>
              <li>Click on the main request</li>
              <li>Look for these headers:
                <ul>
                  <li><code>X-Auth-Check: PASSED</code></li>
                  <li><code>X-Token-Status: FOUND</code></li>
                  <li><code>X-Middleware-Time: [timestamp]</code></li>
                </ul>
              </li>
            </ul>
          </li>
        </ol>
      </div>

      <div style={{ 
        padding: '20px', 
        backgroundColor: '#fff3e0', 
        borderRadius: '8px',
        border: '1px solid #ff9800',
        marginBottom: '20px'
      }}>
        <h3>🍪 Cookie Testing:</h3>
        <p>Test with buttons below:</p>
        <button 
          onClick={() => {
            document.cookie = 'token=abc123; path=/';
            alert('Token cookie set! Middleware will now allow access.');
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          🍪 Set Token Cookie
        </button>
        
        <button 
          onClick={() => {
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            alert('Token cleared! Try visiting /dashboard again - you should be redirected to /login');
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🗑️ Clear Token Cookie
        </button>
      </div>

      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px'
      }}>
        <h3>🔗 Test Links:</h3>
        <ul>
          <li><a href="/profile" style={{ color: '#0066cc' }}>Visit Profile</a> (also protected)</li>
          <li><a href="/chart" style={{ color: '#0066cc' }}>Chart Page</a> (not protected)</li>
        </ul>
      </div>
    </div>
  );
}


// Server-side data fetching function (App Router style)
async function fetchPost() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
    // Add cache options for better performance
    cache: 'force-cache', // or 'no-store' for dynamic data
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch post');
  }
  
  return res.json();
}

// Main component - this is a Server Component by default in App Router
export default async function SSRExample() {
  // Fetch data directly in the component (App Router style)
  const post = await fetchPost();
  
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', borderBottom: '2px solid #0070f3', paddingBottom: '10px' }}>
        SSR Post Example
      </h1>
      <div style={{ 
        background: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px', 
        marginTop: '20px' 
      }}>
        <h2 style={{ color: '#0070f3', marginBottom: '10px' }}>
          {post.title}
        </h2>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          {post.body}
        </p>
        <div style={{ 
          marginTop: '15px', 
          fontSize: '14px', 
          color: '#888' 
        }}>
          <strong>Post ID:</strong> {post.id} | <strong>User ID:</strong> {post.userId}
        </div>
      </div>
      
      {/* Additional info about SSR */}
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        background: '#e8f4f8', 
        borderRadius: '6px',
        fontSize: '14px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#0070f3' }}>How This Works:</h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>✅ Data is fetched on the server before page render</li>
          <li>✅ Page loads with content already available (SEO friendly)</li>
          <li>✅ No loading spinner needed for initial data</li>
          <li>✅ Better performance for search engines</li>
        </ul>
      </div>
    </div>
  );
}
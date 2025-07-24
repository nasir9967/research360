import { Suspense } from 'react';
import Comments from './Comments';
import styles from './loading.module.css';

// Type definitions
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// Streaming allows sending HTML in chunks
export default function StreamingPage() {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {/* This renders immediately */}
            <header style={{ 
                backgroundColor: '#0070f3', 
                color: 'white', 
                padding: '20px', 
                borderRadius: '8px',
                marginBottom: '20px'
            }}>
                <h1>🚀 My Streaming App</h1>
                <p>This header loads instantly!</p>
            </header>
            
            {/* This streams when data is ready */}
            <Suspense fallback={
                <div className={`${styles.loadingContainer} ${styles.postsLoading}`}>
                    <div>📝 Loading posts... (streaming in background)</div>
                    <div style={{ marginTop: '10px' }}>
                        <span className={styles.spinner}>⏳</span>
                    </div>
                </div>
            }>
                <Posts />
            </Suspense>
            
            {/* This also streams independently */}
            <Suspense fallback={
                <div className={`${styles.loadingContainer} ${styles.commentsLoading}`}>
                    <div>💬 Loading comments... (streaming independently)</div>
                    <div style={{ marginTop: '10px' }}>
                        <span className={styles.spinner}>⏳</span>
                    </div>
                </div>
            }>
                <Comments />
            </Suspense>
            
            {/* Footer renders immediately */}
            <footer style={{ 
                backgroundColor: '#333', 
                color: 'white', 
                padding: '20px', 
                borderRadius: '8px',
                marginTop: '20px',
                textAlign: 'center'
            }}>
                <p>© 2024 - This footer also loads instantly!</p>
                <small>✨ Powered by Next.js Streaming SSR</small>
            </footer>
        </div>
    );
}

async function Posts() {
    // Simulate slow API call (3 seconds)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        const posts = await response.json();
        
        return (
            <div style={{ 
                backgroundColor: '#f0f8ff', 
                padding: '20px', 
                borderRadius: '8px',
                margin: '10px 0'
            }}>
                <h2>📝 Latest Posts (Streamed after 3 seconds)</h2>
                <div style={{ display: 'grid', gap: '15px' }}>
                    {posts.map((post: Post) => (
                        <div key={post.id} style={{ 
                            backgroundColor: 'white', 
                            padding: '15px', 
                            borderRadius: '6px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{ color: '#0070f3', marginTop: 0 }}>
                                {post.id}. {post.title}
                            </h3>
                            <p style={{ color: '#666', margin: '10px 0 0 0' }}>
                                {post.body.substring(0, 100)}...
                            </p>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: '15px', fontSize: '14px', color: '#0070f3' }}>
                    ✅ Posts loaded and streamed successfully!
                </div>
            </div>
        );
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        return (
            <div style={{ padding: '20px', backgroundColor: '#ffe6e6', borderRadius: '8px' }}>
                <h2>❌ Failed to load posts</h2>
                <p>Something went wrong while fetching posts.</p>
            </div>
        );
    }
}
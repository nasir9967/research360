// Type definition for comments
interface Comment {
  id: number;
  name: string;
  email: string;
  body: string;
  postId: number;
}

async function Comments() {
    // Simulate different loading time (5 seconds) to show independent streaming
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=8');
        const comments: Comment[] = await response.json();
        
        return (
            <div style={{ 
                backgroundColor: '#fff0f5', 
                padding: '20px', 
                borderRadius: '8px',
                margin: '10px 0'
            }}>
                <h2>💬 Recent Comments (Streamed after 5 seconds)</h2>
                <div style={{ display: 'grid', gap: '12px' }}>
                    {comments.map((comment) => (
                        <div key={comment.id} style={{ 
                            backgroundColor: 'white', 
                            padding: '12px', 
                            borderRadius: '6px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <strong style={{ color: '#e91e63' }}>
                                    {comment.name}
                                </strong>
                                <small style={{ color: '#999' }}>
                                    #{comment.id}
                                </small>
                            </div>
                            <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                                📧 {comment.email}
                            </div>
                            <p style={{ 
                                margin: '10px 0 0 0', 
                                fontSize: '14px',
                                color: '#333'
                            }}>
                                {comment.body}
                            </p>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: '15px', fontSize: '14px', color: '#e91e63' }}>
                    ✅ Comments loaded and streamed independently!
                </div>
            </div>
        );
    } catch (error) {
        console.error('Failed to fetch comments:', error);
        return (
            <div style={{ padding: '20px', backgroundColor: '#ffe6e6', borderRadius: '8px' }}>
                <h2>❌ Failed to load comments</h2>
                <p>Something went wrong while fetching comments.</p>
            </div>
        );
    }
}

export default Comments;
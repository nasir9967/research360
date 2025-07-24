// Multiple Data Sources
export default async function user() {
 
    const [userRes, postsRes] = await Promise.all([
      fetch("https://jsonplaceholder.typicode.com/users/1"),
      fetch("https://jsonplaceholder.typicode.com/posts?userId=1&_limit=3"),
    ]);
    const user = await userRes.json();
    const posts = await postsRes.json();

    return (
      <div>
        <h1>Name : {user.name}</h1>
        <h2>Recent Posts:</h2>
        {posts.map((post) => (
          <div key={post.id} style={{ margin: "10px 0" }}>
            <h3>{post.title}</h3>
          </div>
        ))}
      </div>
    );
 
}

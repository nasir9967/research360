// Multiple Data Sources
interface User {
  name: string;
  id: number;
}

interface Post {
  id: number;
  title: string;
  body: string;
}

export default async function UserPage() {
  const [userRes, postsRes] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/users/1"),
    fetch("https://jsonplaceholder.typicode.com/posts?userId=1&_limit=3"),
  ]);
  
  const user: User = await userRes.json();
  const posts: Post[] = await postsRes.json();

  return (
    <div>
      <h1>Name : {user.name}</h1>
      <h2>Recent Posts:</h2>
      {posts.map((post: Post) => (
        <div key={post.id} style={{ margin: "10px 0" }}>
          <h3>{post.title}</h3>
        </div>
      ))}
    </div>
  );
}

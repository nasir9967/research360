async function getUser() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
    const data = await res.json();     
    return data;
  } catch {
    return null;
  }
}

export default async function safeSSR(){
 const user = await getUser();
 //console.log('user====',user);
 if(!user){
    return <div>Fail to load user...</div>;
 }

 return (
    <div>
        <h1>Name : {user.name}</h1>
        <p>Email : {user.email}</p>
    </div>
 );
}

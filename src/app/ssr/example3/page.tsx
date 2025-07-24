

export default async function revalidatedata(){
    const data = await fetch("https://api.github.com/repos/vercel/next.js",{
        next: {revalidate:60}
    });
    const repo =await data.json();

    return (
        <div>
            <h1>{ repo.name }</h1>
            <p>{repo.stargazers_count}</p>
            <p>{ repo.description} </p>
             <small>Data cached for 60 seconds using revalidate</small>
        </div>
    )
}
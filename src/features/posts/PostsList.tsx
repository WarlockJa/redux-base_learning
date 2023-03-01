import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import PostExcerpt from "./PostExcerpt"
import { fetchPosts, selectAllPosts } from "./postsSlice"

const PostsList = () => {
    const dispatch = useAppDispatch()
    const posts = useAppSelector(selectAllPosts)

    useEffect(() => {
        if(posts.status === 'idle') {
            dispatch(fetchPosts())
        }
    },[posts.status, dispatch])

    let content
    if(posts.status === 'loading') {
        content = <p>Loading...</p>
    } else if(posts.status === 'failed') {
        content = <p>Error: {posts.error}</p>
    } else {
        content = posts.posts.map(post => 
            <PostExcerpt key={post.id} postId={post.id} />
        )
    }

    // const orderedPosts = posts.posts.map(post => 
    //     <li
    //         key={post.id}
    //         className='listItem'
    //     >
    //         <h3>{post.title}</h3>
    //         <div className="postHeader">
    //             <p>{post.language}</p>
    //             <p>{post.country}</p>
    //             <p>{post.category}</p>
    //         </div>
    //         <p className="postDescription">{post.description}</p>
    //         <Link to={`${post.id}`}>View post</Link>
    //         <div className="postFooter">
    //             <p>{post.source}</p>
    //             <p>{post.url}</p>
    //             <p>{post.author}</p>
    //             <p>{TimeAgo(post.published_at)}</p>
    //         </div>
    //     </li>
    // )

    return (
        <section className="newsSection">
            <h2>News Posts</h2>
            <ul>
                {content}
            </ul>
        </section>
    )
}

export default PostsList
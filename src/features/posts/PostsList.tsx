import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import PostExcerpt from "./PostExcerpt"
import { fetchPosts, selectAllPosts } from "./postsSlice"
import SelectCategory from "./SelectCategory"

const PostsList = () => {
    const dispatch = useAppDispatch()
    const posts = useAppSelector(selectAllPosts)
    
    useEffect(() => {
        if(posts.status === 'idle') {
            const fetchRequest = {
                API_URL: import.meta.env.VITE_APP_NYTIMES_API_URL.replace('FILENAME', 'science').concat(import.meta.env.VITE_APP_NYTIMES_API_KEY) //import.meta.env.VITE_APP_NYTIMES_API_URL,
            }

            dispatch(fetchPosts(fetchRequest))
        }
    },[posts.status, dispatch])

    let content
    if(posts.status === 'loading') {
        content = <p>Loading...</p>
    } else if(posts.status === 'failed') {
        content = <p>Error: {posts.error}</p>
    } else if(posts.status === 'succeeded') {
        // forming content for the page
        content = posts.posts.map(post => 
            <PostExcerpt key={post.id} postId={post.id} />
        )
    }

    return (
        <section className="newsSection">
            <h2>News Posts</h2>
            <SelectCategory />
            <ul>
                {content}
            </ul>
        </section>
    )
}

export default PostsList
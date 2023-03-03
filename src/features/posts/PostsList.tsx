import { useEffect } from "react"
import { Link, NavLink, useParams, useSearchParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import PostExcerpt from "./PostExcerpt"
import { fetchPosts, selectAllPosts } from "./postsSlice"

const PostsList = () => {
    const dispatch = useAppDispatch()
    const posts = useAppSelector(selectAllPosts)
    
    const [searchParams] = useSearchParams()
    const offset = searchParams.get('offset')
    const { page } = useParams()

    useEffect(() => {
        if(posts.status === 'idle') {
            console.log(page)
            const fetchRequest = {
                API_URL: import.meta.env.VITE_APP_MEDIASTACK_API_URL,
                limit: posts.pagination.limit,
                offset: offset ? offset : posts.pagination.offset
            }

            dispatch(fetchPosts(fetchRequest))
        }
    },[posts.status, posts.pagination.limit, posts.pagination.offset, offset, dispatch])

    let content
    let pagesNavigation
    if(posts.status === 'loading') {
        content = <p>Loading...</p>
    } else if(posts.status === 'failed') {
        content = <p>Error: {posts.error}</p>
    } else {
        content = posts.posts.map(post => 
            <PostExcerpt key={post.id} postId={post.id} />
        )
        const pagesNumber = Math.floor(posts.pagination.total / posts.pagination.limit)
        console.log(pagesNumber)
        pagesNavigation = [...Array(pagesNumber)].map((_item, index) =>
            <NavLink style={({ isActive }) => isActive ? {fontSize: '1.2rem'} : undefined}
                to={`/posts?offset=${index * posts.pagination.limit}`}
                reloadDocument
                key={index}
            >{index + 1}</NavLink>
        )
    }

    return (
        <section className="newsSection">
            <h2>News Posts</h2>
            <div className="controls">
                <Link to={`/posts?offset=${posts.pagination.offset - posts.pagination.limit}`} reloadDocument>Previous</Link>
                <Link to={`/posts?offset=${posts.pagination.offset + posts.pagination.limit}`} reloadDocument>Next</Link>
            </div>
            <ul>
                {content}
            </ul>
            {pagesNavigation}
        </section>
    )
}

export default PostsList
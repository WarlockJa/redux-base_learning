import { Navigate, useParams } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import TimeAgo from "../../util/TimeAgo"
import { selectPostById } from "./postsSlice"

const SinglePostPage = () => {
    const { postId } = useParams()
    const post = useAppSelector(state => selectPostById(state, postId!))

    if(!post) return (<Navigate to='/posts' replace />)
    
    return (
        <article>
            <h3>{post.title}</h3>
            <div className="postHeader">
                <p>Language: {post.language}</p>
                <p>Country: {post.country}</p>
                <p>Category: {post.category}</p>
            </div>
            <p className="postDescription">{post.description}</p>
            <button onClick={() => history.back()}>Go back</button>
            <div className="postFooter">
                <p>{post.author}</p>
                <p>{post.source}</p>
                <a href={post.url} target="_blank">Link to source</a>
                <p>{TimeAgo(post.published_at)}</p>
            </div>
        </article>
    )
}

export default SinglePostPage
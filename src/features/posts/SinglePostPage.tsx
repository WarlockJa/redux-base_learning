import { useParams } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import TimeAgo from "../../util/TimeAgo"
import { selectPostById } from "./postsSlice"

const SinglePostPage = () => {
    const { postId } = useParams()
    const post = useAppSelector(state => selectPostById(state, postId!))

    if(!post) return (
        <article>
            <h3>No post found</h3>
        </article>
    )
    
    return (
        <article>
            <h3>{post.title}</h3>
            <div className="postHeader">
                <p>{post.language}</p>
                <p>{post.country}</p>
                <p>{post.category}</p>
            </div>
            <p className="postDescription">{post.description}</p>
            <div className="postFooter">
                <p>{post.source}</p>
                <p>{post.url}</p>
                <p>{post.author}</p>
                <p>{TimeAgo(post.published_at)}</p>
            </div>
        </article>
    )
}

export default SinglePostPage
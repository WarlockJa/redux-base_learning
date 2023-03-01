import { Link } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { selectPostById } from './postsSlice'

const PostExcerpt = ({ postId }: { postId: string}) => {
    const post = useAppSelector(state => selectPostById(state, postId))
    if(!post) return (
        <li>
            <h3>No post found</h3>
        </li>
    )
    return (
        <li
            key={post.id}
            className='listItem'
        >
            <h3>{post.title}</h3>
            <div className="postHeader">
                <p>Language: {post.language}</p>
                <p>Country: {post.country}</p>
                <p>Category: {post.category}</p>
            </div>
            <p className="postDescription">{post.description}</p>
            <Link to={`${post.id}`}>View post</Link>
            <div className="postFooter">
                <a href={post.url}>link to source</a>
                <p>{post.author ? post.author : ''}</p>
                <p>{post.published_at}</p>
                {/* <p>{TimeAgo(post.published_at)}</p> */}
            </div>
        </li>
    )
}

export default PostExcerpt
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import TimeAgo from '../../util/TimeAgo'
import { selectPostById } from './postsSlice'

const PostExcerpt = ({ postId }: { postId: string}) => {
    const post = useAppSelector(state => selectPostById(state, postId))
    if(!post) return (
        <li>
            <h3>No post found</h3>
        </li>
    )

    const shortenedDescription = post.description.length < 70 ? post.description : post.description.substring(0, 70).concat('...')

    return (
        <li
            key={post.id}
            className='listItem'
        >
            <h3>{post.title}</h3>
            <p className="postDescription">{shortenedDescription}</p>
            <Link to={post.id}>View post</Link>
            <div className="postFooter">
                <p>{post.author ? post.author : ''}</p>
                {/* <a href={post.url} target="_blank">link to source</a> */}
                <p>{TimeAgo(post.published_at)}</p>
            </div>
        </li>
    )
}

export default PostExcerpt
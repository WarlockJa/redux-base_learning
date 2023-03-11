import { useState } from "react"
import { Navigate, useParams } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import TimeAgo from "../../util/TimeAgo"
import { IMultimediaNYTimes, selectPostById } from "./postsSlice"
import { categoryList } from "./SelectCategory"

const SinglePostPage = () => {
    const { postId, categoryId } = useParams()

    const categoryTypeExists = categoryList.find(item => item.id === categoryId)

    let post
    // check if category in url exists on the type NYTimesSectionsType
    if(categoryTypeExists?.id) post = useAppSelector(state => selectPostById(state, categoryTypeExists.id, postId!))

    if(!post) return (<Navigate to='/posts' replace />)
    
    const multimedia = post.multimedia.find(item => item.format === 'Large Thumbnail')
    const largeItem = post.multimedia.find(item => item.format === 'Super Jumbo')?.url
    
    return (
        <article>
            <h3>{post.title}</h3>
            <p className="postDescription">{post.abstract}</p>
            <button onClick={() => history.back()}>Go back</button>
            <div className="postFooter">
                <p>{post.byline}</p>
                <a href={post.url} target="_blank">Link to source</a>
                <p>{TimeAgo(post.published_date)}</p>
            </div>
            {multimedia && <Multimedia multimediaItem={multimedia} largeImage={largeItem} />}
        </article>
    )
}

const Multimedia = ({ multimediaItem, largeImage }: { multimediaItem: IMultimediaNYTimes, largeImage: string | undefined }) => {
    const [showLarge, setShowLarge] = useState(false)
    return (
        <div className="postMultimedia">
            <img className="buttonLike" onClick={() => setShowLarge(true)} src={multimediaItem.url} alt="icon" />
            {showLarge &&
                <div onClick={() => setShowLarge(false)} className="modalImage">
                    <img className="buttonLike" src={largeImage} alt='large' />
                </div>
            }
            <div>
                <p>{multimediaItem.caption} {multimediaItem.copyright}</p>
                <p>{multimediaItem.copyright}</p>
            </div>
        </div>
    )
}

export default SinglePostPage
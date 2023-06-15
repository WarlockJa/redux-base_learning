import { ErrorBoundary } from "react-error-boundary";
import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import TimeAgo from "../../util/TimeAgo";
import { IMultimediaNYTimes, selectPostById } from "./postsSlice";
import { categoryList } from "./SelectCategory";
import ErrorPlug from "../../util/ErrorPlug";
import Spinner from "../../util/Spinner";
import MyImageWrapper from "../../util/MyImageWrapper";

const SinglePostPage = () => {
    const { postId, categoryId } = useParams();

    return (
        <ErrorBoundary
            FallbackComponent={ErrorPlug}
            onReset={() => history.back()}
        >
            <PostData postId={postId} categoryId={categoryId} />
        </ErrorBoundary>
    );
};

const PostData = ({
    postId,
    categoryId,
}: {
    postId: string | undefined;
    categoryId: string | undefined;
}) => {
    const navigate = useNavigate();
    const categoryTypeExists = categoryList.find(
        (item) => item.id === categoryId
    );

    let post;
    // check if category in url exists on the type NYTimesSectionsType
    if (categoryTypeExists?.id)
        try {
            post = useAppSelector((state) =>
                selectPostById(state, categoryTypeExists.id, postId!)
            );
        } catch (error) {
            // console.log(error)
        }

    if (!post) return <Navigate to={`/posts/${categoryId}`} replace />;

    return (
        <article>
            <h3>{post.title}</h3>
            <p className="postDescription">{post.abstract}</p>
            <button onClick={() => history.back()}>Go back</button>
            <div className="postFooter">
                <p>{post.byline}</p>
                <a href={post.url} target="_blank">
                    Link to source
                </a>
                <p>{TimeAgo(post.published_date)}</p>
            </div>
            {post.multimedia && <Multimedia multimedia={post.multimedia} />}
        </article>
    );
};

const Multimedia = ({ multimedia }: { multimedia: IMultimediaNYTimes[] }) => {
    const [showLarge, setShowLarge] = useState(false);

    return (
        <div className="postMultimedia">
            <MyImageWrapper
                className="buttonLike"
                onClick={() => setShowLarge(true)}
                src={multimedia[2].url}
                alt="icon"
                loadingComponent={<Spinner embed={true} />}
            />
            {showLarge && (
                <div onClick={() => setShowLarge(false)} className="modalImage">
                    <MyImageWrapper
                        src={multimedia[0].url}
                        alt="large"
                        loadingComponent={<Spinner embed={true} />}
                        loadingBgImg={multimedia[2].url}
                    />
                </div>
            )}
            <div>
                <p>{multimedia[2].caption}</p>
                <p>{multimedia[2].copyright}</p>
            </div>
        </div>
    );
};

export default SinglePostPage;

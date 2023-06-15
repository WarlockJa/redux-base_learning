import { ErrorBoundary } from "react-error-boundary";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import ErrorPlug from "../../util/ErrorPlug";
import TimeAgo from "../../util/TimeAgo";
import { NYTimesSectionsType, selectPostById } from "./postsSlice";

const PostExcerpt = ({
    category,
    postId,
}: {
    category: NYTimesSectionsType;
    postId: string;
}) => {
    return (
        <ErrorBoundary FallbackComponent={ErrorPlug}>
            <Post category={category} postId={postId} />
        </ErrorBoundary>
    );
};

const Post = ({
    category,
    postId,
}: {
    category: NYTimesSectionsType;
    postId: string;
}) => {
    const post = useAppSelector((state) =>
        selectPostById(state, category, postId)
    );
    if (!post)
        return (
            <li>
                <h3>No post found</h3>
            </li>
        );

    const shortenedDescription =
        post.abstract.length < 70
            ? post.abstract
            : post.abstract.substring(0, 70).concat("...");

    return (
        <li key={post.id} className="listItem">
            <h3>{post.title}</h3>
            <p className="postDescription">{shortenedDescription}</p>
            <Link to={post.id}>View post</Link>
            <div className="postFooter">
                <p>{post.byline ? post.byline : ""}</p>
                <p>{TimeAgo(post.published_date)}</p>
            </div>
        </li>
    );
};

export default PostExcerpt;

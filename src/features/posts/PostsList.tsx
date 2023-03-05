import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import PostExcerpt from "./PostExcerpt"
import { changeCurrentCategory, changeStatusToIdle, createCategory, fetchPosts, selectAllPosts } from "./postsSlice"
import SelectCategory from "./SelectCategory"
import { categoryList } from "./SelectCategory"

const PostsList = () => {
    const { categoryId } = useParams()
    const posts = useAppSelector(selectAllPosts)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    // remembering active news category and switching to it on route change
    useEffect (() => {
        // checking if url category parameter exists within the Type NYTimesSectionsType
        const categoryTypeExists = categoryList.find(item => item.id === categoryId)

        if(categoryTypeExists && posts.currentCategory !== categoryTypeExists.id) {
            // replacing active category in the store
            dispatch(changeCurrentCategory(categoryTypeExists.id))
            
            // checking if categoryId exists in the store
            const activeCategoryIndex = posts.data.findIndex(item => item.categoryId === categoryTypeExists.id)
            // category not found
            if(activeCategoryIndex === -1) {
                // creating category in the store
                dispatch(createCategory(categoryTypeExists.id))
                // initiating data fetch
                dispatch(changeStatusToIdle())
            }
        } else {
            // navigating to stored active category or empty posts page
            posts.currentCategory ? navigate(`/posts/${posts.currentCategory}`) : navigate(`/posts`)
        }
    },[categoryId, posts.currentCategory, categoryList, dispatch])
    
    // fetching data for the current category
    useEffect (() => {
        // fetching data
        if(posts.status === 'idle') {
            const fetchRequest = {
                API_URL: import.meta.env.VITE_APP_NYTIMES_API_URL.replace('FILENAME', categoryId).concat(import.meta.env.VITE_APP_NYTIMES_API_KEY)
            }

            dispatch(fetchPosts(fetchRequest))
        }
    },[dispatch, posts.status])

    // forming content for the page
    let content
    if(posts.status === 'loading') {
        content = <p>Loading...</p>
    } else if(posts.status === 'failed') {
        content = <p>Error: {posts.error}</p>
    } else if(posts.status === 'succeeded') {
        const activeCategoryIndex = posts.data.findIndex(item => item.categoryId === posts.currentCategory)
        content = posts.data[activeCategoryIndex].posts.map(post => {
            if(posts.currentCategory) return <PostExcerpt key={post.id} category={posts.currentCategory} postId={post.id} />
        })
    }

    return (
        <section className="newsSection">
            <h2>News Posts</h2>
            <SelectCategory activeOption={posts.currentCategory} />
            <ul>
                {content}
            </ul>
        </section>
    )
}

export default PostsList
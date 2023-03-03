import { useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import PostExcerpt from "./PostExcerpt"
import { fetchPosts, selectAllPosts } from "./postsSlice"
import SelectCategory from "./SelectCategory"
import SelectCountry from "./SelectCountry"
import SelectLanguage from "./SelectLanguage"

const PostsList = () => {
    const dispatch = useAppDispatch()
    const posts = useAppSelector(selectAllPosts)
    
    const [searchParams] = useSearchParams()
    const offset = searchParams.get('offset')

    useEffect(() => {
        if(posts.status === 'idle') {
            const fetchRequest = {
                API_URL: import.meta.env.VITE_APP_MEDIASTACK_API_URL,
                limit: posts.pagination.limit,
                offset: offset ? offset : posts.pagination.offset,
                // languages: ,
                // categories: ,
                // sources: ,
                // countries: 
            }

            dispatch(fetchPosts(fetchRequest))
        }
    },[posts.status, posts.pagination.limit, posts.pagination.offset, offset, dispatch])

    let content
    let pagesNavigation
    let controls
    if(posts.status === 'loading') {
        content = <p>Loading...</p>
    } else if(posts.status === 'failed') {
        content = <p>Error: {posts.error}</p>
    } else if(posts.status === 'succeeded') {
        // forming content for the page
        content = posts.posts.map(post => 
            <PostExcerpt key={post.id} postId={post.id} />
        )
        
        const activePage = Number(offset) / posts.pagination.limit
        const pagesTotalNumber = Math.floor(posts.pagination.total / posts.pagination.limit)
        
        const navPageFirst = activePage - 5 >= 0 ? activePage - 5 : 0
        const navPageLast = navPageFirst + 11 <= pagesTotalNumber ? navPageFirst + 11 : pagesTotalNumber

        // forming pages navigation
        pagesNavigation = [...Array(navPageLast - navPageFirst + 1)].map((_item, index) =>
            index + navPageFirst === activePage
            ?<p key={'navPagesActivePage'}>{index + navPageFirst + 1}</p>
            :<Link
                to={`/posts?offset=${(index + navPageFirst) * posts.pagination.limit}`}
                reloadDocument
                key={index}
            >{index + navPageFirst + 1}</Link>
        )

        // forming page navigation controls
        controls = activePage === navPageFirst
            ? <nav>
                <div className="disabled">Previous</div>
                <Link to={`/posts?offset=${posts.pagination.offset + posts.pagination.limit}`} reloadDocument>Next</Link>
            </nav>
            : activePage === navPageLast
                ? <nav>
                    <Link to={`/posts?offset=${posts.pagination.offset - posts.pagination.limit}`} reloadDocument>Previous</Link>
                    <div className="disabled">Next</div>
                </nav>
                : <nav>
                    <Link to={`/posts?offset=${posts.pagination.offset - posts.pagination.limit}`} reloadDocument>Previous</Link>
                    <Link to={`/posts?offset=${posts.pagination.offset + posts.pagination.limit}`} reloadDocument>Next</Link>
                </nav>

        if(navPageFirst > 0) {
            pagesNavigation.unshift(<p key={'pagesNavigationPlugFirst'}>. . .</p>)
            pagesNavigation.unshift(<Link to={'/posts?offset=0'} key={'navPagesLinkToFirstPage'} reloadDocument>First</Link>)
        }
        if(navPageLast < pagesTotalNumber) {
            pagesNavigation.push(<p key={'pagesNavigationPlugLast'}>. . .</p>)
            pagesNavigation.push(<Link to={`/posts?offset=${pagesTotalNumber * posts.pagination.limit}`} key={'navPagesLinkToLastPage'} reloadDocument>Last</Link>)
        }
    }

    return (
        <section className="newsSection">
            <h2>News Posts</h2>
            <section>
                <SelectLanguage />
                <SelectCountry />
                <SelectCategory />
            </section>
            {controls}
            <nav>
                {pagesNavigation}
            </nav>
            <ul>
                {content}
            </ul>
            <nav>
                {pagesNavigation}
            </nav>
        </section>
    )
}

export default PostsList
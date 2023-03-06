import { createAsyncThunk, createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store";
import axios from 'axios'

export type NYTimesSectionsType = 'arts' | 'automobiles' | 'books' | 'business' | 'fashion' | 'food' | 'health' | 'home' | 'insider' | 'magazine' | 'movies' | 'obituaries' | 'opinion' | 'science' | 'sports' | 'technology' | 'theater' | 'travel'; //'nyregion' = New York | 'politics' = U.S. Politics | 'realestate' = Real Estate| 'sundayreview' = Sunday Opinion | 't-magazine' = T Magazine | 'upshot' = The Upshot | 'us' = U.S. News | 'world' = World News

export interface IMultimediaNYTimes {
    url: string;                        // url
    format: string;                     // some NYT format string
    height: number;                     // height of the image
    width: number;                      // width of the image
    caption: string;                    // description
    copyright: string;                  // author
}

interface IPostNYTimes {
    id: string;                         // arbitraty app id
    section: string;                    // section name
    title: string;                      // title of the post
    abstract: string;                   // short description
    url: string;                        // url to the source
    byline: string;                     // author
    published_date: string;             // date of publishing
    multimedia: IMultimediaNYTimes[];   // multimedia array
}

interface IAPIResponse {
    section: NYTimesSectionsType;
    results: IPostNYTimes[];
}

interface ICategoryNYTimes {
    categoryId: NYTimesSectionsType;
    posts: IPostNYTimes[];
}

interface IState {
    data: ICategoryNYTimes[];
    currentCategory: NYTimesSectionsType | undefined;
    status: 'idle' | 'loading' | 'succeeded' | 'failed' | 'init';
    error: string | null;
}

const initialState: IState = {
    data: [],
    currentCategory: undefined,
    status: 'init',
    error: null,
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async ({ API_URL }: { API_URL: string }) => {
    const response = await axios.get(API_URL)
    return response.data
})

const postsSlice = createSlice({
    name: 'posts',
    initialState: initialState,
    reducers: {
        changeStatusToIdle(state) {
            state.status = 'idle'
        },
        createCategory(state, action: PayloadAction<NYTimesSectionsType>) {
            const categoryExists = state.data.filter(item => item.categoryId === action.payload)
            if (categoryExists.length > 0) return
            
            // creating empty category if not found in the store
            state.data.push({
                categoryId: action.payload,
                posts: [],
            })
        },
        changeCurrentCategory(state, action: PayloadAction<NYTimesSectionsType>) {
            state.currentCategory = action.payload
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<IAPIResponse>) => {
                const categoryIndex = state.data.findIndex(newsSection => newsSection.categoryId === action.payload.section.toLocaleLowerCase())
                state.status = 'succeeded'

                const loadedPosts = action.payload.results.map(post => {
                    post.id = nanoid()
                    return post
                })

                state.data[categoryIndex].posts = state.data[categoryIndex].posts.concat(loadedPosts)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message!
            })
    },
})

export const {
    changeStatusToIdle,
    createCategory,
    changeCurrentCategory
} = postsSlice.actions

export default postsSlice.reducer

export const selectAllPosts = (state: RootState) => state.posts
export const selectPostById = (state: RootState, categoryId: NYTimesSectionsType, postId: string) => {
    const categoryIndex = state.posts.data.findIndex(newsSection => newsSection.categoryId === categoryId)
    return state.posts.data[categoryIndex].posts.find(post => post.id === postId)
}
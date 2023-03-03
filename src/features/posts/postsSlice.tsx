import { createAsyncThunk, createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store";
import axios from 'axios'

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
    results: IPostNYTimes[];
}

interface IInitialState {
    posts: IPostNYTimes[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null
}

const initialState: IInitialState = {
    posts: [],
    status: 'idle',
    error: null
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
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<IAPIResponse>) => {
                state.status = 'succeeded'
                console.log(action.payload)
                const loadedPosts = action.payload.results.map(post => {
                    post.id = nanoid()
                    return post
                })

                state.posts = state.posts.concat(loadedPosts)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                console.log(action.error)
                state.error = action.error.message!
            })
    },
})

export const {
    changeStatusToIdle,
} = postsSlice.actions

export default postsSlice.reducer

export const selectAllPosts = (state: RootState) => state.posts
export const selectPostById = (state: RootState, postId: string) => state.posts.posts.find(post => post.id === postId)
import { createAsyncThunk, createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store";
import axios from 'axios'

interface IPost {
    id: string;
    author?: string;
    title: string;
    description: string;
    url: string;
    source: string;
    category: string;
    language: string;
    country: string;
    published_at: string;
}

interface IInitialState {
    posts: IPost[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null
}

const initialState: IInitialState = {
    posts: [],
    status: 'idle',
    error: null
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await axios.get(import.meta.env.VITE_APP_MEDIASTACK_API_URL!)
    return response.data
})

const postsSlice = createSlice({
    name: 'posts',
    initialState: initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<{ data: IPost[] }>) => {
                state.status = 'succeeded'
                const loadedPosts = action.payload.data.map(post => {
                    post.id = nanoid()
                    return post
                })
                state.posts = state.posts.concat(loadedPosts)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message!
            })
    },
})

export default postsSlice.reducer

export const selectAllPosts = (state: RootState) => state.posts
export const selectPostById = (state: RootState, postId: string) => state.posts.posts.find(post => post.id === postId)
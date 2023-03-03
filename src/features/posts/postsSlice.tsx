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

interface IPagination {
    limit: number;
    offset: number;
    count: number;
    total: number;
}

interface IAPIResponse {
    pagination: IPagination;
    data: IPost[];
}

interface IInitialState {
    posts: IPost[];
    pagination: IPagination;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null
}

const initialState: IInitialState = {
    posts: [],
    pagination: {
        limit: 10,
        offset: 0,
        count: 10,
        total: 10
    },
    status: 'idle',
    error: null
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async ({ API_URL, limit, offset }: { API_URL: string, limit: string | number, offset: string | number }) => {
    const FetchURL = API_URL.concat(`&limit=${limit}&offset=${offset}`)
    const response = await axios.get(FetchURL)
    // const response = await fetch(FetchURL).then(response => response.json())
    console.log(response)
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
                const loadedPosts = action.payload.data.map(post => {
                    post.id = nanoid() //TODO Change post.id to Index0
                    return post
                })
                state.pagination.offset = action.payload.pagination.offset
                state.pagination.total = action.payload.pagination.total
                // state.posts = state.posts.concat(loadedPosts)
                state.posts = loadedPosts //TODO append fetched posts
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
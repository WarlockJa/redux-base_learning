import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";

export type NYTimesSectionsType =
  | "arts"
  | "automobiles"
  | "books"
  | "business"
  | "fashion"
  | "food"
  | "health"
  | "home"
  | "insider"
  | "magazine"
  | "movies"
  | "obituaries"
  | "opinion"
  | "science"
  | "sports"
  | "technology"
  | "theater"
  | "travel"
  | "nyregion"
  | "politics"
  | "realestate"
  | "sundayreview"
  | "t-magazine"
  | "upshot"
  | "us"
  | "world";

export interface IMultimediaNYTimes {
  url: string; // url
  format: string; // some NYT format string
  height: number; // height of the image
  width: number; // width of the image
  caption: string; // description
  copyright: string; // author
}

interface IPostNYTimes {
  id: string; // arbitraty app id
  section: string; // section name
  title: string; // title of the post
  abstract: string; // short description
  url: string; // url to the source
  byline: string; // author
  published_date: string; // date of publishing
  multimedia: IMultimediaNYTimes[]; // multimedia array
}

interface IAPIResponse {
  section: NYTimesSectionsType;
  results: IPostNYTimes[];
}

interface ICategoryNYTimes {
  categoryId: NYTimesSectionsType;
  posts: IPostNYTimes[];
}

interface IPostsState {
  data: ICategoryNYTimes[];
  currentCategory: NYTimesSectionsType | undefined;
  timestamp: number | undefined;
  status: "idle" | "loading" | "succeeded" | "failed" | "init";
  error: string | null;
}

// loading data from the localStorage
const localStorage_DP_NYTimes = localStorage.getItem("DP_NYTimes");
const NYTimesLocalData: IPostsState = localStorage_DP_NYTimes
  ? JSON.parse(localStorage_DP_NYTimes)
  : undefined;

const initialState: IPostsState =
  !NYTimesLocalData ||
  !NYTimesLocalData.timestamp ||
  NYTimesLocalData.timestamp + 60 * 60 * 1000 < Date.now()
    ? {
        data: [],
        currentCategory: undefined,
        timestamp: new Date().getTime(),
        status: "init",
        error: null,
      }
    : NYTimesLocalData;

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ API_URL }: { API_URL: string }) => {
    const response = await axios.get(
      API_URL
      // , { headers: { authorization: API_KEY }, }
    );
    return response.data;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: initialState,
  reducers: {
    changeStatusToIdle(state) {
      state.status = "idle";
    },
    changeCurrentCategory(state, action: PayloadAction<NYTimesSectionsType>) {
      state.currentCategory = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchPosts.fulfilled,
        (state, action: PayloadAction<IAPIResponse>) => {
          // adding ids and sorting the result
          const sortedPosts = action.payload.results
            .map((post) => {
              return {
                ...post,
                id: nanoid(),
              };
            })
            .sort((a, b) => b.published_date.localeCompare(a.published_date));

          // adding fetched category to the store
          state.data.push({
            categoryId: state.currentCategory!,
            posts: sortedPosts,
          });

          state.status = "succeeded";

          // saving fetched data to the local store
          localStorage.setItem("DP_NYTimes", JSON.stringify(state));
        }
      )
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message!;
      });
  },
});

export const { changeStatusToIdle, changeCurrentCategory } = postsSlice.actions;

export default postsSlice.reducer;

export const selectAllPosts = (state: RootState) => state.posts;
export const selectPostById = (
  state: RootState,
  categoryId: NYTimesSectionsType,
  postId: string
) => {
  const categoryIndex = state.posts.data.findIndex(
    (newsSection) => newsSection.categoryId === categoryId
  );
  return state.posts.data[categoryIndex].posts.find(
    (post) => post.id === postId
  );
};

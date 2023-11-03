import { useEffect, useLayoutEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ScrollToTopButton, { ScrollToTop } from "../../util/ScrollToTopButton";
import Spinner from "../../util/Spinner";
import PostExcerpt from "./PostExcerpt";
import {
  changeCurrentCategory,
  changeStatusToIdle,
  fetchPosts,
  selectAllPosts,
} from "./postsSlice";
import SelectCategory from "./SelectCategory";
import { categoryList } from "./SelectCategory";
import { useTranslation } from "react-i18next";

const PostsList = () => {
  const { t } = useTranslation();
  const { categoryId } = useParams();
  const posts = useAppSelector(selectAllPosts);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // NY Times topstories categories update at different times
    // setting up an hour timer before a new refetch
    if (posts.timestamp && posts.timestamp + 60 * 60 * 1000 < Date.now()) {
      localStorage.removeItem("DP_NYTimes");
      dispatch(changeStatusToIdle());
    }
  });

  // scrolling to the top on route change
  useLayoutEffect(() => {
    ScrollToTop();
  }, []);

  // remembering active news category and switching to it on route change
  useEffect(() => {
    // checking if url category parameter exists within the Type NYTimesSectionsType
    const categoryTypeExists = categoryList.find(
      (item) => item.id === categoryId
    );

    if (categoryTypeExists && posts.currentCategory !== categoryTypeExists.id) {
      // replacing active category in the store
      dispatch(changeCurrentCategory(categoryTypeExists.id));

      // checking if categoryId exists in the store
      const activeCategoryIndex = posts.data.findIndex(
        (item) => item.categoryId === categoryTypeExists.id
      );
      // category not found
      if (activeCategoryIndex === -1) {
        // initiating data fetch
        dispatch(changeStatusToIdle());
      }
    } else {
      // navigating to stored active category or empty posts page
      posts.currentCategory
        ? navigate(`/posts/${posts.currentCategory}`)
        : navigate(`/posts`);
    }
  }, [categoryId, posts.currentCategory, categoryList, dispatch]);

  // fetching data for the current category
  useEffect(() => {
    // fetching data
    if (posts.status === "idle" && categoryId) {
      const fetchRequest = {
        API_URL: import.meta.env.VITE_APP_NYTIMES_API_URL.replace(
          "FILENAME",
          categoryId
        ).concat(import.meta.env.VITE_APP_NYTIMES_API_KEY),
      };

      console.log("Fetching news category");
      dispatch(fetchPosts(fetchRequest));
    }
  }, [dispatch, posts.status, categoryId]);

  // forming content for the page
  let content;
  if (posts.status === "loading") {
    content = (
      <>
        <Spinner embed={false} height="12em" width="100%" />
        <Spinner embed={false} height="12em" width="100%" />
        <Spinner embed={false} height="12em" width="100%" />
        <Spinner embed={false} height="12em" width="100%" />
        <Spinner embed={false} height="12em" width="100%" />
      </>
    );
  } else if (posts.status === "failed") {
    content = <p>Error: {posts.error}</p>;
  } else if (posts.status === "succeeded") {
    const activeCategoryIndex = posts.data.findIndex(
      (item) => item.categoryId === posts.currentCategory
    );
    content = posts.data[activeCategoryIndex].posts.map((post) => {
      if (posts.currentCategory)
        return (
          <PostExcerpt
            key={post.id}
            category={posts.currentCategory}
            postId={post.id}
          />
        );
    });
  }

  return (
    <section className="newsSection">
      <h2>{t("news")}</h2>
      <SelectCategory activeOption={posts.currentCategory} />
      <ul>{content}</ul>
      <ScrollToTopButton />
    </section>
  );
};

export default PostsList;

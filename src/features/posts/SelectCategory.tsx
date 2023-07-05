import { useNavigate } from "react-router-dom";
import { NYTimesSectionsType } from "./postsSlice";
import { useTranslation } from "react-i18next";

interface ICategoryList {
  id: NYTimesSectionsType;
}

export const categoryList: ICategoryList[] = [
  { id: "arts" },
  { id: "automobiles" },
  { id: "books" },
  { id: "business" },
  { id: "fashion" },
  { id: "food" },
  { id: "health" },
  { id: "home" },
  { id: "insider" },
  { id: "magazine" },
  { id: "movies" },
  { id: "obituaries" },
  { id: "opinion" },
  { id: "science" },
  { id: "sports" },
  { id: "technology" },
  { id: "theater" },
  { id: "travel" },
  { id: "nyregion" },
  { id: "politics" },
  { id: "realestate" },
  { id: "sundayreview" },
  { id: "t-magazine" },
  { id: "upshot" },
  { id: "us" },
  { id: "world" },
];

const SelectCategory = ({
  activeOption,
}: {
  activeOption: NYTimesSectionsType | undefined;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <nav>
      <label htmlFor="selectCategory">{t("category")}</label>
      <select
        id="selectCategory"
        value={activeOption ? activeOption : t("select_category")!}
        onChange={(e) => {
          navigate(`/posts/${e.target.value}`);
        }}
      >
        <option disabled>{t("select_category")}</option>
        {categoryList.map((item) => (
          <option key={"categories" + item.id} value={item.id}>
            {t(item.id)}
          </option>
        ))}
      </select>
    </nav>
  );
};

export default SelectCategory;

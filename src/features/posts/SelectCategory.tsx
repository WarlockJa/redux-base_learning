import { useNavigate } from "react-router-dom"
import { NYTimesSectionsType } from "./postsSlice"

interface ICategoryList {
    name: string;
    id: NYTimesSectionsType;
}

export const categoryList: ICategoryList[] = [
    { name: 'Arts', id: 'arts' },
    { name: 'Automobiles', id: 'automobiles' },
    { name: 'Books', id: 'books' },
    { name: 'Business', id: 'business' },
    { name: 'Fashion', id: 'fashion' },
    { name: 'Food', id: 'food' },
    { name: 'Health', id: 'health' },
    { name: 'Home', id: 'home' },
    { name: 'Insider', id: 'insider' },
    { name: 'Magazine', id: 'magazine' },
    { name: 'Movies', id: 'movies' },
    { name: 'Obituaries', id: 'obituaries' },
    { name: 'Opinion', id: 'opinion' },
    { name: 'Science', id: 'science' },
    { name: 'Sports', id: 'sports' },
    { name: 'Technology', id: 'technology' },
    { name: 'Theater', id: 'theater' },
    { name: 'Travel', id: 'travel' },
    // { name: 'New York', id: 'nyregion' },
    // { name: 'U.S. Politics', id: 'politics' },
    // { name: 'Real Estate', id: 'realestate' },
    // { name: 'Sunday Opinion', id: 'sundayreview' },
    // { name: 'T Magazine', id: 't-magazine' },
    // { name: 'The Upshot', id: 'upshot' },
    // { name: 'U.S. News', id: 'us' },
    // { name: 'World News', id: 'world' },
]

const findOptionId = (value: string) => {
    const selectedCategory = categoryList.filter(category => category.name === value)
    return selectedCategory[0].id
}

const findIdOption = (value: string) => {
    const selectedCategory = categoryList.filter(category => category.id === value)
    return selectedCategory[0].name
}

const SelectCategory = ({ activeOption }: { activeOption: NYTimesSectionsType | undefined }) => {
    const navigate = useNavigate()
    return (
        <nav>
            <label htmlFor="selectCategory">Category</label>
            <select id="selectCategory" value={activeOption ? findIdOption(activeOption) : "Select Category"} onChange={(e) => navigate(`/posts/${findOptionId(e.target.value)}`)}>
                <option disabled>Select Category</option>
                {categoryList.map(item => <option key={'categories' + item.id}>{item.name}</option>)}
            </select>
        </nav>
    )
}

export default SelectCategory
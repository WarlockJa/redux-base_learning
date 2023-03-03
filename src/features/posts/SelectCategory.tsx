export const categoryList = [
    { category: 'arts' },
    { category: 'automobiles' },
    { category: 'books' },
    { category: 'business' },
    { category: 'fashion' },
    { category: 'food' },
    { category: 'health' },
    { category: 'home' },
    { category: 'insider' },
    { category: 'magazine' },
    { category: 'movies' },
    { category: 'nyregion' },
    { category: 'obituaries' },
    { category: 'opinion' },
    { category: 'politics' },
    { category: 'realestate' },
    { category: 'science' },
    { category: 'sports' },
    { category: 'sundayreview' },
    { category: 'technology' },
    { category: 'theater' },
    { category: 't-magazine' },
    { category: 'travel' },
    { category: 'upshot' },
    { category: 'us' },
    { category: 'world' },
]

const SelectCategory = () => {
    return (
        <nav>
            <label htmlFor="selectCategory">Category</label>
            <select id="selectCategory">
                {categoryList.map(item => <option key={item.category}>{item.category}</option>)}
            </select>
        </nav>
    )
}

export default SelectCategory
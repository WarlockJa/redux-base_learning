export const categoryList = [
    { category: 'Uncategorized News', code: 'general'},
    { category: 'Business News', code: 'business'},
    { category: 'Entertainment News', code: 'entertainment'},
    { category: 'Health News', code: 'health'},
    { category: 'Science News', code: 'science'},
    { category: 'Sports News', code: 'sports'},
    { category: 'Technology News', code: 'technology'},
]

const SelectCategory = () => {
    return (
        <article>
            <label htmlFor="selectCategory">Category</label>
            <select id="selectCategory">
                {categoryList.map(item => <option key={item.code}>{item.category}</option>)}
            </select>
        </article>
    )
}

export default SelectCategory
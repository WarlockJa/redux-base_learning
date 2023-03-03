export const languagesList = [
    { lng: 'English', code: 'en'},
    { lng: 'Arabic', code: 'ar'},
    { lng: 'German', code: 'de'},
    { lng: 'Spanish', code: 'es'},
    { lng: 'French', code: 'fr'},
    { lng: 'Hebrew', code: 'he'},
    { lng: 'Italian', code: 'it'},
    { lng: 'Dutch', code: 'nl'},
    { lng: 'Norwegian', code: 'no'},
    { lng: 'Portuguese', code: 'pt'},
    { lng: 'Russian', code: 'ru'},
    { lng: 'Swedish', code: 'se'},
    { lng: 'Chinese', code: 'zh'},
]

const SelectLanguage = () => {
    return (
        <article>
            <label htmlFor="selectLanguage">Language</label>
            <select id="selectLanguage">
                {languagesList.map(item => <option key={item.code}>{item.lng}</option>)}
            </select>
        </article>
    )
}

export default SelectLanguage
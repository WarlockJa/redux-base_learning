// language switcher component
// exports a list of languages with i18n locale change on select
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next"

interface Ilangauges {
    [lng: string]: {
        nativeName: string;
        name: string;
    }
}

// available languages
const languages: Ilangauges = {
    ru: { nativeName: 'Русский', name: 'Russian' },
    en: { nativeName: 'English', name: 'English' },
}
// forming options list fomr languages
const lngOptions = Object.entries(languages).map((entry, index) => (
    <option key={index} value={entry[1].nativeName}>{entry[1].nativeName}</option>
))

const LangugeSwitcher = () => {
    const { i18n } = useTranslation()

    // switching languages on item select
    const switchLangauge = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = Object.keys(languages).find(lng => languages[lng].nativeName === event.target.value)
        i18n.changeLanguage(selectedValue)
    }

    return (
        <select
            defaultValue={languages[i18n.resolvedLanguage].nativeName} // default value is currently active locale
            onChange={(e) => switchLangauge(e)}
        >
            {lngOptions}
        </select>
    )
}

export default LangugeSwitcher
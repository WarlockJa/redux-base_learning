// language switcher component
// exports a list of languages with i18n locale change on select
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectCurrentToken, selectUserData, setIdToken } from "../features/api/auth/authSlice";
import { useUpdateUserMutation } from "../features/api/user/userApiSlice";

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

const LanguageSwitcher = ({ fullDescription }: { fullDescription: boolean; }) => {
    const { i18n } = useTranslation()
    // store data
    const idToken = useAppSelector(selectUserData)
    const accessToken = useAppSelector(selectCurrentToken)
    const dispatch = useAppDispatch()
    const [updateUser] = useUpdateUserMutation()

    // forming options list fomr languages
    const lngOptions = Object.entries(languages).map((entry, index) => (
        <option key={index} value={entry[1].nativeName}>{fullDescription ? entry[1].nativeName : entry[0]}</option>
    ))

    // switching languages on item select
    const switchLanguage = async (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = Object.keys(languages).find(lng => languages[lng].nativeName === event.target.value)
        i18n.changeLanguage(selectedValue)
        // changing idtoken locale in store
        dispatch(setIdToken({ idToken: { ...idToken, locale: selectedValue ? selectedValue : 'en' } }))
        // updating user locale in DB if accessToken present(user logged in)
        if(accessToken) {
            const result = await updateUser({ locale: selectedValue }).unwrap()
            if(result.status !== 200) console.log(result)
        }
    }

    return (
        <select
            value={languages[i18n.language.split(/-|_/)[0]].nativeName}
            onChange={(e) => switchLanguage(e)}
        >
            {lngOptions}
        </select>
    )
}

export default LanguageSwitcher
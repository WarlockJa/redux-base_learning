import './preferences.css'
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectUserData, setIdToken } from "../../features/api/auth/authSlice"
import collapsingMenu from './collapsingMenu'
import { useState } from 'react'
import AvatarCropping from './AvatarCropping'
import userPreferencesForm from './userPreferencesForm'
import { useUpdateUserMutation } from '../../features/api/user/userApiSlice'

const Preferences = () => {
    // user data from the store
    const idToken = useAppSelector(selectUserData)
    const dispatch = useAppDispatch()
    // update user data in DB
    const [updateUser] = useUpdateUserMutation()
    // default settings for the collapsing menus
    const DEFAULT_HEADER_OFFSET = 32

    // avatar state, holds avatar Blob data for the AvatarCropping component
    // setAvatarFile passed to userPreferencesForm for code splitting purposes
    const [avatarFile, setAvatarFile] = useState<File>()
    // loading flag for avatar cropping
    // const [avatarIsCropping, setAvatarIsCropping] = useState(false)

    const handleUpdateAvatar = async (avatar: string) => {
        // setAvatarIsCropping(true)
        dispatch(setIdToken({ idToken: { ...idToken, picture: avatar } }))
        // updating user avatar in DB if accessToken present(user logged in)
        const result = await updateUser({ picture: avatar }).unwrap()
        result.status !== 200 ? console.log(result) : setAvatarFile(undefined)
        // if(result.status !== 200) {
        //     console.log(result)
        // } else {
        //     setAvatarFile(undefined)
        //     setAvatarIsCropping(false)
        // }
    }

    // Cascading collapsing menus. Eachs section returns JSX element and its current height in px
    // Sum of previous elements heights is used to calculate offset for each subsequent menu item
    // wrapping user preferences form in a collapsing menu function
    const userPreferences = collapsingMenu({
        defaultHeaderOffset: DEFAULT_HEADER_OFFSET,
        headerContent: 'User Preferences',
        headerTitle: 'Open/close user preferences menu',
        // invoking userPreferencesForm and passing setAvatarFile method to it
        formContent: userPreferencesForm(setAvatarFile),
        // offset is 0 as it is the first menu
        verticalOffset: 0
    })

    // generating widgets preferences menu form
    const widgetPreferencesForm = <form>
        <p>{idToken.name}</p>
    </form>

    // wrapping widgets form in a collapsing menu function
    const widgetPreferences = collapsingMenu({
        defaultHeaderOffset: DEFAULT_HEADER_OFFSET,
        headerContent: 'Widget Preferences',
        headerTitle: 'Open/close widget preferences menu',
        formContent: widgetPreferencesForm,
        verticalOffset: userPreferences.currentHeight
    })

    return (
        <section>
            {avatarFile && <AvatarCropping
                imageFile={avatarFile}
                cancelEdit={() => setAvatarFile(undefined)}
                acceptEdit={(avatar: string) => handleUpdateAvatar(avatar)}
            />}
            {userPreferences.menuItem}
            {widgetPreferences.menuItem}
        </section>
    )
}

export default Preferences
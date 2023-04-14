import Toggle from 'react-toggle'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { selectCurrentToken, selectUserData, setIdToken } from '../features/api/auth/authSlice'
import { useUpdateUserMutation } from '../features/api/user/userApiSlice'


const SwitchDarkMode = () => {
    const idToken = useAppSelector(selectUserData)
    const accessToken = useAppSelector(selectCurrentToken)
    const dispatch = useAppDispatch()
    const [updateUser] = useUpdateUserMutation()
    
    const handleUserDarkModeUpdate = async () => {
        // changing idtoken darkmode in store
        dispatch(setIdToken({ idToken: { ...idToken, darkmode: !idToken.darkmode } }))
        // updating darkmode user data in DB if accessToken present(user logged in)
        if(accessToken) {
            const result = await updateUser({ darkmode: !idToken.darkmode }).unwrap()
            if(result.status !== 200) console.log(result)
        }
    }

    return (
        <label>
            <Toggle
                checked={!idToken.darkmode}
                icons={{
                    checked: '☀️',
                    unchecked: '🌙'
                }}
                onChange={() => handleUserDarkModeUpdate()}
            />
        </label>
    )
}

export default SwitchDarkMode
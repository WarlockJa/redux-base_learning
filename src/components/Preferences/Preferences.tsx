import "./preferences.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  logOut,
  selectUserData,
  setIdToken,
} from "../../features/api/auth/authSlice";
import collapsingMenu from "./collapsingMenu";
import { useState } from "react";
import AvatarCropping from "./AvatarCropping";
import userPreferencesForm from "./userPreferencesForm";
import {
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../features/api/user/userApiSlice";
import DeleteUserConfirm from "./DeleteUserConfirm";
import { apiSlice } from "../../features/api/apiSlice";
import { useTranslation } from "react-i18next";
import Spinner from "../../util/Spinner";
import WidgetPreferencesForm from "./WidgetPreferencesForm";
import {
  selectPreferences,
  setUserMenu,
  setWidgetMenu,
} from "./preferencesSlice";

const Preferences = () => {
  // i18next
  const { i18n, t } = useTranslation();
  // user data from the store
  const idToken = useAppSelector(selectUserData);
  const dispatch = useAppDispatch();
  const preferences = useAppSelector(selectPreferences);
  // apiSlice methods
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isLoadingDeleteUser }] =
    useDeleteUserMutation();
  // default settings for the collapsing menus
  const DEFAULT_HEADER_OFFSET = 32;

  // avatar state, holds avatar Blob data for the AvatarCropping component
  // setAvatarFile passed to userPreferencesForm for code splitting purposes
  const [avatarFile, setAvatarFile] = useState<File>();

  // success method passed to the AvatarCropping component
  // saves cropped image to the store and DB
  const handleUpdateAvatar = async (avatar: string) => {
    dispatch(setIdToken({ idToken: { ...idToken, picture: avatar } }));
    // updating user avatar in DB if accessToken present(user logged in)
    const result = await updateUser({ picture: avatar }).unwrap();
    result.status !== 200 ? console.log(result) : setAvatarFile(undefined);
  };

  // delete account confirmation and execution
  const [showDeleteUserWarning, setShowDeleteUserWarning] = useState(false);
  // handle delete user
  const handleDeleteUser = async () => {
    const result = await deleteUser({}).unwrap();
    if (result.status === 200 || result.status === 204) {
      // clearing out user store data
      dispatch(logOut());
      // changing locale to browser default
      i18n.changeLanguage(navigator.language);
      // resetting apiSlice todos data
      dispatch(apiSlice.util.resetApiState());
    }
  };
  // getting confirmation from delete user popup
  const handleUserDeleteConfirm = (res: boolean) => {
    if (res) handleDeleteUser();
    setShowDeleteUserWarning(false);
  };

  // Cascading collapsing menus. Eachs section returns JSX element and its current height in px
  // Sum of previous elements heights is used to calculate offset for each subsequent menu item

  // wrapping widgets form in a collapsing menu function
  const widgetPreferences = collapsingMenu({
    defaultHeaderOffset: DEFAULT_HEADER_OFFSET,
    headerContent: t("header_widget"),
    headerTitle: t("header_widget_title"),
    menuState: preferences.widgetMenu,
    menuSwitch: setWidgetMenu,
    formContent: <WidgetPreferencesForm />,
    // offset is 0 as it is the first menu
    verticalOffset: 0,
  });

  // wrapping user preferences form in a collapsing menu function
  const userPreferences = collapsingMenu({
    defaultHeaderOffset: DEFAULT_HEADER_OFFSET,
    headerContent: t("header_user"),
    headerTitle: t("header_user_title"),
    // invoking userPreferencesForm and passing setAvatarFile method to it
    formContent: userPreferencesForm(setAvatarFile, setShowDeleteUserWarning),
    menuState: preferences.userMenu,
    menuSwitch: setUserMenu,
    verticalOffset: widgetPreferences.currentHeight,
  });

  return isLoadingDeleteUser ? (
    <Spinner embed={false} width="100%" height="95vh" />
  ) : (
    <section className="preferences">
      {avatarFile && (
        <AvatarCropping
          imageFile={avatarFile}
          cancelEdit={() => setAvatarFile(undefined)}
          acceptEdit={(avatar: string) => handleUpdateAvatar(avatar)}
        />
      )}
      {showDeleteUserWarning && (
        <DeleteUserConfirm
          callback={(res: boolean) => handleUserDeleteConfirm(res)}
          t={t}
        />
      )}
      {widgetPreferences.menuItem}
      {userPreferences.menuItem}
    </section>
  );
};

export default Preferences;

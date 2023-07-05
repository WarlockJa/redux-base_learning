import classNames from "classnames";
import {
  useDeleteUserMutation,
  useSendConfirmEmailMutation,
  useUpdateUserMutation,
} from "../../features/api/user/userApiSlice";
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUserData, setIdToken } from "../../features/api/auth/authSlice";
import Icons from "../../assets/Icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faCheck,
  faEdit,
  faTrashAlt,
} from "@fortawesome/fontawesome-free-solid";
import LanguageSwitcher from "../../util/LanguageSwitcher";
import SwitchDarkMode from "../../util/SwitchDarkMode";
import ResendEmail from "../../util/ResendEmail";

const userPreferencesForm = (
  setAvatarFile: Dispatch<SetStateAction<File | undefined>>,
  setShowDeleteUserWarning: Dispatch<SetStateAction<boolean>>
) => {
  // i18next
  const { t } = useTranslation();
  // user data from the store
  const idToken = useAppSelector(selectUserData);
  const dispatch = useAppDispatch();
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();
  // user name states
  const [userName, setUserName] = useState<string>(
    idToken.name ? idToken.name : ""
  );
  const [userNameEdit, setUserNameEdit] = useState(false);
  const [userNameIfCancelEdit, setUserNameIfCancelEdit] = useState<string>("");
  // user surname states
  const [userSurname, setUserSurname] = useState<string | null>(
    idToken.surname
  );
  const [userSurnameEdit, setUserSurnameEdit] = useState(false);
  const [userSurnameIfCancelEdit, setUserSurnameIfCancelEdit] = useState<
    string | null
  >(idToken.surname);
  // user email states
  const [userEmail, setUserEmail] = useState(idToken.email);
  const [userEmailEdit, setUserEmailEdit] = useState(false);
  // user password states
  const [userPasswordChangeFormState, setUserPasswordChangeFormState] =
    useState(false);
  // user image states
  const [avatarHovered, setAvatarHovered] = useState(false);

  // exiting user name editing mode on Enter or Esc clicked
  const handleUserNameKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ): Promise<void> => {
    if (event.key === "Enter") {
      if (userName) {
        setUserNameEdit(false);
        const result = await updateUser({ name: userName }).unwrap();
        const newIdToken = {
          ...idToken,
          name: userName,
        };
        if (result.status === 200) {
          dispatch(setIdToken({ idToken: newIdToken }));
        } else {
          console.log(result);
        }
      }
    } else if (event.key === "Escape") {
      setUserNameEdit(false);
      setUserName(userNameIfCancelEdit);
    }
  };

  // exiting user surname editing mode on Enter or Esc clicked
  const handleUserSurnameKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ): Promise<void> => {
    if (event.key === "Enter") {
      setUserSurnameEdit(false);
      const result = await updateUser({ surname: userSurname }).unwrap();
      const newIdToken = {
        ...idToken,
        surname: userSurname,
      };
      if (result.status === 200) {
        dispatch(setIdToken({ idToken: newIdToken }));
      } else {
        console.log(result);
      }
    } else if (event.key === "Escape") {
      setUserSurnameEdit(false);
      setUserSurname(userSurnameIfCancelEdit);
    }
  };

  // confirming that name is not empty on userName input focus lost event. Restoring saved value if so
  const handleUserNameBlur = () => {
    if (userName === "") {
      setUserName(userNameIfCancelEdit);
    }
    setUserNameEdit(false);
  };

  // edit user name click handler
  const handleUserNameEditClick = () => {
    setUserNameEdit(true);
    setUserNameIfCancelEdit(userName);
  };

  // edit user surname click handler
  const handleUserSurnameEditClick = () => {
    setUserSurnameEdit(true);
    setUserSurnameIfCancelEdit(userSurname);
  };

  // disabling default form submit event
  const handleFormSubmit = (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();
  };

  // handle avatar change
  const avatarRef = useRef<HTMLInputElement | null>(null);
  // invoking input type file method to let user choose image file
  const handleAvatarChange = () => {
    avatarRef.current?.click();
  };

  // passing image file as File to the avatarFile state
  // state is located in Preferences so it can be used by AvatarCropping component
  const handleAvatarFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAvatarFile(e.target.files[0]);
    }
  };

  return (
    <div
      onSubmit={(e) => handleFormSubmit(e)}
      className={classNames("preferencesItem__userForm formLike", {
        translucent: isLoading,
      })}
    >
      <div className="preferencesItem__userForm--editBlock">
        {idToken.picture ? (
          <div
            onMouseEnter={() => setAvatarHovered(true)}
            onMouseLeave={() => setAvatarHovered(false)}
          >
            <img
              className="preferencesItem__userForm--avatar"
              src={idToken.picture}
              alt={t("user_avatar")!}
            />
          </div>
        ) : (
          <div
            onMouseEnter={() => setAvatarHovered(true)}
            onMouseLeave={() => setAvatarHovered(false)}
          >
            <Icons.Person className="preferencesItem__userForm--avatar" />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          ref={avatarRef}
          className="undisplayed"
          onChange={(e) => handleAvatarFileChange(e)}
        />
        <div
          className={classNames("preferencesItem__userForm__avatar--editIcon", {
            undisplayed: !avatarHovered,
          })}
          onMouseEnter={() => setAvatarHovered(true)}
          onMouseLeave={() => setAvatarHovered(false)}
          onClick={() => handleAvatarChange()}
        >
          <FontAwesomeIcon
            title={t("user_changeAvatar")!}
            icon={faEdit as IconProp}
          />
        </div>
      </div>
      {userNameEdit ? (
        <input
          type="text"
          autoFocus
          className={classNames({ invalid: userName === "" })}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onBlur={() => handleUserNameBlur()}
          onKeyDown={(e) => handleUserNameKeyDown(e)}
          maxLength={254}
        ></input>
      ) : (
        <div className="preferencesItem__userForm--editBlock">
          <p className="preferencesItem__userForm--p">{userName}</p>
          <button
            type="button"
            className="preferencesItem__userForm--editButton"
            onClick={() => handleUserNameEditClick()}
            title={t("user_edit")!}
          >
            · · ·
          </button>
        </div>
      )}
      {userSurnameEdit ? (
        <input
          type="text"
          autoFocus
          value={userSurname ? userSurname : ""}
          onChange={(e) => setUserSurname(e.target.value)}
          onBlur={() => setUserSurnameEdit(false)}
          onKeyDown={(e) => handleUserSurnameKeyDown(e)}
          maxLength={254}
        ></input>
      ) : userSurname ? (
        <div className="preferencesItem__userForm--editBlock">
          <p className="preferencesItem__userForm--p">{userSurname}</p>
          <button
            type="button"
            className="preferencesItem__userForm--editButton"
            onClick={() => handleUserSurnameEditClick()}
            title={t("user_edit")!}
          >
            · · ·
          </button>
        </div>
      ) : (
        <div className="preferencesItem__userForm--editBlock">
          <p className="preferencesItem__userForm--p emptyField">
            {t("user_surname")}
          </p>
          <button
            type="button"
            className="preferencesItem__userForm--editButton"
            onClick={() => handleUserSurnameEditClick()}
            title={t("user_edit")!}
          >
            · · ·
          </button>
        </div>
      )}
      <div className="preferencesItem__userForm--email">
        <p
          title={
            idToken.email_confirmed
              ? t("user_emailVerified")!
              : t("user_emailUnverified")!
          }
          className={"preferencesItem__userForm--p ".concat(
            idToken.email_confirmed ? "font-positive" : "font-negative"
          )}
        >
          {idToken.email}
        </p>
        {idToken.email_confirmed ? (
          <FontAwesomeIcon
            title={t("user_emailVerified")!}
            icon={faCheck as IconProp}
          />
        ) : (
          <ResendEmail />
        )}
      </div>
      <div className="preferencesItem__userForm--editBlock">
        <p className="preferencesItem__userForm--p">{t("user_colorScheme")}:</p>
        <SwitchDarkMode disabled={false} />
      </div>
      <div className="preferencesItem__userForm--editBlock">
        <p>{t("user_locale")}</p>
        <LanguageSwitcher fullDescription={true} disabled={false} />
      </div>
      <div className="preferencesItem__userForm--userDeleteBlock">
        <button
          title={t("user_delete")!}
          aria-label={t("user_delete")!}
          className="preferencesItem__userForm--deleteButton"
          onClick={() => setShowDeleteUserWarning(true)}
        >
          <FontAwesomeIcon icon={faTrashAlt as IconProp} />
        </button>
      </div>
    </div>
  );
};

export default userPreferencesForm;

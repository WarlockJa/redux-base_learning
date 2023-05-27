import "./usermenu.css";
import classNames from "classnames";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { apiSlice } from "../../features/api/apiSlice";
import { logOut, selectUserData } from "../../features/api/auth/authSlice";
import Spinner from "../../util/Spinner";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/fontawesome-free-solid";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import LineBreak from "../../util/LineBreak";
import "../../util/react-toggle.css";
import { useLogoutMutation } from "../../features/api/user/userApiSlice";
import { useTranslation } from "react-i18next";
import SwitchDarkMode from "../../util/SwitchDarkMode";
import LanguageSwitcher from "../../util/LanguageSwitcher";
import { setUserMenu } from "../Preferences/preferencesSlice";

const AuthorizedUserMenu = () => {
  // i18next
  const { i18n } = useTranslation();
  // logout api call
  const [logout, { isLoading }] = useLogoutMutation();
  // user data from the store
  const idToken = useAppSelector(selectUserData);
  // menu hidden state
  const [hidden, setHidden] = useState(true);
  const dispatch = useAppDispatch();
  // react-router-dom navigate to different route
  const navigate = useNavigate();

  // closing sign in menu on overlay click and hiding sign in cover
  const handleOverlayClick = () => {
    setHidden(true);
  };

  const handleLogout = async () => {
    // removing refresh token from the DB and issuing expired httpOnly cookie to the client from the backend
    logout && (await logout(null).unwrap());
    // clearing out user store data
    dispatch(logOut());
    // changing locale to browser default
    i18n.changeLanguage(navigator.language);
    // resetting apiSlice todos data
    dispatch(apiSlice.util.resetApiState());
  };

  // processing preferences menu selected and pressed by keyboard navigation
  const handlePreferencesButtonClick = () => {
    setHidden(true);
    dispatch(setUserMenu(true));
    navigate("/preferences");
  };

  return isLoading ? (
    <Spinner embed={false} width="5em" height="2em" />
  ) : (
    <>
      <button
        className="userMenu--button"
        onClick={() => setHidden((prev) => !prev)}
      >
        {idToken.name}
      </button>
      <div
        className={classNames(
          "headerMenu__dropMenu--wrapper formLike userMenu",
          { dropMenuHidden: hidden }
        )}
      >
        <button
          disabled={hidden}
          className="buttonWrapper"
          onClick={() => handlePreferencesButtonClick()}
        >
          <Link
            tabIndex={-1}
            className="headerMenu__dropMenu--menuItem"
            onClick={() => setHidden(true)}
            to="/preferences"
          >
            Preferences <FontAwesomeIcon icon={faEdit as IconProp} />
          </Link>
        </button>
        <LineBreak />
        <div className="headerMenu__dropMenu--menuItem">
          <p className="headerMenu__dropMenu__menuItem--p">Color scheme:</p>
          <SwitchDarkMode disabled={hidden} />
        </div>
        <div className="headerMenu__dropMenu--menuItem">
          <p className="headerMenu__dropMenu__menuItem--p">Locale</p>
          <LanguageSwitcher fullDescription={true} disabled={hidden} />
        </div>
        <LineBreak />
        <button
          disabled={hidden}
          className="headerMenu__dropMenu--logoutButton"
          onClick={() => handleLogout()}
        >
          Logout
        </button>
      </div>
      {!hidden && (
        <div
          className="headerMenu--overlay"
          onClick={() => handleOverlayClick()}
        ></div>
      )}
    </>
  );
};

export default AuthorizedUserMenu;

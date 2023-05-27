import "./header.css";
import { NavLink } from "react-router-dom";
import SignIn from "./SignIn";
import { useEffect } from "react";
import AuthorizedUserMenu from "./AuthorizedUserMenu";
import {
  useGLoginMutation,
  useLoginMutation,
  useReauthMutation,
} from "../../features/api/auth/authApiSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  IDBAuth,
  selectCurrentToken,
  selectUserData,
  setCredentials,
} from "../../features/api/auth/authSlice";
import Spinner from "../../util/Spinner";
import SwitchDarkMode from "../../util/SwitchDarkMode";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../util/LanguageSwitcher";

interface IReauthResponse {
  data: IDBAuth;
  status: number;
}

const Header = () => {
  // autologin with existing refreshtoken on page reload
  const [reauth, { isLoading: isLoadingReauth }] = useReauthMutation();
  // login api call
  const [
    login,
    { isLoading: isLoadingLogin, isError: isErrorLogin, error: errorLogin },
  ] = useLoginMutation();
  // google api login call
  const [
    gLogin,
    { isLoading: isLoadingGLogin, isError: isErrorGLogin, error: errorGLogin },
  ] = useGLoginMutation();
  // store data
  const accessToken = useAppSelector(selectCurrentToken);
  const idToken = useAppSelector(selectUserData);
  // i18n translation hook
  const { t, i18n } = useTranslation(["header"]);

  const dispatch = useAppDispatch();

  // relogin user upon page reaload with stored httpOnly refresh token cookie
  useEffect(() => {
    const handleUserReauth = async () => {
      const reauthData: IReauthResponse = await reauth(null).unwrap();
      if (reauthData.status === 200) {
        // widgets array is stored in DB as JSON.stringify
        // transforming widgets string from DB back into an array
        const widgetsArray = reauthData.data.idToken.widgets
          ? JSON.parse(reauthData.data.idToken.widgets)
          : [];

        dispatch(
          setCredentials({
            accessToken: reauthData.data.accessToken,
            idToken: { ...reauthData.data.idToken, widgets: widgetsArray },
          })
        );
        i18n.changeLanguage(reauthData.data.idToken.locale);
      }
    };

    handleUserReauth();

    return () => {};
  }, []);

  // toggle light/dark mode according to user prefrences
  useEffect(() => {
    if (idToken) {
      idToken.darkmode
        ? document.body.classList.add("dark-theme")
        : document.body.classList.remove("dark-theme");
    }
  }, [idToken.darkmode]);

  let authContent;
  // header menu spinner on loggin out and auto relog
  if (isLoadingReauth) {
    authContent = <Spinner embed={false} width="5em" height="2em" />;
    // user menu on successful login
  } else if (accessToken) {
    authContent = <AuthorizedUserMenu />;
    // sign in menu in other cases
  } else {
    authContent = (
      <>
        <SignIn
          login={{
            login,
            isLoading: isLoadingLogin,
            isError: isErrorLogin,
            error: errorLogin,
          }}
          gLogin={{
            gLogin,
            isLoading: isLoadingGLogin,
            isError: isErrorGLogin,
            error: errorGLogin,
          }}
        />
      </>
    );
  }

  return (
    <section className="header">
      <nav className="header__nav">
        <NavLink to="/">{t("home")}</NavLink>
        <NavLink to="posts">{t("news")}</NavLink>
        {accessToken && <NavLink to="todos">{t("todos")}</NavLink>}
      </nav>
      <div className="header__loginSection">
        <div
          className={
            accessToken ? "undisplayed" : "header__loginSection--globalSettings"
          }
        >
          <LanguageSwitcher fullDescription={false} disabled={false} />
          <SwitchDarkMode disabled={false} />
        </div>
        {authContent}
      </div>
    </section>
  );
};

export default Header;

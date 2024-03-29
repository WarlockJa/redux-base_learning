import "./headerMenu.css";
import { useGoogleLogin } from "@react-oauth/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useRef, useState } from "react";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import {
  faArrowAltCircleDown,
  faArrowAltCircleUp,
} from "@fortawesome/fontawesome-free-solid";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { IRTKQuery, isApiAuthError } from "../../features/api/apiSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  IDBAuth,
  selectUserData,
  setCredentials,
} from "../../features/api/auth/authSlice";
import Spinner from "../../util/Spinner";
import LineBreak from "../../util/LineBreak";
import { useTranslation } from "react-i18next";
import { useResetPasswordMutation } from "../../features/api/auth/authApiSlice";

const SignIn = ({ login, gLogin }: { login: IRTKQuery; gLogin: IRTKQuery }) => {
  // i18next hook
  const { t, i18n } = useTranslation();
  // react-router-dom navigate to different route
  const navigate = useNavigate();
  // flag for hiding sign in and options menus
  const [hidden, setHidden] = useState(true);
  // flag for showing/hiding sign in and options menu messages
  const [signInCoverVisible, setSignInCoverVisible] = useState(true);
  // sign in authorization data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // redux store methods to store user data
  const dispatch = useAppDispatch();
  const idToken = useAppSelector(selectUserData);
  // display password recovery options on incorrect pass input
  const [forgotPass, setForgotPass] = useState(false);
  const [resetPassOverlay, setResetPassOverlay] = useState(false);
  const [resetPassword, { isLoading, isError, error, isSuccess }] =
    useResetPasswordMutation();
  // reattaching focus to the sign in menu on error cover close
  const formPassRef = useRef<HTMLInputElement>(null);
  const formEmailRef = useRef<HTMLInputElement>(null);
  const handleErrorClick = () => {
    setSignInCoverVisible(false);
    // verifying that error is from the API by checking its type. If so focusing appropriate fields based on error message
    if (
      isApiAuthError(login.error) &&
      login.error.data.message === "password_incorrect"
    ) {
      formPassRef.current && formPassRef.current.focus();
      setForgotPass(true);
    } else {
      formEmailRef.current && formEmailRef.current.focus();
    }
  };

  // sign in form data submission
  const handleSubmit = async (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();
    setSignInCoverVisible(true);
    const signInData: IDBAuth =
      login.login && (await login.login({ email, password }).unwrap());
    // widgets array is stored in DB as JSON.stringify
    // transforming widgets string from DB back into an array
    const widgetsArray = signInData.idToken.widgets
      ? JSON.parse(signInData.idToken.widgets)
      : [];
    dispatch(
      setCredentials({
        accessToken: signInData.accessToken,
        idToken: { ...signInData.idToken, widgets: widgetsArray },
      })
    );
    i18n.changeLanguage(signInData.idToken.locale);
    setEmail("");
    setPassword("");
  };

  // closing sign in menu on overlay click and hiding sign in cover
  const handleOverlayClick = () => {
    setHidden(true);
    setSignInCoverVisible(false);
  };

  // sign in with google
  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const signInData: IDBAuth =
        gLogin.gLogin &&
        (await gLogin
          .gLogin({ ...tokenResponse, darkmode: idToken.darkmode })
          .unwrap());
      // widgets array is stored in DB as JSON.stringify
      // transforming widgets string from DB back into an array
      const widgetsArray = signInData.idToken.widgets
        ? JSON.parse(signInData.idToken.widgets)
        : [];
      dispatch(
        setCredentials({
          accessToken: signInData.accessToken,
          idToken: { ...signInData.idToken, widgets: widgetsArray },
        })
      );
      i18n.changeLanguage(signInData.idToken.locale);
    },
  });

  // password reset
  const handlePasswordReset = (email: string) => {
    resetPassword({ email });
  };

  // content for sign in and options menu
  const content = (
    <>
      <button
        className="headerMenu--button"
        onClick={() => setHidden((prev) => !prev)}
      >
        <span>
          {t("signinMenu_SignIn")}{" "}
          <FontAwesomeIcon
            style={{ backgroundColor: "transparent" }}
            icon={
              hidden
                ? (faArrowAltCircleDown as IconProp)
                : (faArrowAltCircleUp as IconProp)
            }
          />
        </span>
      </button>
      <div
        className={classNames("headerMenu__dropMenu--wrapper noBackground", {
          dropMenuHidden: hidden,
          sendToBackground: hidden,
        })}
      >
        <fieldset className="headerMenu--formWrapper" disabled={hidden}>
          <form className="headerMenu__form">
            {(login.isLoading || gLogin.isLoading) && (
              <div className="headerMenu__form--cover">
                <Spinner embed={false} />
              </div>
            )}

            {(login.isError || gLogin.isError) && signInCoverVisible && (
              <div
                onClick={() => handleErrorClick()}
                className="headerMenu__form--cover"
              >
                {login.isError
                  ? isApiAuthError(login.error)
                    ? t(login.error.data.message)
                    : JSON.stringify(login.error)
                  : isApiAuthError(gLogin.error)
                  ? gLogin.error.data.message
                  : JSON.stringify(gLogin.error)}
              </div>
            )}
            <label htmlFor="headerMenu__form--email">
              {t("signinMenu_email")}
            </label>
            <input
              ref={formEmailRef}
              id="headerMenu__form--email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setForgotPass(false);
              }}
              maxLength={50}
              required
            />
            <label htmlFor="headerMenu__form--password">
              {t("signinMenu_password")}
            </label>
            <input
              ref={formPassRef}
              id="headerMenu__form--password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={50}
              required
            />
            <button disabled={login.isLoading || gLogin.isLoading}>
              {t("signinMenu_Signin")}
            </button>

            {forgotPass && (
              <button
                type="button"
                className="headerMenu__form--forgotPassword"
                onClick={() => setResetPassOverlay(true)}
              >
                {t("forgot_password")}
              </button>
            )}
            {resetPassOverlay &&
              (isLoading ? (
                <div className="headerMenu__form--cover">
                  <Spinner embed={true} />
                </div>
              ) : isError ? (
                <div
                  onClick={() => setResetPassOverlay(false)}
                  className="headerMenu__form--cover"
                >
                  <p>
                    {isApiAuthError(error)
                      ? t(error.data.message)
                      : JSON.stringify(error)}
                  </p>
                </div>
              ) : isSuccess ? (
                <div
                  onClick={() => setResetPassOverlay(false)}
                  className="headerMenu__form--cover"
                >
                  <p>{t("post_password_reset_message", { email })}</p>
                </div>
              ) : (
                <div className="headerMenu__form--cover">
                  <p>{t("confirm_password_reset")}</p>
                  <div className="headerMenu__form__cover--controlsWrapper">
                    <button
                      type="button"
                      onClick={() => handlePasswordReset(email)}
                    >
                      {t("yes")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setResetPassOverlay(false)}
                    >
                      {t("no")}
                    </button>
                  </div>
                </div>
              ))}

            <LineBreak />
            <button onClick={() => loginGoogle()} type="button">
              <span style={{ backgroundColor: "transparent" }}>
                <FontAwesomeIcon
                  style={{ backgroundColor: "transparent" }}
                  icon={faGoogle}
                />{" "}
                {t("signinMenu_signin")}
              </span>
            </button>
            <LineBreak />
            <button
              onClick={() => {
                setHidden(true);
                navigate("/register");
              }}
              className="headerMenu__form--registerButton"
              type="button"
            >
              {t("signinMenu_register")}
            </button>
          </form>
        </fieldset>
      </div>
      {!hidden && (
        <div
          className="headerMenu--overlay"
          onClick={() => handleOverlayClick()}
        ></div>
      )}
    </>
  );

  return (
    <section className="headerMenu" onSubmit={(e) => handleSubmit(e)}>
      {content}
    </section>
  );
};

export default SignIn;

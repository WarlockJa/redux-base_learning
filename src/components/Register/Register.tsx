import "../Header/headerMenu.css";
import { FormEvent, useState } from "react";
import {
  useLoginMutation,
  useRegisterMutation,
} from "../../features/api/auth/authApiSlice";
import Spinner from "../../util/Spinner";
import { isApiRegisterError } from "../../features/api/apiSlice";
import classNames from "classnames";
import {
  IAuthSliceInitialState,
  selectUserData,
  setCredentials,
} from "../../features/api/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useSendConfirmEmailMutation } from "../../features/api/user/userApiSlice";
import { useTranslation } from "react-i18next";

const returnErrorMessage = (error: unknown, t: (value: string) => string) => {
  if (isApiRegisterError(error)) {
    switch (error.originalStatus) {
      case 409:
        return t("already_registered");

      default:
        return JSON.stringify(error);
    }
  }
};

const Register = () => {
  const { t } = useTranslation("register");
  const dispatch = useAppDispatch();
  const idToken = useAppSelector(selectUserData);
  // register form fields and cover states
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [registerCoverVisible, setRegisterCoverVisible] = useState(true);
  const [register, { isSuccess, isLoading, isError, error }] =
    useRegisterMutation();
  const [login, { isLoading: isLoadingLogin }] = useLoginMutation();
  const [sendConfirmEmail] = useSendConfirmEmailMutation();
  const [emailVerificationCoverVisible, setEmailVerificationCoverVisible] =
    useState(false);

  // attempt to register a new user
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterCoverVisible(true);
    const result = await register({
      email,
      name,
      password,
      darkmode: idToken.darkmode,
    }).unwrap();
    if (!isApiRegisterError(result)) {
      // showing alert for email verification
      setEmailVerificationCoverVisible(true);
    }
  };

  // handling click on cover screen with an error message
  const handleErrorClick = () => {
    setRegisterCoverVisible(false);
  };

  // handling click on the successful registration cover screen
  const handleVerificationCoverClick = async () => {
    // sign in user upon registration
    const signInData: IAuthSliceInitialState = await login({
      email,
      password,
    }).unwrap();
    dispatch(
      setCredentials({
        accessToken: signInData.accessToken,
        idToken: signInData.idToken,
      })
    );
    dispatch(sendConfirmEmail);
    // reset local states
    setEmail("");
    setName("");
    setPassword("");
  };

  const canSave = [email, name, password].every(Boolean) && !isLoading;

  return (
    <section className="register">
      <h1>{t("register")}</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        {(isLoading || isLoadingLogin) && (
          <div className="headerMenu__form--cover">
            <Spinner embed={false} />
          </div>
        )}
        {isError && registerCoverVisible && (
          <div
            onClick={() => handleErrorClick()}
            className="headerMenu__form--cover"
          >
            {returnErrorMessage(error, t)}
          </div>
        )}
        {emailVerificationCoverVisible && (
          <div
            onClick={() => handleVerificationCoverClick()}
            className="headerMenu__form--cover"
          >
            {t("verification")}
          </div>
        )}
        <label htmlFor="register__email">{t("email")}</label>
        <input
          id="register__email"
          className={classNames({ invalid: !email })}
          type="email"
          autoComplete="new-password"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={emailVerificationCoverVisible}
          required
        />
        <label htmlFor="register__name">{t("name")}</label>
        <input
          id="register__name"
          className={classNames({ invalid: !name })}
          type="text"
          value={name}
          autoComplete="new-password"
          onChange={(e) => setName(e.target.value)}
          disabled={emailVerificationCoverVisible}
          required
        />
        <label htmlFor="register__password">{t("password")}</label>
        <input
          id="register__password"
          className={classNames({ invalid: !password })}
          type="password"
          autoComplete="new-password"
          value={password}
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,60}$"
          onChange={(e) => setPassword(e.target.value)}
          title={t("password_invalid")!}
          disabled={emailVerificationCoverVisible}
          required
        />
        <button
          disabled={!canSave}
          title={canSave ? t("register_title")! : t("fields_invalid")!}
        >
          {t("register")}
        </button>
      </form>
    </section>
  );
};

export default Register;

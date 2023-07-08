import { useTranslation } from "react-i18next";
import "./preferences.css";
import "./changepassword.css";
import { useState } from "react";
import { useUpdateUserMutation } from "../../features/api/user/userApiSlice";
import { isApiAuthError } from "../../features/api/apiSlice";
import Spinner from "../../util/Spinner";

interface IFormData {
  oldPassword: string;
  newPassword: string;
  newPasswordRepeat: string;
}

const defaultState = {
  oldPassword: "",
  newPassword: "",
  newPasswordRepeat: "",
};

const ChangePassword = () => {
  const { t } = useTranslation();
  // user store data
  const [updateUser, { isLoading, isError, error: updateError, isSuccess }] =
    useUpdateUserMutation();
  // flag for password overlay visiblilit
  const [passwordChangeDialogVisible, setPasswordChangeDialogVisible] =
    useState(false);
  // form data for password change
  const [formData, setFormData] = useState<IFormData>(defaultState);
  // validation errors
  const [error, setError] = useState<IFormData>(defaultState);
  // password change result data
  const [resultData, setResultData] = useState<string>("");

  // handle change of the input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validatePassword(e);
  };

  // validating inputs data
  const validatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // negative pattern. Defines a string with a length less than 8, which does not contain digits and letters
    const passPattern = new RegExp("^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*)$");
    setError((prev) => {
      const errorObj = { ...prev, [name]: "" };

      switch (name) {
        case "oldPassword":
          if (!value) {
            errorObj[name] = t("enter_current_password_title");
          }
          break;

        case "newPassword":
          if (!value) {
            errorObj[name] = t("enter_new_password_title");
          } else if (passPattern.test(value)) {
            errorObj[name] = t("password_complexity_nottification");
          }
          break;

        case "newPasswordRepeat":
          if (!value) {
            errorObj[name] = t("confirm_password_title");
          } else if (formData.newPassword && formData.newPassword !== value) {
            errorObj[name] = t("passwords_differ");
          }
          break;

        default:
          break;
      }

      return errorObj;
    });
  };

  const handleSubmit = async () => {
    const result = await updateUser({
      oldpassword: formData.oldPassword,
      newpassword: formData.newPassword,
    }).unwrap();

    result.message && setResultData(result.message);
  };

  const handleCancel = () => {
    setError(defaultState);
    setFormData(defaultState);
    setPasswordChangeDialogVisible(false);
    setResultData("");
  };

  return (
    <div
      className="preferencesItem__userForm--editBlock"
      onClick={() => (resultData ? handleCancel() : null)}
    >
      <p className="preferencesItem__userForm--p">{t("change_password")}</p>
      <button
        type="button"
        className="preferencesItem__userForm--editButton"
        title={t("change_password")!}
        onClick={() =>
          setPasswordChangeDialogVisible(!passwordChangeDialogVisible)
        }
      >
        · · ·
      </button>
      {passwordChangeDialogVisible ? (
        isLoading ? (
          <div className="changePassword">
            <Spinner embed={true} />
          </div>
        ) : resultData ? (
          <div className="changePassword">
            <p>{resultData}</p>
          </div>
        ) : (
          <form className="changePassword" onSubmit={handleSubmit}>
            <label htmlFor="changePassword__oldPassword">
              {t("current_password")}
            </label>
            <input
              name="oldPassword"
              autoComplete="new-password"
              value={formData.oldPassword}
              onChange={(e) => handleChange(e)}
              type="password"
              id="changePassword__oldPassword"
              required
              title={
                error.oldPassword
                  ? error.oldPassword
                  : formData.oldPassword
                  ? t("everything_good")!
                  : t("enter_current_password_title")!
              }
              className={error.oldPassword ? "invalid" : ""}
              maxLength={60}
            />
            <label htmlFor="changePassword__newPassword">
              {t("new_password")}
            </label>
            <input
              name="newPassword"
              autoComplete="new-password"
              value={formData.newPassword}
              onChange={(e) => handleChange(e)}
              type="password"
              id="changePassword__newPassword"
              required
              title={
                error.newPassword
                  ? error.newPassword
                  : formData.newPassword
                  ? t("everything_good")!
                  : t("enter_new_password_title")!
              }
              className={error.newPassword ? "invalid" : ""}
              maxLength={60}
            />
            <label htmlFor="changePassword__newPasswordRepeat">
              {t("confirm_password")}
            </label>
            <input
              name="newPasswordRepeat"
              autoComplete="new-password"
              value={formData.newPasswordRepeat}
              onChange={(e) => handleChange(e)}
              type="password"
              id="changePassword__newPasswordRepeat"
              required
              title={
                error.newPasswordRepeat
                  ? error.newPasswordRepeat
                  : formData.newPasswordRepeat
                  ? t("everything_good")!
                  : t("confirm_password_title")!
              }
              className={error.newPasswordRepeat ? "invalid" : ""}
              maxLength={60}
            />
            <div className="changePassword__controls">
              <button
                type="submit"
                className="changePassword__controls--button"
                disabled={
                  !!error.newPassword ||
                  !!error.oldPassword ||
                  !!error.newPasswordRepeat ||
                  !formData.oldPassword
                }
              >
                {t("ok")}
              </button>
              <button
                type="button"
                className="changePassword__controls--button"
                onClick={() => handleCancel()}
              >
                {t("cancel")}
              </button>
            </div>
            <p className="font-negative">
              {isError &&
                isApiAuthError(updateError) &&
                t(updateError.data.message)}
            </p>
          </form>
        )
      ) : null}
    </div>
  );
};

export default ChangePassword;

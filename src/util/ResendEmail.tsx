import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useSendConfirmEmailMutation } from "../features/api/user/userApiSlice";
import {
  selectCurrentResendVerificationEmailTimer,
  setResendEmailVerificationTimer,
} from "../features/api/user/userSlice";
import { useTranslation } from "react-i18next";

// deay between verification emails resend
const RESEND_DELAY_IN_SECONDS = 30;

const ResendEmail = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [sendConfirmEmail] = useSendConfirmEmailMutation();
  const resendEmailVerificationTimer = useAppSelector(
    selectCurrentResendVerificationEmailTimer
  );

  // countdown before another verification email resend available
  const [countdown, setCountdown] = useState(new Date().getTime());

  // verification e-mail sent, setting up delay timer
  useEffect(() => {
    if (resendEmailVerificationTimer) setCountdown(new Date().getTime());
  }, [resendEmailVerificationTimer]);

  // countdown for the delay
  useEffect(() => {
    if (countdown < resendEmailVerificationTimer) {
      const interval = setInterval(() => {
        setCountdown(countdown + 1000);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [countdown]);

  // handle re-send verification e-mail click
  const handleResendVerificationEmailclick = () => {
    dispatch(sendConfirmEmail);
    dispatch(
      setResendEmailVerificationTimer({
        resendEmailVerificationTimer:
          new Date().getTime() + RESEND_DELAY_IN_SECONDS * 1000,
      })
    );
  };

  return resendEmailVerificationTimer < countdown ? (
    // resendEmailVerificationTimer has passed. Showing re-send option
    <p
      className="textButton"
      title={t("title")!}
      onClick={() => handleResendVerificationEmailclick()}
    >
      {t("resend")}
    </p>
  ) : (
    // resendEmailVerificationTimer is in the future. Showing countdown
    <p className="textButtonPressed" title={t("title_sent")!}>
      {t("countdown")}{" "}
      {Math.floor((resendEmailVerificationTimer - countdown) / 1000) + 1}
      {t("second")}
    </p>
  );
};

export default ResendEmail;

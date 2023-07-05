import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleUp } from "@fortawesome/fontawesome-free-solid";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useTranslation } from "react-i18next";

export const ScrollToTop = () => {
  window.scrollTo({ top: 0 });
};

const ScrollToTopButton = () => {
  const { t } = useTranslation();
  // scroll to top button visibility state
  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);

  // scroll to top button
  useEffect(() => {
    const scrollToTopButtonVisibility = () => {
      window.scrollY > 300
        ? setShowScrollToTopButton(true)
        : setShowScrollToTopButton(false);
    };

    window.addEventListener("scroll", scrollToTopButtonVisibility);

    return () => {
      window.removeEventListener("scroll", scrollToTopButtonVisibility);
    };
  }, []);

  // scroll to top action
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return showScrollToTopButton ? (
    <button
      aria-label={t("scroll-top")!}
      title={t("scroll-top")!}
      className="scrollToTop-button"
      onClick={() => handleScrollTop()}
    >
      <FontAwesomeIcon
        style={{ backgroundColor: "transparent" }}
        icon={faArrowCircleUp as IconProp}
      />
    </button>
  ) : (
    <></>
  );
};

export default ScrollToTopButton;

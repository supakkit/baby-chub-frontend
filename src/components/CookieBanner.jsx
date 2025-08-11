import CookieConsent from "react-cookie-consent";

const CookieBanner = () => {
  return (
    <CookieConsent
      location="bottom"
      enableDeclineButton
      buttonText="Accept"
      declineButtonText="Decline"
      flipButtons
      cookieName="babyChubCookie"
      style={{ background: "#ffffff", color: "#543285", }}
      buttonStyle={{ color: "#543285" }}
    >
      This website uses cookies to enhance the user experience.{" "}
    </CookieConsent>
  );
};

export default CookieBanner;
//onAccept and onDecline function not ready kub

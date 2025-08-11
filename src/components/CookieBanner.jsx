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

//Clear specific cookie -> first go to dev mode on browser then find >> Application -> find cookie on the left tab -> then delete babyChubCookie kub
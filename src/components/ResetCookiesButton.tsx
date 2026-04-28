"use client";

export default function ResetCookiesButton() {
  const handleReset = () => {
    localStorage.removeItem("natlaupa_cookie_consent");
    window.location.reload();
  };

  return (
    <button
      onClick={handleReset}
      className="text-gold hover:text-white transition-colors underline cursor-pointer"
    >
      cliquant ici pour réinitialiser vos préférences
    </button>
  );
}

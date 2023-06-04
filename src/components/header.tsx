import { EnvelopeIcon, BellAlertIcon } from "@heroicons/react/24/solid";

const Header = () => {
  const activeNotifications = () => {
    if (window.Notification.permission !== "granted")
      window.Notification.requestPermission(permission => {
        if (permission === "granted") {
          console.log("Notification accept");
        }
      });
  };
  return (
    <header className="bg-gradient-to-l from-[#EF8D9C] to-[#FFC39E] px-3 py-7 flex justify-between text-white">
      <div className="flex justify-center items-center">
        <EnvelopeIcon className="w-20 mr-2" />
        <h1>DropMail</h1>
      </div>
      <button
        className="text-white bg-[#24292F] hover:bg-[#24292F]/90 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30"
        onClick={activeNotifications}
        disabled={window.Notification.permission === "granted"}
      >
        <BellAlertIcon className={"w-6 mr-2"} />
        Receber notificações
      </button>
    </header>
  );
};

export default Header;

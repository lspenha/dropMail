import { useState } from "react";
import { EnvelopeIcon, BellAlertIcon } from "@heroicons/react/24/solid";

export function HeaderComponet() {
  const [active, setActive] = useState(false);

  function activeNotifications() {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          setActive(true);
        }
      });
    }
  }

  return (
    <header className="bg-gradient-to-r from-[#EF8D9C] to-[#FFC39E] px-3 py-7 flex justify-between text-white">
      <div className="flex justify-center items-center">
        <EnvelopeIcon className="w-20 mr-2" />
        <h1>DropMail</h1>
      </div>
      <button
        className={`text-white bg-[#24292F] hover:bg-[#24292F]/90 font-medium rounded-lg text-sm px-5 py-1 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 ${
          active && "cursor-not-allowed opacity-50"
        }`}
        onClick={activeNotifications}
        disabled={active}
      >
        <BellAlertIcon className={"w-6 mr-2"} />
        Notifications
      </button>
    </header>
  );
}

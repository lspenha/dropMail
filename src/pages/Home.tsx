import { useMutation, useQuery } from "@apollo/client";
import { GENERATE_SESSION, GET_EMAILS } from "apollo/querys";
import Header from "components/header";
import Inbox from "components/Inbox";
import Modal from "components/modal";
import useInterval from "hooks/useInterval";
import {
  useDeleteLocalStorage,
  useGetLocalStorage,
  useSetLocalStorage
} from "hooks/useLocalStorage";
import { useEffect, useState } from "react";
import {
  DataSession,
  IntroduceSession,
  Session
} from "utils/interface/session";
import { Mail } from "utils/interface/mail";
import {
  ArrowPathIcon,
  ClipboardDocumentCheckIcon,
  PencilIcon
} from "@heroicons/react/24/solid";

const HomeLayout = () => {
  const localStoregeKey = "session";
  const initialIntervalValue = 15;

  const session: Session = useGetLocalStorage(localStoregeKey);

  const [interval, setInterval] = useState(initialIntervalValue);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { loading: loadingQueryGetEmails, refetch: getEmails } =
    useQuery<Mail>(GET_EMAILS);
  const [generateSession, { loading: loadingQueryCreateSession }] =
    useMutation(GENERATE_SESSION);

  const closeModal = async () => {
    await generateEmail();
    setModalIsOpen(false);
  };

  const refreshEmails = async () => {
    await getEmails({ sessionid: session.id });
    setInterval(initialIntervalValue);
  };

  const generateEmail = async () => {
    const { data } = await generateSession();
    const { introduceSession } = data as DataSession;
    useSetLocalStorage(localStoregeKey, {
      id: introduceSession.id,
      expiresAt: introduceSession.expiresAt,
      address: introduceSession.addresses[0].address
    });
  };

  const copyEmailToClipboard = () => {
    session && navigator.clipboard.writeText(session.address);
  };

  if (interval === 0) {
    getEmails({ sessionid: session.id });
    setInterval(initialIntervalValue);
  }

  // useInterval(
  //   () =>
  //     setInterval(old => {
  //       if (old < 1) {
  //         return 15;
  //       } else {
  //         return old - 1;
  //       }
  //     }),
  //   !loadingQueryGetEmails && session ? 1000 : null
  // );

  useEffect(() => {
    if (session && new Date(session.expiresAt) < new Date()) {
      useDeleteLocalStorage(localStoregeKey);
      setModalIsOpen(true);
    }
    if (!session) {
      setModalIsOpen(true);
    }
  }, [session]);

  return (
    <>
      {modalIsOpen && (
        <Modal onClick={closeModal} loading={loadingQueryCreateSession} />
      )}
      <div>
        <Header />
        <div className="p-4 h-[70vh]">
          <section className="py-10 flex">
            <div className="my-0 mx-auto w-96">
              <span>Your temporary email address</span>
              <div className="w-full flex mb-2">
                <input
                  className="w-full rounded-l bg-white border border-gray-300 p-2"
                  type="text"
                  disabled
                  value={session ? session.address : ""}
                />
                <button
                  className="text-white bg-[#24292F] hover:bg-[#24292F]/90 rounded-l-none font-medium rounded-lg  text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30"
                  onClick={copyEmailToClipboard}
                  data-tooltip-target="tooltip-default"
                >
                  <ClipboardDocumentCheckIcon className={"w-6 mr-1"} />
                </button>
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="text-white bg-[#24292F] hover:bg-[#24292F]/90 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30"
                  onClick={generateEmail}
                >
                  <PencilIcon className={"w-6 mr-1"} />
                  Change
                </button>
              </div>
              <div className="text-center flex justify-center items-center mt-5">
                Autorefresh in
                <span className="rounded-full ml-2 w-7 h-7 border-blue-600 border">
                  {interval}
                </span>
                <button
                  type="button"
                  onClick={refreshEmails}
                  className="ml-2 text-white bg-[#24292F] hover:bg-[#24292F]/90 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30"
                >
                  <ArrowPathIcon className={"w-6 mr-1"} />
                  Refresh
                </button>
              </div>
            </div>
          </section>
          <Inbox />
        </div>
      </div>
    </>
  );
};

export default HomeLayout;

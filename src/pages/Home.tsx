import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GENERATE_SESSION, GET_EMAILS } from "apollo/querys";

import {
  ClipboardDocumentCheckIcon,
  PencilIcon
} from "@heroicons/react/24/solid";

import { AutorefreshComponent } from "components/AutorefreshComponent";
import { HeaderComponet } from "components/HeaderComponet";
import { InboxComponet } from "components/InboxComponet";
import { ModalComponet } from "components/ModalComponet";

import {
  useDeleteLocalStorage,
  useGetLocalStorage,
  useSetLocalStorage
} from "hooks/useLocalStorage";
import useInterval from "hooks/useInterval";

import { DataSession, Session } from "utils/interface/session";
import { Mail } from "utils/interface/mail";

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

  useInterval(
    () =>
      setInterval(old => {
        if (old < 1) {
          return 15;
        } else {
          return old - 1;
        }
      }),
    !loadingQueryGetEmails && session ? 1000 : null
  );

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
        <ModalComponet
          onClick={closeModal}
          loading={loadingQueryCreateSession}
        />
      )}
      <div>
        <HeaderComponet />
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
              <AutorefreshComponent
                interval={interval}
                refreshEmails={refreshEmails}
              />
            </div>
          </section>
          <InboxComponet />
        </div>
      </div>
    </>
  );
};

export default HomeLayout;

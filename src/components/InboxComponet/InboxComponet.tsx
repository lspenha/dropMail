import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_EMAILS } from "apollo/querys";
import { useGetLocalStorage, useSetLocalStorage } from "hooks/useLocalStorage";
import { Session } from "utils/interface/session";
import { Mail, MailData } from "utils/interface/mail";
import { EmailComponet } from "components/EmailComponet";

export function InboxComponet() {
  const localStoregeKey = "session";
  const session: Session = useGetLocalStorage(localStoregeKey);

  const [emailToRead, setEmailToRead] = useState<MailData>();
  const { data: emails, previousData } = useQuery<Mail>(GET_EMAILS, {
    variables: { sessionid: session?.id }
  });

  const selectEmailToRead = (i: number) => {
    setEmailToRead(emails?.session.mails[i]);
  };

  useEffect(() => {
    if (session && emails) {
      useSetLocalStorage(localStoregeKey, {
        ...session,
        expiresAt: emails.session.expiresAt
      });
      if (
        previousData &&
        JSON.stringify(previousData.session.mails) !==
          JSON.stringify(emails.session.mails)
      ) {
        new Notification("DropMail", {
          body: "There's a new email in your inbox!"
        });
      }
    }
  }, [emails]);

  return (
    <div className="w-full h-full rounded border-2 border-gray-300 flex">
      <input
        id="collapse-sidebar"
        className="peer/sidebar hidden"
        type="checkbox"
      />
      <section className="w-80 overflow-auto h-[calc(100%-32px)] peer-checked/sidebar:w-0">
        <ul>
          <div>
            <li className="p-2 py-3 font-bold">Inbox</li>
          </div>

          {emails &&
            emails.session.mails.map(({ fromAddr, text, headerSubject }, i) => (
              <>
                <EmailComponet
                  key={i}
                  text={text}
                  fromAddr={fromAddr}
                  headerSubject={headerSubject}
                  selectEmail={() => selectEmailToRead(i)}
                />
              </>
            ))}
        </ul>
      </section>
      <section className="w-full border-l-2 overflow-auto peer-checked/sidebar:pl-8">
        {emailToRead && (
          <>
            <h2 className="p-2 py-3 font-semibold border-b border-gray-300">
              Sender: {emailToRead.fromAddr}
            </h2>
            <h1 className="px-2 py-3 border-b border-gray-300">
              Subject: {emailToRead.headerSubject}
            </h1>
            <div className="bg-white h-full overflow-auto p-2 whitespace-pre-line font-semibold">
              {emailToRead.text}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

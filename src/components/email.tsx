interface EmailProps {
  headerSubject: string;
  text: string;
  fromAddr: string;
  selectEmail: () => void;
}

const Email = ({ headerSubject, text, fromAddr, selectEmail }: EmailProps) => {
  return (
    <>
      <li
        className="flex flex-col font-bold text-lg px-2 border-y border-gray-300 cursor-pointer"
        onClick={selectEmail}
      >
        <ol>
          <li className="text-black whitespace-nowrap overflow-hidden text-ellipsis">
            {fromAddr}
          </li>
          <li className="text-lg text-blue-700 whitespace-nowrap overflow-hidden text-ellipsis">
            {headerSubject}
          </li>
          <li className="text-gray-600 text-base whitespace-nowrap overflow-hidden text-ellipsis">
            {text}
          </li>
        </ol>
      </li>
    </>
  );
};

export default Email;

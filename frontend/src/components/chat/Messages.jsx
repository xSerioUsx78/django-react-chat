import { MEDIA_URL } from "../../utils";

const Messages = ({ messages, user, scrollMessagesRef }) => {
  return (
    <div className="messages">
      <ul>
        {messages.map((message, i) => (
          <li
            key={i}
            className={`${message.user === user.id ? "sent" : "replies"}`}
          >
            <img
              src={`${MEDIA_URL}${message.user__profile__image}`}
              alt={message.user}
            />
            <p>{message.text}</p>
          </li>
        ))}
        <div style={{ float: "left", clear: "both" }} ref={scrollMessagesRef} />
      </ul>
    </div>
  );
};

export default Messages;

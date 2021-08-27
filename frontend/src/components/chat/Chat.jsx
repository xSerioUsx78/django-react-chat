import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";
import { authAxios } from "../../axios";
import requests from "../../requests";
import SidePanel from "./SidePanel";
import Messages from "./Messages";
import webSocketInstance from "../../webSocket";

const Chat = ({ match }) => {
  const pk = parseInt(match.params.pk);
  const auth = useSelector((state) => state.auth);

  const scrollMessagesRef = useRef(null);
  const sendButtonRef = useRef(null);

  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const scrollToBottom = () => {
    scrollMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOnKeyUp = (e) => {
    e.keyCode === 13 && sendButtonRef.current?.click();
  };

  const handleFetchMessages = useCallback((messages) => {
    setMessages(messages);
    scrollToBottom();
  }, []);

  const handleNewMessage = useCallback(
    (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      let contactIndex = contacts.findIndex((obj) => obj.id === pk);
      let contactsCopy = [...contacts];
      contactsCopy[contactIndex].messages = message;
      setContacts(contactsCopy);
      scrollToBottom();
    },
    [contacts, pk]
  );

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await authAxios(auth.token).get(requests.getContactURL);
        let contacts = res.data;
        setContacts(contacts);
        let currentChat = res.data.filter((item) => item.id === pk)[0];
        setCurrentChat(currentChat);
      } catch (e) {
        console.log(e.response);
      }
    };
    fetchContact();
    return () => {
      setContacts([]);
    };
  }, [auth.token, pk]);

  useEffect(() => {
    webSocketInstance.connect(pk);
    webSocketInstance.addCallbacks(handleFetchMessages, handleNewMessage);
    return () => {
      webSocketInstance.disconnect();
    };
  }, [pk, handleFetchMessages, handleNewMessage]);

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    let image = auth.user.profile.image.split("/")[4];
    webSocketInstance.newChatMessage(auth.user.id, message, image);
    setMessage("");
  };

  if (!auth.isAuthenticated) {
    return <Redirect to={`/login/?next=/chat/${pk}/`} />;
  }

  return (
    <div id="frame">
      <SidePanel
        contacts={contacts}
        currentUser={auth.user}
        activeChat={null}
      />
      <div className="content">
        {currentChat &&
          currentChat.users.map(
            (user, i) =>
              user.id !== auth.user.id && (
                <div key={user.id} className="contact-profile">
                  <img src={user.profile.image} alt={user.username} />
                  <p>{user.username}</p>
                </div>
              )
          )}
        <Messages
          messages={messages}
          user={auth.user}
          scrollMessagesRef={scrollMessagesRef}
        />
        <div>
          <div className="message-input">
            <div className="wrap">
              <input
                type="text"
                name="message"
                placeholder="Write your message..."
                value={message}
                onChange={handleMessage}
                onKeyUp={handleOnKeyUp}
              />
              <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
              <button
                ref={sendButtonRef}
                onClick={handleSendMessage}
                className="submit"
              >
                <i className="fa fa-paper-plane" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

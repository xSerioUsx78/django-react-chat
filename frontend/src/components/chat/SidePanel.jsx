import { useHistory } from "react-router";

const SidePanel = ({ contacts, currentUser, activeChat }) => {
  const history = useHistory();

  const handleChatClick = (pk) => {
    history.push(`/chat/${pk}/`);
  };

  const handleContactsPush = () => {
    history.push(`/`);
  };

  return (
    <div id="sidepanel">
      <div id="profile">
        <div className="wrap">
          <img
            id="profile-img"
            src={currentUser.profile.image}
            className="online"
            alt={currentUser.username}
          />
          <p>{currentUser.username}</p>
          <i
            className="fa fa-chevron-down expand-button"
            aria-hidden="true"
          ></i>
          <div id="status-options">
            <ul>
              <li id="status-online" className="active">
                <span className="status-circle"></span> <p>Online</p>
              </li>
              <li id="status-away">
                <span className="status-circle"></span> <p>Away</p>
              </li>
              <li id="status-busy">
                <span className="status-circle"></span> <p>Busy</p>
              </li>
              <li id="status-offline">
                <span className="status-circle"></span> <p>Offline</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div id="search">
        <label htmlFor="">
          <i className="fa fa-search" aria-hidden="true"></i>
        </label>
        <input type="text" placeholder="Search contacts..." />
      </div>
      <div id="contacts">
        <ul>
          {contacts.map((item, i) => (
            <li
              onClick={() => handleChatClick(item.id)}
              key={item.id}
              className={`contact ${
                activeChat && activeChat === item.id && "active"
              }`}
            >
              {item.users.map(
                (user, i) =>
                  user.id !== currentUser.id && (
                    <div key={user.id} className="wrap">
                      <span className="contact-status busy"></span>
                      <img src={user.profile.image} alt={user.username} />
                      <div className="meta">
                        <p className="name">{user.username}</p>
                        <p className="preview">
                          {item.messages.text !== ''
                            ? item.messages.user === currentUser.id
                              ? `You: ${item.messages.text}`
                              : item.messages.text
                            : "no Message yet."}
                        </p>
                      </div>
                    </div>
                  )
              )}
            </li>
          ))}
        </ul>
      </div>
      <div id="bottom-bar">
        <button onClick={handleContactsPush} id="addcontact" className="w-100">
          <i className="fa fa-users fa-fw" aria-hidden="true"></i>{" "}
          <span>Contacts</span>
        </button>
      </div>
    </div>
  );
};

export default SidePanel;

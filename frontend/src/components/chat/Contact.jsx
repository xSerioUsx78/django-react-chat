import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";
import { authAxios } from "../../axios";
import requests from "../../requests";
import SidePanel from "./SidePanel";

const Contact = () => {
  const auth = useSelector((state) => state.auth);

  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await authAxios(auth.token).get(requests.getContactURL);
        setContacts(res.data);
      } catch (e) {
        console.log(e.response);
      }
    };
    fetchContact();
    return () => {
      setContacts([]);
    };
  }, [auth.token]);

  if (!auth.isAuthenticated) {
    return <Redirect to="/login/" />;
  }

  return (
    <div id="frame">
      <SidePanel
        contacts={contacts}
        currentUser={auth.user}
        activeChat={null}
      />
      <div className="content">
        <div className="messages d-flex align-items-center justify-content-center">
          <div className="alert alert-info">
            Select the chat that you want to chat with!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

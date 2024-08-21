"use client";
import { useEffect, useState } from "react";
import scss from "./ChatWebsocet.module.scss";
import { signIn, signOut, useSession } from "next-auth/react";

interface IMessage {
  username: string;
  photo: string;
  message: string;
}

function ChatWebSocet() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { data: session } = useSession();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newmass, setNewmass] = useState("");

  const initialisationWebSocket = () => {
    const ws = new WebSocket("wss://api.elchocrud.pro");
    ws.onopen = () => {
      console.log("ws connect");
    };
    ws.onmessage = (event) => {
      setMessages(JSON.parse(event.data));
    };
    ws.onerror = (error) => {
      console.log("🚀 ~ initialisationWebSocket ~ error:", error);
    };
    ws.onclose = () => {
      setTimeout(initialisationWebSocket, 500);
    };
    setSocket(ws);
    console.log(socket);
  };

  function sendMessage() {
    if (socket && socket.readyState === WebSocket.OPEN) {
      let newUser = {
        event: "message",
        username: `${session?.user?.name}`,
        photo: `${session?.user?.image}`,
        message: newmass,
      };
      socket.send(JSON.stringify(newUser));
      setNewmass("");
    }
  }
  useEffect(() => {
    initialisationWebSocket();
  }, []);

  if (!session) {
    return (
      <div>
        <button onClick={() => signIn("google")}>Google SignIn</button>
        <button onClick={() => signIn("github")}>GitHub SignIn</button>
      </div>
    );
  }

  return (
    <div className={scss.ChatWebSocet}>
      <div className="container">
        <div className={scss.content}>
         <div className="">
         <h1 onClick={() => signOut()}>logOut</h1>
         <h1>{session?.user?.name}</h1>
         </div>
          <h2>ChatWebSocket</h2>
          <div className={scss.discussion}>
            <div className={scss.form}>
              <input
                onChange={(e) => setNewmass(e.target.value)}
                placeholder="add message"
                type="text"
                value={newmass}
              />
              <button onClick={() => sendMessage()}>send</button>
            </div>
            {messages
              .slice()
              .reverse()
              .map((el, idx) => (
                <div
                  key={idx}
                  className={
                    el?.username == session?.user?.name
                      ? scss.uuserSaikal
                      : scss.uuserTitle
                  }
                >
                  <div className={scss.chatBlock}>
                    <div
                      className={
                        el?.username == session?.user?.name
                          ? scss.userSaikal
                          : scss.userTitle
                      }
                    >
                      <img src={el?.photo} alt="img" />
                      <h1>{el?.username}: </h1>
                      {/* <p>
                      {Array.isArray(el.message)
                        ? el.message !== el.message
                        : el.message}
                    </p> */}
                      <p>{el.message}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatWebSocet;

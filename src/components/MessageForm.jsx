import "./../styles/Chat.css";
import React, { useState, useEffect } from "react";

export const MessageForm = ({
  onSendMessage_user,
  onSendMessage_bot,
  userinfo,
}) => {
  const [message, setMessage] = useState("");
  const baseURL = "http://3.36.105.171:8000/";

  useEffect(() => {
    fetch(`${baseURL}set-csrf-token/`, {
      method: "GET",
      credentials: "include",
    });
  }, []);

  const getCookie = (name) => {
    const cookie = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith(`${name}=`));
    return cookie
      ? decodeURIComponent(cookie.trim().substring(name.length + 1))
      : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim(); // 공백을 제거한 메시지

    if (trimmedMessage === "") return; // 메시지가 공백이면 전송하지 않음

    setMessage(""); // 메시지 상태를 초기화

    onSendMessage_user(trimmedMessage); // 저장된 메시지를 전송

    try {
      const response = await fetch(`${baseURL}chatbot/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        credentials: "include",
        body: JSON.stringify({
          message: trimmedMessage,
          username: userinfo.username,
          language: userinfo.language,
        }), // 저장된 메시지를 사용
      });

      if (response.ok) {
        const data = await response.json();
        onSendMessage_bot(data.response);
      } else {
        console.error("서버로부터 유효한 응답을 받지 못했습니다");
      }
    } catch (error) {
      console.error("메시지 전송 실패", error);
    }
  };

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="chat__input-box">
          <input
            className="chat__input"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleOnKeyPress}
          />
          <button type="submit" className="chat__input_button"></button>
        </div>
      </form>
    </div>
  );
};

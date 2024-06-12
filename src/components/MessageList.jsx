import React, { useState, useEffect, useRef } from "react";
import robotImg from "./../img/bot-img.png"; // 경로 수정
import userImg from "./../img/u.png"; // 경로 수정
import noMessagesImg from "./../img/bot-img.png"; // 경로 수정
import { restaurants_list } from "./restaurant_list";
import "./../styles/Chat.css";

export const MessageList = ({
  handleDeleteAllChats,
  renderChatHistory,
  messages,
  onRestaurantClick,
  chatHistory,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const highlightRestaurants = (isUser, text) => {
    const pattern = new RegExp(`(${restaurants_list.join("|")})`, "gi");
    const found = [];

    const highlightedText = text.split(pattern).map((part, index) => {
      if (!isUser && restaurants_list.includes(part)) {
        found.push(part);

        return (
          <span
            key={index}
            style={{ color: "#2845ed", cursor: "pointer" }}
            onClick={() => onRestaurantClick(part)}
          >
            {part}
          </span>
        );
      }
      return part;
    });

    return { highlightedText, found };
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      setIsScrolled(messagesContainerRef.current.scrollTop > 0);
    }
  };

  return (
    <div
      className={`chat__messages-container ${isScrolled ? "scrolled" : ""}`}
      onScroll={handleScroll}
      ref={messagesContainerRef}
    >
      {/* messages와 chatHistory가 모두 비어 있을 때 "No messages" 이미지 표시 */}
      {messages.length === 0 && chatHistory.length === 0 ? (
        <div className="chat__no-messages">
          <img
            src={noMessagesImg}
            alt="No messages"
            className="no_history_image"
          />
        </div>
      ) : (
        <>
          <button
            className="chat__delete-button"
            onClick={handleDeleteAllChats}
          >
            RESET
          </button>
          {renderChatHistory(chatHistory)}
          {messages.map((message) => {
            const { highlightedText } = highlightRestaurants(
              message.isUser,
              message.text
            );

            return (
              <div
                key={message.id}
                className={
                  message.isUser
                    ? "chat__user-message-container"
                    : "chat__bot-message-container"
                }
              >
                {!message.isUser && (
                  <img className="chat__bot-icon" src={robotImg} alt="Bot" />
                )}

                <div
                  className={
                    message.isUser
                      ? "chat__user-message-box"
                      : "chat__bot-message-box"
                  }
                >
                  <span>{highlightedText}</span>
                </div>

                {message.isUser && (
                  <img className="chat__user-icon" src={userImg} alt="User" />
                )}
              </div>
            );
          })}
        </>
      )}
      <div ref={messagesEndRef}></div>
    </div>
  );
};

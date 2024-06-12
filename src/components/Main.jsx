// src/Chat.js

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useTranslation } from "react-i18next";
import Mapcustom from "./Mapcustom";
import { MessageList } from "./MessageList";
import { MessageForm } from "./MessageForm";
import MapBookmark from "./MapBookmark";
import Recommend from "./Recommend";
import Bookmark from "./Bookmark";
import { getRestaurantCoordinates } from "./GetRestaurantCoordinates";
import robotImg from "./../img/rebot.png";
import userImg from "./../img/u.png";
import Tooltip from "./Tooltip";

import "./../styles/Main.css";
import "./../styles/Bookmark.css";
import "./../styles/Chat.css";

const Chat = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { username } = useParams();
  const baseURL = "http://3.36.105.171:8000/";

  const [messages, setMessages] = useState([]);
  const [selectedOption, setSelectedOption] = useState("map");
  const [bookmarkedRestaurants, setBookmarkedRestaurants] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 37.5412,
    lng: 127.0565,
  });
  const [zoom, setZoom] = useState(15);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [recommendedRestaurants, setRecommendedRestaurants] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    language: "",
  });

  const onLogoutHandler = async () => {
    try {
      const response = await fetch(`${baseURL}logout/`, {
        method: "POST",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
        credentials: "include",
      });

      if (response.ok) {
        i18n.changeLanguage("en");
        navigate("/");
        console.log(">>> [로그아웃] ✅ SUCCESS >>>");
      } else {
        console.log("Failed to logout");
      }
    } catch (error) {
      console.log("Failed to logout");
    }
  };

  const render = (status) => {
    switch (status) {
      case Status.LOADING:
        return <>로딩중...</>;
      case Status.FAILURE:
        return <>에러 발생</>;
      case Status.SUCCESS:
        return <>로드 성공</>;
      default:
        return null;
    }
  };

  const handleSendMessage_user = (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, isUser: true, id: Date.now() },
    ]);
  };

  const handleSendMessage_bot = (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, isUser: false, id: Date.now() },
    ]);
  };

  const handleMapButtonClick = () => {
    setSelectedOption("map");
  };

  const handleRecommendButtonClick = () => {
    setSelectedOption("recommend");
  };

  const handleRankingButtonClick = () => {
    setSelectedOption("recommend");
  };

  const handleBookmarkButtonClick = () => {
    setSelectedOption("bookmark");
  };

  const resetMap = () => {
    setZoom(15);
    setSelectedLocation({ lat: 37.5412, lng: 127.0565 });
    setSelectedRestaurant("");
  };

  const logoOnClick = () => {
    navigate("/");
  };

  useEffect(() => {
    fetch(`${baseURL}set-csrf-token/`, {
      method: "GET",
      credentials: "include",
    });

    fetch(`${baseURL}get-username/${username}/`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) =>
        response.ok
          ? response.json()
          : Promise.reject("Failed to fetch user info")
      )
      .then((data) => {
        setUserInfo({ username: data.username, language: data.language });
        localStorage.setItem(
          "userInfo",
          JSON.stringify({ username: data.username, language: data.language })
        );
        if (data.language === "Japanese") {
          i18n.changeLanguage("ja");
        }
        if (data.language === "Korean") {
          i18n.changeLanguage("kr");
        }
        if (data.language === "Chinese") {
          i18n.changeLanguage("zh");
        }
        if (data.language === "English") {
          i18n.changeLanguage("en");
        }
      })
      .catch((error) => console.log(error));
  }, [username, i18n]);

  const [isEnlarged, setIsEnlarged] = useState(false);

  const handleRestaurantClick = async (restaurantName) => {
    try {
      const coords = await getRestaurantCoordinates(restaurantName);
      setSelectedLocation(coords);
      setZoom(23);
      setSelectedRestaurant(restaurantName);
      if (selectedOption === "recommend" && selectedRestaurant) {
        setSelectedOption("map");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getCookie = (name) => {
    const cookie = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith(`${name}=`));
    return cookie
      ? decodeURIComponent(cookie.trim().substring(name.length + 1))
      : null;
  };

  const fetchBookmarkedRestaurants = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await fetch(`${baseURL}api/saved-restaurants/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBookmarkedRestaurants(data);
    } catch (error) {
      console.error("Error fetching bookmarked restaurants:", error);
    }
  }, []);

  const fetchRecommendedRestaurants = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await fetch(`${baseURL}api/recommend-restaurants/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRecommendedRestaurants(data);
    } catch (error) {
      console.error("Error fetching recommended restaurants:", error);
    }
  }, []);

  const fetchChatHistory = useCallback(async () => {
    try {
      const response = await fetch(
        `${baseURL}chat_history/?username=${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setChatHistory(data.chat_history);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  }, [username]);

  useEffect(() => {
    fetchBookmarkedRestaurants();
    fetchRecommendedRestaurants();
    fetchChatHistory();
  }, [
    fetchBookmarkedRestaurants,
    fetchRecommendedRestaurants,
    fetchChatHistory,
  ]);

  const handleDeleteAllChats = async () => {
    try {
      const response = await fetch(`${baseURL}delete_all_chats/`, {
        method: "POST",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
        credentials: "include",
      });

      if (response.ok) {
        setChatHistory([]);
        window.location.reload(); // 페이지 새로고침
      } else {
        console.log("Failed to delete chat history");
      }
    } catch (error) {
      console.log("Failed to delete chat history");
      console.error(error);
    }
  };

  const renderChatHistory = () => {
    return chatHistory.map((chat, index) => (
      <React.Fragment key={index}>
        <div className="chat__user-message-container">
          <div className="chat__user-message-box">{chat.message}</div>
          <img className="chat__user-icon" src={userImg} alt="User" />
        </div>
        <div className="chat__bot-message-container">
          <img className="chat__bot-icon" src={robotImg} alt="Bot" />
          <div className="chat__bot-message-box">{chat.response}</div>
        </div>
      </React.Fragment>
    ));
  };

  const handleBookmark = async (restaurantName) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      await fetch(`${baseURL}api/save-restaurant/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-CSRFToken": getCookie("csrftoken"),
        },
        credentials: "include",
        body: JSON.stringify({ name: restaurantName }),
      });
      await fetchBookmarkedRestaurants();
      if (selectedOption === "recommend") {
        await fetchRecommendedRestaurants(); // Refresh recommended restaurants
      }
    } catch (error) {
      console.error("Error bookmarking restaurant:", error);
    }
  };

  const handleUnbookmark = async (restaurantName) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      await fetch(`${baseURL}api/unsave-restaurant/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-CSRFToken": getCookie("csrftoken"),
        },
        credentials: "include",
        body: JSON.stringify({ name: restaurantName }),
      });
      fetchBookmarkedRestaurants();
    } catch (error) {
      console.error("Error unbookmarking restaurant:", error);
    }
  };

  const [name, setName] = useState("");
  const [showMap, setShowMap] = useState(false); // 상태를 추가하여 MapCustom 컴포넌트의 렌더링을 제어합니다.
  const [errorMessage, setErrorMessage] = useState("");
  const handleRestaurantSearch = async (e) => {
    e.preventDefault();

    try {
      const coords = await getRestaurantCoordinates(name);
      setErrorMessage("");
      setSelectedLocation(coords);
      setZoom(23);
      setSelectedRestaurant(name); // 검색된 식당 이름 상태 설정
      setSelectedOption("map"); // Mapcustom 컴포넌트를 다시 렌더링하도록 상태 변경
      setName("");
    } catch (error) {
      console.log(error.message);
    }
  };

  const [showTooltip, setShowTooltip] = useState(true);

  const toggleTooltipVisibility = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <>
      <div className="container">
        <div className="top__container">
          <div className="name_k-rebot">K-REBOT</div>
          <p className="header__logout" onClick={onLogoutHandler}>
            {t("Chat.logout")}
          </p>
        </div>
        <div className="main__container">
          <aside className="recommend">
            <div className="recommend__three-button">
              <button
                className={`recommend__map-button ${
                  selectedOption === "map" ? "active" : ""
                }`}
                onClick={handleMapButtonClick}
              >
                {t("Chat.map")}
              </button>
              <button
                className={`recommend__recommend-button ${
                  selectedOption === "recommend" ? "active" : ""
                }`}
                onClick={handleRecommendButtonClick}
              >
                {t("Chat.recommend")}
              </button>
              <button
                className={`recommend__bookmark-button ${
                  selectedOption === "bookmark" ? "active" : ""
                }`}
                onClick={handleBookmarkButtonClick}
              >
                {t("Chat.bookmark")}
              </button>
            </div>
            <div className="recommend__container">
              <div className="recommend__map-recommend-container">
                {selectedOption === "map" && (
                  <Wrapper render={render}>
                    <div className="searchandbutton">
                      <form
                        className="search"
                        onSubmit={handleRestaurantSearch}
                      >
                        <div className="recommend__input-box">
                          <input
                            type="text"
                            className="recommend__input"
                            value={name}
                            placeholder={t("Map.search")}
                            onChange={(e) => setName(e.target.value)}
                          />
                          <button
                            type="submit"
                            className="recommend__input_button"
                          ></button>
                        </div>
                        {errorMessage && (
                          <p className="recommend__error-message">
                            {errorMessage}
                          </p>
                        )}
                      </form>
                      <button
                        className="recommend__reload-button"
                        onClick={() => {
                          if (selectedOption === "map") {
                            resetMap();
                          } else if (selectedOption === "recommend") {
                            fetchRecommendedRestaurants();
                          }
                        }}
                      ></button>
                    </div>
                    {selectedRestaurant && (
                      <MapBookmark
                        className="MapBookmark"
                        restaurantName={selectedRestaurant}
                        handleBookmark={handleBookmark}
                        handleUnbookmark={handleUnbookmark}
                        bookmarkedRestaurants={bookmarkedRestaurants}
                      />
                    )}
                    <Mapcustom
                      className="Mapcustom"
                      markerLocation={selectedLocation}
                      language={localStorage.getItem("i18nextLng")}
                      zoom={zoom}
                    />
                  </Wrapper>
                )}
                {selectedOption === "recommend" && (
                  <Recommend
                    recommendedRestaurants={recommendedRestaurants}
                    baseURL={baseURL}
                    handleBookmark={handleBookmark}
                    handleUnbookmark={handleUnbookmark}
                    fetchBookmarkedRestaurants={fetchBookmarkedRestaurants}
                    bookmarkedRestaurants={bookmarkedRestaurants}
                    fetchRecommendedRestaurants={fetchRecommendedRestaurants}
                  />
                )}

                {selectedOption === "bookmark" && (
                  <Bookmark
                    bookmarkedRestaurants={bookmarkedRestaurants}
                    baseURL={baseURL}
                    handleBookmark={handleBookmark}
                    handleUnbookmark={handleUnbookmark}
                  />
                )}
              </div>
            </div>
          </aside>

          <main className="chat">
            <MessageList
              messages={messages}
              onRestaurantClick={handleRestaurantClick}
              renderChatHistory={renderChatHistory}
              handleDeleteAllChats={handleDeleteAllChats}
              chatHistory={chatHistory}
            />
            <MessageForm
              onSendMessage_user={handleSendMessage_user}
              onSendMessage_bot={handleSendMessage_bot}
              userinfo={userInfo}
            />
          </main>
        </div>
      </div>
    </>
  );
};

export default Chat;

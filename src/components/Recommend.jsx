import React from "react";
import "./../styles/Recommend.css";
import heartEmpty from "./../img/heart_empty.png";
import heartFilled from "./../img/heart_filled.png";
import coupleIcon from "./../img/romantic-couple.png";
import { RestaurantIcons } from "./RestaurantIcons";
import { useTranslation } from "react-i18next";
import bookmark from "./../img/bookmark.png";
import unbookmark from "./../img/unbookmark.png";

const Recommend = ({
  recommendedRestaurants,
  baseURL,
  handleBookmark,
  handleUnbookmark,
  bookmarkedRestaurants,
  fetchRecommendedRestaurants,
}) => {
  const { t, i18n } = useTranslation();

  const language = localStorage.getItem("i18nextLng");
  const isBookmarked = (restaurant) => {
    return bookmarkedRestaurants.some(
      (r) => r.restaurant_name === restaurant.name
    );
  };

  const toggleBookmark = (restaurant) => {
    console.log("toggle", restaurant);

    if (isBookmarked(restaurant)) {
      handleUnbookmark(restaurant.name);
    } else {
      handleBookmark(restaurant.name);
    }
  };

  return (
    <div>
      {recommendedRestaurants.map((restaurant) => (
        <div className="recommand_item_emoji" key={restaurant.id}>
          <div className="recommend-item__container">
            {language === "en" && (
              <img
                className="recommend-item__img"
                src={`${baseURL}${restaurant.resimages[0].image_en}`}
                alt={`${restaurant.name}`}
              />
            )}
            {language === "kr" && (
              <img
                className="recommend-item__img"
                src={`${baseURL}${restaurant.resimages[0].image_ko}`}
                alt={`${restaurant.name}`}
              />
            )}
            {language === "zh" && (
              <img
                className="recommend-item__img"
                src={`${baseURL}${restaurant.resimages[0].image_zh}`}
                alt={`${restaurant.name}`}
              />
            )}
            {language === "ja" && (
              <img
                className="recommend-item__img"
                src={`${baseURL}${restaurant.resimages[0].image_ja}`}
                alt={`${restaurant.name}`}
              />
            )}
            <div className="recommend_text_emoji">
              <div className="recommend-item__text-box">
                <p className="recommend-item__text">{restaurant.name}</p>
              </div>
              <div className="recooment_icon_class">
                {restaurant.mood === "연인·배우자" && (
                  <div className="recommend-item__icon-container">
                    <p className="recommend-item__icon-text font">
                      {" "}
                      🥰 {t("Mood.연인")}
                    </p>
                  </div>
                )}
                {restaurant.mood === "지인·동료" && (
                  <div className="recommend-item__icon-container">
                    <p className="recommend-item__icon-text font">
                      {" "}
                      🍽️ {t("Mood.지인")}
                    </p>
                  </div>
                )}
                {restaurant.mood === "친구" && (
                  <div className="recommend-item__icon-container">
                    <p className="recommend-item__icon-text font">
                      {" "}
                      🤗 {t("Mood.친구")}
                    </p>
                  </div>
                )}
                <RestaurantIcons category={restaurant.category} />
              </div>
            </div>

            {isBookmarked(restaurant) ? (
              <img
                src={bookmark}
                alt="heart"
                className="heart-icon"
                onClick={() => toggleBookmark(restaurant)}
              />
            ) : (
              <img
                src={unbookmark}
                alt="heart"
                className="heart-icon"
                onClick={() => toggleBookmark(restaurant)}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recommend;

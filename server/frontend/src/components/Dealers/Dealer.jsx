import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from "../Header/Header";

const Dealer = () => {
  const { id } = useParams();

  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingDealer, setLoadingDealer] = useState(true);
  const [unreviewed, setUnreviewed] = useState(false);

  const root_url = window.location.origin + "/";
  const dealer_url = `${root_url}djangoapp/dealer/${id}`;
  const reviews_url = `${root_url}djangoapp/reviews/dealer/${id}`;

  const getDealer = async () => {
    try {
      const res = await fetch(dealer_url);
      const data = await res.json();
      if (data.status === 200) {
        setDealer(data.dealer);
      }
    } finally {
      setLoadingDealer(false);
    }
  };

  const getReviews = async () => {
    const res = await fetch(reviews_url);
    const data = await res.json();
    if (data.status === 200 && data.reviews.length > 0) {
      setReviews(data.reviews);
    } else {
      setUnreviewed(true);
    }
  };

  const sentiIcon = (sentiment) =>
    sentiment === "positive"
      ? positive_icon
      : sentiment === "negative"
      ? negative_icon
      : neutral_icon;

  useEffect(() => {
    getDealer();
    getReviews();
  }, []);

  if (loadingDealer) {
    return (
      <div>
        <Header />
        <h3 style={{ margin: "20px" }}>Loading dealer details...</h3>
      </div>
    );
  }

  if (!dealer) {
    return (
      <div>
        <Header />
        <h3 style={{ margin: "20px" }}>Dealer not found</h3>
      </div>
    );
  }

  return (
    <div style={{ margin: "20px" }}>
      <Header />

      <h1 style={{ color: "grey" }}>
        {dealer.full_name}
        {sessionStorage.getItem("username") && (
          <Link to={`/postreview/${id}`}>
            <img
              src={review_icon}
              alt="Post Review"
              style={{ width: "8%", marginLeft: "10px" }}
            />
          </Link>
        )}
      </h1>

      <h4 style={{ color: "grey" }}>
        {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
      </h4>
        <a href={`/searchcars/${id}`}>SearchCars</a>	
      <div className="reviews_panel">
        {reviews.length === 0 && !unreviewed ? (
          <div>Loading Reviews...</div>
        ) : unreviewed ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review, idx) => (
            <div className="review_panel" key={idx}>
              <img
                src={sentiIcon(review.sentiment)}
                className="emotion_icon"
                alt="sentiment"
              />
              <div className="review">{review.review}</div>
              <div className="reviewer">
                {review.name} {review.car_make} {review.car_model}{" "}
                {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;

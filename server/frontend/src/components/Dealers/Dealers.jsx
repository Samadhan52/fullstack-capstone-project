import React, { useState, useEffect } from "react";
import "./Dealers.css";
import "../assets/style.css";
import Header from "../Header/Header";
import review_icon from "../assets/reviewicon.png";

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [originalDealers, setOriginalDealers] = useState([]);
  const [states, setStates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const isLoggedIn = sessionStorage.getItem("username") !== null;

  // Fetch dealers
  const getDealers = async () => {
    try {
      const res = await fetch(
        "https://u31241596-3030.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/fetchDealers"
      );
      const data = await res.json();

      if (Array.isArray(data)) {
        setDealersList(data);
        setOriginalDealers(data);

        const uniqueStates = [...new Set(data.map(d => d.state))];
        setStates(uniqueStates);
      } else {
        setDealersList([]);
        setOriginalDealers([]);
      }
    } catch (error) {
      console.error("Error fetching dealers:", error);
      setDealersList([]);
      setOriginalDealers([]);
    }
  };

  // 🔍 Handle typing in search box
  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filtered = originalDealers.filter(dealer =>
      dealer.state.toLowerCase().includes(query.toLowerCase())
    );

    setDealersList(filtered);
  };

  // 🔄 Reset list when input loses focus & empty
  const handleLostFocus = () => {
    if (!searchQuery) {
      setDealersList(originalDealers);
    }
  };

  useEffect(() => {
    getDealers();
  }, []);

  return (
    <div>
      <Header />

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Dealer Name</th>
            <th>City</th>
            <th>Address</th>
            <th>Zip</th>
            <th>
              <input
                type="text"
                placeholder="Search states..."
                value={searchQuery}
                onChange={handleInputChange}
                onBlur={handleLostFocus}
                style={{ padding: "5px", width: "140px" }}
              />
            </th>
            {isLoggedIn && <th>Review Dealer</th>}
          </tr>
        </thead>

        <tbody>
          {dealersList.length === 0 ? (
            <tr>
              <td colSpan={isLoggedIn ? 7 : 6} style={{ textAlign: "center" }}>
                No dealers found
              </td>
            </tr>
          ) : (
            dealersList.map((dealer) => (
              <tr key={dealer.id}>
                <td>{dealer.id}</td>
                <td>
                  <a href={`/dealer/${dealer.id}`}>{dealer.full_name}</a>
                </td>
                <td>{dealer.city}</td>
                <td>{dealer.address}</td>
                <td>{dealer.zip}</td>
                <td>{dealer.state}</td>
                {isLoggedIn && (
                  <td>
                    <a href={`/postreview/${dealer.id}`}>
                      <img
                        src={review_icon}
                        className="review_icon"
                        alt="Post Review"
                      />
                    </a>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dealers;

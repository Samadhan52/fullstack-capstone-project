import React, { useState, useEffect } from "react";
import "./Dealers.css";
import "../assets/style.css";
import Header from "../Header/Header";
import review_icon from "../assets/reviewicon.png";

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [dealersListOriginal, setDealersListOriginal] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  const isLoggedIn = sessionStorage.getItem("username") != null;

  // Fetch all dealers
  const getDealers = async () => {
    try {
        const res = await fetch(
            "https://u31241596-3030.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/fetchDealers"
          );
          
      const data = await res.json();
      console.log("Dealers API response:", data);

      if (Array.isArray(data)) {
        setDealersList(data);
        setDealersListOriginal(data); // save full list for filtering
        const uniqueStates = Array.from(new Set(data.map((d) => d.state)));
        setStates(uniqueStates);
      } else {
        console.warn("Unexpected data format:", data);
        setDealersList([]);
        setDealersListOriginal([]);
        setStates([]);
      }
    } catch (err) {
      console.error("Error fetching dealers:", err);
      setDealersList([]);
      setDealersListOriginal([]);
      setStates([]);
    }
  };

  // Filter dealers in-memory
  const filterDealers = (state) => {
    setSelectedState(state);

    if (state === "All" || state === "") {
      setDealersList(dealersListOriginal);
      return;
    }

    const filtered = dealersListOriginal.filter(
      (dealer) => dealer.state === state
    );
    setDealersList(filtered);
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
              <select
                name="state"
                id="state"
                value={selectedState}
                onChange={(e) => filterDealers(e.target.value)}
              >
                <option value="" disabled hidden>
                  State
                </option>
                <option value="All">All States</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
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

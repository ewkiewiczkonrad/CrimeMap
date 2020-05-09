import React, { useState } from "react";
import useSwr from "swr";
import ReactMapGL, { Marker, Popup } from "react-map-gl";

const fetcher = (...args) => fetch(...args).then((response) => response.json());

export default function App() {
  const [viewport, setViewport] = useState({
    latitude: 52.6376,
    longitude: -1.135171,
    width: "100vw",
    height: "100vh",
    zoom: 13,
  });
  const [selectedCrime, setSelectedCrime] = useState(null);
  const dat = "2020-03";

  const url =
    "https://data.police.uk/api/crimes-street/all-crime?lat=52.629729&lng=-1.131592&date=" +
    dat;

  const { data, error } = useSwr(url, fetcher);
  const crimes = data && !error ? data.slice(0, 1000) : [];

  return (
    <div>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken="pk.eyJ1IjoibGl2ZXJlayIsImEiOiJjazl5a2R3cTkwbHlvM3NxZG5ybG4zNDkxIn0.IvbBqqO9o0RRGTmJxGoXTg"
        mapStyle="mapbox://styles/liverek/ck9yliw1f0pqi1ilh94wtwued"
        onViewportChange={(viewport) => {
          setViewport(viewport);
        }}
      >
        {crimes.map((crime) => (
          <Marker
            key={crime.id}
            latitude={parseFloat(crime.location.latitude)}
            longitude={parseFloat(crime.location.longitude)}
          >
            <button
              className="crime-marker"
              onClick={(e) => {
                e.preventDefault();
                setSelectedCrime(crime);
              }}
            >
              <img src="../2.png" alt="Crime" />
            </button>
          </Marker>
        ))}

        {selectedCrime ? (
          <Popup
            latitude={parseFloat(selectedCrime.location.latitude)}
            longitude={parseFloat(selectedCrime.location.longitude)}
            onClose={() => {
              setSelectedCrime(null);
            }}
          >
            <div>
              <h2>{selectedCrime.category}</h2>
              <p>Street: {selectedCrime.location.street.name}</p>
            </div>
          </Popup>
        ) : null}
      </ReactMapGL>
    </div>
  );
}

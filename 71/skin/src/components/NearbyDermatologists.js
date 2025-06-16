import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#000000',
    color: 'white',
    overflow: 'hidden',
    paddingTop: '10px', // Reduced padding to move content up
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#61dafb',
    textAlign: 'center',
    marginBottom: '20px',
  },
  leftPanel: {
    flex: 2,
    color: 'white',
    padding: '10px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start', // Move content closer to the top
    alignItems: 'flex-start', // Align content to the left
    gap: '10px',
    marginLeft: '10%', // Add margin to move content closer to the center
  },
  rightPanel: {
    flex: 1,
    backgroundImage: 'url("/1.jpg")', // Use the image as background
    backgroundSize: 'contain', // Adjust size to fit perfectly
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center', // Center the image
  },
  iframe: {
    width: '90%', // Adjust width for better alignment
    height: '400px',
    border: 'none',
    borderRadius: '12px', // Add rounded corners
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.6)', // Add shadow for depth
  },
  error: {
    color: 'red',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: '1rem',
    color: '#ddd',
    lineHeight: '1.4',
  },
};

function NearbyDermatologists() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          setError('Unable to retrieve your location. Please enable location services.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <h2 style={styles.title}>Nearby Dermatologists</h2>
        {error && <p style={styles.error}>{error}</p>}
        {location ? (
          <>
            <p style={styles.paragraph}>
              Find dermatologists near your location using the map below:
            </p>
            <iframe
              title="Nearby Dermatologists"
              src={`https://www.google.com/maps?q=dermatologists+near+${location.latitude},${location.longitude}&output=embed`}
              style={styles.iframe}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </>
        ) : (
          !error && <p style={styles.paragraph}>Loading your location...</p>
        )}
      </div>
      <div style={styles.rightPanel}></div>
    </div>
  );
}

export default NearbyDermatologists;

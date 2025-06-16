import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import About from './About';
import Feedback from './Feedback';
import FoodRecommendation from './components/FoodRecommendation';
import CausePrediction from './components/CausePrediction';
import NearbyDermatologists from './components/NearbyDermatologists';
import { GoogleGenAI, createPartFromUri } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GOOGLE_GENAI_API_KEY });

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    color: 'white',
  },
  nav: {
    position: 'fixed', // Make the header fixed
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // Ensure it stays above other content
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    background: 'rgba(0, 0, 0, 0.8)', // Semi-transparent black for contrast
    color: 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
  },
  navTitle: {
    margin: 0,
    fontSize: '2rem',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '25px',
    margin: 0,
    padding: 0,
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.1rem',
    transition: 'color 0.3s ease',
  },
  content: {
    flex: 1,
    padding: '20px',
    marginTop: '80px', // Add margin to account for the fixed header height
  },
};

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    document.body.style.backgroundImage = 'url("/1.jpg")'; // Set background image
    document.body.style.backgroundSize = 'auto'; // Preserve original size
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'calc(100% - 150px) center'; // Move closer to the center from the right edge
    document.body.style.backgroundColor = '#000000'; // Fallback black color
    document.body.style.color = 'white'; // Default text color
    document.body.style.margin = '0';
    document.body.style.minHeight = '100vh';
  }, []);

  const handleFileInput = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const models = ['gemini-2.0-flash', 'gemini-1.5', 'gemini-1.0']; // List of models to try
      let modelIndex = 0;

      try {
        console.log("Step 1: File selected:", file); // Log the selected file
        setSelectedImage(URL.createObjectURL(file)); // Display the selected image
        setLoading(true);
        setResult(null); // Clear previous results

        // Step 2: Upload the image using the Files API
        console.log("Step 2: Uploading file...");
        const uploadedFile = await ai.files.upload({
          file,
          config: { mimeType: file.type },
        });
        console.log("Step 2: File uploaded successfully:", uploadedFile);

        let response;
        while (modelIndex < models.length) {
          const model = models[modelIndex];
          console.log(`Step 3: Trying model: ${model}`);
          const payload = {
            model,
            contents: [
              createPartFromUri(uploadedFile.uri, uploadedFile.mimeType),
              'Analyze this skin condition image and provide details in the following format: Disease Name: [Disease Name], Medications: [Medications], Severity: [Severity], Quick Remedies: [Quick Remedies].',
            ],
          };

          try {
            response = await retryWithBackoff(async () => {
              return await ai.models.generateContent(payload);
            }, 5); // Optionally increase retries
            break; // Exit loop if successful
          } catch (error) {
            if (error.message.includes("503")) {
              console.warn(`Model ${model} is overloaded. Trying next model...`);
              modelIndex++;
            } else {
              throw error; // Rethrow if it's not a 503 error
            }
          }
        }

        if (!response) {
          throw new Error("All models are overloaded. Please try again later.");
        }

        console.log("Step 3: Raw API Response:", response); // Log the entire raw response
        if (response && response.text) {
          console.log("Step 3: Response Text:", response.text); // Log the text part specifically
          const parsedResult = parseResponse(response.text);
          if (typeof parsedResult === 'string' || !parsedResult["Disease Name"] || !parsedResult["Medications"] || !parsedResult["Severity"] || !parsedResult["Quick Remedies"]) {
            setResult({
              name: "Analysis Failed",
              confidence: 0,
              message: parsedResult || "Could not parse the response. Please try again."
            });
          } else {
            setResult({
              name: parsedResult["Disease Name"],
              confidence: 0.8, // Example confidence score
              ...parsedResult
            });
          }
        } else {
          console.warn("Step 3: No result found in the response.");
          setResult({ name: "No Result", confidence: 0, message: "No result found. Please try again." });
        }
      } catch (error) {
        console.error("Error during file processing:", error?.response?.data || error.message);
        let message = "An unexpected error occurred.";
        if (error.message.includes("503")) {
          message = "All models are currently overloaded. Please try again in a few minutes.";
        } else if (error.message.includes("500")) {
          console.error("Step 4: Internal server error.");
          message = `An internal server error occurred. Please try again later or contact support if the issue persists. API Error: ${error?.response?.data?.error?.message || error.message}`;
        } else if (error.response) {
          console.error("Step 4: API Error Response:", error.response); // Log detailed API error response
          message = `An error occurred while communicating with the server. Please try again. Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`;
        }
        setResult({ name: "Error", confidence: 0, message });
      } finally {
        console.log("Step 5: Process completed.");
        setLoading(false);
      }
    } else {
      console.warn("Step 1: No file was selected.");
    }
  };

  const retryWithBackoff = async (fn, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i < retries - 1 && error.message.includes("503")) {
          console.warn(`Retrying... (${i + 1}/${retries})`);
          await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i))); // Exponential backoff
        } else {
          throw error;
        }
      }
    }
  };

  const parseResponse = (text) => {
    const result = {};
    try {
      // Use regex to extract the disease name, medications, severity, and quick remedies
      const diseaseNameMatch = text.match(/Disease Name:\s*(.*?)\n/);
      const medicationsMatch = text.match(/Medications:\s*(.*?)\n/);
      const severityMatch = text.match(/Severity:\s*(.*?)\n/);
      const quickRemediesMatch = text.match(/Quick Remedies:\s*([\s\S]*)/);

      let quickRemedies = quickRemediesMatch ? quickRemediesMatch[1].trim() : null;

      // Remove asterisks and block disclaimers or similar messages
      if (quickRemedies) {
        quickRemedies = quickRemedies
          .replace(/\*/g, '') // Remove asterisks
          .replace(/(Important Note:|Disclaimer:|This information is for general knowledge purposes only[\s\S]*?$)/gi, '') // Remove disclaimers
          .replace(/(Please consult a healthcare professional[\s\S]*?$)/gi, '') // Remove consultation messages
          .replace(/(The AI-generated content is not a substitute[\s\S]*?$)/gi, '') // Remove AI disclaimer messages
          .trim();
      }

      result["Disease Name"] = diseaseNameMatch ? diseaseNameMatch[1].trim() : null;
      result["Medications"] = medicationsMatch ? medicationsMatch[1].trim() : null;
      result["Severity"] = severityMatch ? severityMatch[1].trim() : null;
      result["Quick Remedies"] = quickRemedies;

      if (!result["Disease Name"] || !result["Medications"] || !result["Severity"] || !result["Quick Remedies"]) {
        console.warn("Could not parse all fields from the response.");
        return "Could not parse the response. Please try again.";
      }

      return result;
    } catch (error) {
      console.error("Error parsing response:", error);
      return "Could not parse the response. Please try again.";
    }
  };

  const triggerFileInput = () => {
    document.getElementById('fileInput').click();
  };

  return (
    <Router>
      <div style={styles.app}>
        <nav style={styles.nav}>
          <h1 style={styles.navTitle}>SMART DERMATOLOGY</h1>
          <ul style={styles.navLinks}>
            <li><Link to="/" style={styles.navLink}>Home</Link></li>
            <li><Link to="/about" style={styles.navLink}>About</Link></li>
            <li><Link to="/feedback" style={styles.navLink}>Feedback</Link></li>
            {result && (
              <>
                <li><Link to="/food-recommendation" style={styles.navLink}>Food Recommendation</Link></li>
                <li><Link to="/cause-prediction" style={styles.navLink}>Cause Prediction</Link></li>
                <li><Link to="/nearby-dermatologists" style={styles.navLink}>Nearby Dermatologists</Link></li>
              </>
            )}
          </ul>
        </nav>
        <div style={styles.content}>
          <Routes>
            <Route path="/" element={
              <section
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)', // Center the section both vertically and horizontally
                  textAlign: 'center', // Center-align content
                  background: 'rgba(0, 0, 0, 0.9)', // Darker semi-transparent background for better readability
                  padding: '40px',
                  borderRadius: '15px', // Larger border radius for a modern look
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.7)', // Enhanced shadow for depth
                  maxWidth: '600px', // Limit width for better readability
                  width: '90%', // Responsive width
                }}
              >
                <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#61dafb' }}>Welcome to Smart Dermatology</h2>
                <p style={{ fontSize: '1.1rem', marginBottom: '25px', color: '#ddd' }}>
                  Upload an image to get a general analysis of the skin condition.
                </p>
                {/* Disclaimer */}
                <p style={{
                  fontSize: '0.9rem',
                  fontStyle: 'italic',
                  color: '#bbb',
                  marginTop: '20px',
                  borderTop: '1px solid #444',
                  paddingTop: '15px',
                }}>
                  <strong>Disclaimer:</strong> This tool provides general information based on AI analysis and is not a substitute for professional medical diagnosis or advice. Consult a qualified dermatologist for any health concerns.
                </p>
                <button
                  onClick={triggerFileInput}
                  style={{
                    padding: '15px 30px',
                    fontSize: '1.2rem',
                    background: 'linear-gradient(90deg, #61dafb, #21a1f1)',
                    border: 'none',
                    borderRadius: '10px', // Larger border radius for a modern look
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    marginTop: '25px',
                    opacity: loading ? 0.6 : 1,
                    pointerEvents: loading ? 'none' : 'auto',
                  }}
                  disabled={loading}
                >
                  Check Your Skin
                </button>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileInput}
                />
                {loading && <p style={{ marginTop: '20px', fontStyle: 'italic', color: '#61dafb' }}>Analyzing image, please wait...</p>}
                {selectedImage && (
                  <div style={{ marginTop: '25px' }}>
                    <img src={selectedImage} alt="Selected skin condition" style={{
                      maxWidth: '100%',
                      maxHeight: '350px', // Larger preview height
                      borderRadius: '12px',
                      marginTop: '20px',
                      display: 'block',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.6)', // Add shadow for better visibility
                    }} />
                  </div>
                )}
                {result && (
                  <div
                    style={{
                      marginTop: '35px',
                      background: 'rgba(20, 24, 36, 0.98)',
                      borderRadius: '18px',
                      boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
                      padding: '32px 28px 28px 28px',
                      maxWidth: '520px',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      border: '1.5px solid #222c3c',
                      backdropFilter: 'blur(2px)',
                      transition: 'box-shadow 0.3s',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '2rem',
                        marginBottom: '28px',
                        color: '#61dafb',
                        letterSpacing: '1px',
                        fontWeight: 700,
                        textShadow: '0 2px 12px #0a2233',
                        borderBottom: '1.5px solid #233a4d',
                        paddingBottom: '12px',
                        textAlign: 'center',
                      }}
                    >
                      Analysis Result
                    </h3>
                    {typeof result === 'string' ? (
                      <p
                        style={{
                          fontSize: '1.15rem',
                          color: '#e0e6ed',
                          lineHeight: '1.7',
                          margin: '0 0 8px 0',
                          textAlign: 'center',
                          letterSpacing: '0.2px',
                        }}
                      >
                        {result}
                      </p>
                    ) : (
                      <div
                        style={{
                          fontSize: '1.13rem',
                          color: '#e0e6ed',
                          lineHeight: '1.7',
                          textAlign: 'left',
                        }}
                      >
                        <p><strong>Disease Name:</strong> {result["Disease Name"]}</p>
                        <p style={{ marginTop: '10px' }}><strong>Confidence:</strong> {Math.round(result.confidence * 100)}%</p>
                        <p style={{ marginTop: '10px' }}><strong>Medications:</strong> {result["Medications"]}</p>
                        <p style={{ marginTop: '10px' }}><strong>Severity:</strong> {result["Severity"]}</p>
                        <p style={{ marginTop: '10px' }}><strong>Quick Remedies:</strong></p>
                        <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                          {result["Quick Remedies"].split('\n').map((remedy, index) => (
                            <li key={index} style={{ marginBottom: '8px' }}>{remedy}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </section>
            } />
            <Route path="/about" element={<About />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/food-recommendation" element={result ? <FoodRecommendation diseaseName={result["Disease Name"]} /> : null} />
            <Route path="/cause-prediction" element={result ? <CausePrediction diseaseName={result["Disease Name"]} /> : null} />
            <Route path="/nearby-dermatologists" element={result ? <NearbyDermatologists diseaseName={result["Disease Name"]} /> : null} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
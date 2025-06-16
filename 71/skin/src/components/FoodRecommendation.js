import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GOOGLE_GENAI_API_KEY });

const styles = {
  container: {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    color: 'white',
    backgroundImage: 'url("/1.jpg")',
    backgroundSize: 'auto',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'calc(100% - 150px) center',
    backgroundColor: '#000000',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    padding: '20px',
    margin: '0',
    overflow: 'hidden', // Prevent scrolling
  },
  content: {
    background: 'rgba(0, 0, 0, 0.8)', // Semi-transparent background
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.7)',
    maxWidth: '600px',
    textAlign: 'left',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#61dafb',
    marginBottom: '20px',
    textAlign: 'center',
  },
  list: {
    textAlign: 'left',
    margin: '20px 0',
    paddingLeft: '20px',
    color: '#ddd',
    lineHeight: '1.6',
  },
  loading: {
    fontSize: '1.2rem',
    color: '#61dafb',
    marginTop: '20px',
    textAlign: 'center',
  },
};

function FoodRecommendation({ diseaseName }) {
  const [recommendations, setRecommendations] = useState({ bestFoods: [], foodsToAvoid: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      console.log("Fetching food recommendations for disease:", diseaseName);
      setLoading(true);
      setRecommendations({ bestFoods: [], foodsToAvoid: [] });

      const prompt = `
        Based on the disease "${diseaseName}", provide a list of:
        1. Best foods to eat to help manage or improve the condition.
        2. Foods to avoid that may worsen the condition.
        Provide the response in the format:
        Best Foods:
        - [Food Name]
        Foods to Avoid:
        - [Food Name]
      `;

      const models = ['gemini-2.5-flash-preview-04-17', 'gemini-2.0-flash', 'gemini-1.5'];
      let modelIndex = 0;

      while (modelIndex < models.length) {
        try {
          console.log(`Trying model: ${models[modelIndex]}`);
          const result = await ai.models.generateContent({
            model: models[modelIndex],
            contents: [prompt],
            config: {
              maxOutputTokens: 300,
              temperature: 0.7,
            },
          });

          if (result.text) {
            console.log("Response received:", result.text);
            const sections = result.text ? result.text.split('Foods to Avoid:') : [];
            const bestFoods = sections[0]
              ? sections[0]
                  .replace('Best Foods:', '')
                  .replace(/\*/g, '') // Remove asterisks
                  .replace(/(Important Note:|Disclaimer:|This information is for general knowledge purposes only[\s\S]*?$)/gi, '') // Remove disclaimers
                  .replace(/(Please consult a healthcare professional[\s\S]*?$)/gi, '') // Remove consultation messages
                  .replace(/(The AI-generated content is not a substitute[\s\S]*?$)/gi, '') // Remove AI disclaimer messages
                  .split('\n')
                  .filter((item) => item.trim() !== '')
                  .map((item) => item.trim().replace('- ', ''))
              : [];

            const foodsToAvoid = sections[1]
              ? sections[1]
                  .replace(/\*/g, '') // Remove asterisks
                  .replace(/(Important Note:|Disclaimer:|This information is for general knowledge purposes only[\s\S]*?$)/gi, '') // Remove disclaimers
                  .replace(/(Please consult a healthcare professional[\s\S]*?$)/gi, '') // Remove consultation messages
                  .replace(/(The AI-generated content is not a substitute[\s\S]*?$)/gi, '') // Remove AI disclaimer messages
                  .split('\n')
                  .filter((item) => item.trim() !== '')
                  .map((item) => item.trim().replace('- ', ''))
              : [];

            console.log("Parsed recommendations:", { bestFoods, foodsToAvoid });
            setRecommendations({
              bestFoods: bestFoods || [],
              foodsToAvoid: foodsToAvoid || [],
            });
            break;
          }
        } catch (error) {
          console.error(`Error with model ${models[modelIndex]}:`, error.message);
          if (modelIndex === models.length - 1) {
            setRecommendations({
              bestFoods: ['Failed to fetch recommendations. Please try again later.'],
              foodsToAvoid: [],
            });
          }
        }
        modelIndex++;
      }

      setLoading(false);
    };

    if (diseaseName) {
      fetchRecommendations();
    }
  }, [diseaseName]);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h2 style={styles.title}>Food Recommendations</h2>
        {loading ? (
          <p style={styles.loading}>Loading recommendations...</p>
        ) : (
          <>
            <p>Based on your skin condition, <strong>{diseaseName}</strong>, here are some dietary recommendations:</p>
            <h3>Best Foods to Eat:</h3>
            <ul style={styles.list}>
              {recommendations.bestFoods.map((food, index) => (
                <li key={index}>{food}</li>
              ))}
            </ul>
            <h3>Foods to Avoid:</h3>
            <ul style={styles.list}>
              {recommendations.foodsToAvoid.map((food, index) => (
                <li key={index}>{food}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default FoodRecommendation;

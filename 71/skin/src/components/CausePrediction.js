import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GOOGLE_GENAI_API_KEY });

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
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
    justifyContent: 'flex-start', // Move content closer to the top
    alignItems: 'center',
    paddingTop: '60px', // Adjust padding to move content up
  },
  questionContainer: {
    margin: '20px auto',
    maxWidth: '600px',
    textAlign: 'left',
    background: 'rgba(0, 0, 0, 0.7)',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.6)',
  },
  questionLabel: {
    display: 'block',
    marginBottom: '10px',
    fontSize: '1.1rem',
    color: '#ddd',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #666',
    fontSize: '1rem',
    backgroundColor: '#222',
    color: 'white',
  },
  button: {
    padding: '12px 24px',
    background: 'linear-gradient(90deg, #61dafb, #21a1f1)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  loading: {
    fontSize: '1.2rem',
    color: '#61dafb',
    marginTop: '20px',
  },
  response: {
    marginTop: '20px',
    padding: '20px',
    background: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '12px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.7)',
    color: '#e0e6ed',
    textAlign: 'left',
    lineHeight: '1.6',
    fontSize: '1.1rem',
  },
  responseTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#61dafb',
    marginBottom: '15px',
    borderBottom: '1px solid #444',
    paddingBottom: '10px',
  },
  responseItem: {
    marginBottom: '10px',
    padding: '10px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#61dafb',
    marginBottom: '20px',
  },
};

function CausePrediction({ diseaseName }) {
  const [questions, setQuestions] = useState([]);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateQuestions = async () => {
    console.log("Generating questions for disease:", diseaseName);
    setLoading(true);
    setQuestions([]);
    setResponse(null);

    const prompt = `
      Generate a list of specific, insightful, and relevant questions to help identify potential causes for the following skin condition:
      Disease: ${diseaseName}
      Ensure the questions are detailed and cover aspects such as lifestyle, environmental factors, medical history, and symptoms.
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
            maxOutputTokens: 200,
            temperature: 0.7,
          },
        });

        if (result.text) {
          console.log("Questions generated successfully:", result.text);
          const generatedQuestions = result.text.split('\n').filter((q) => q.trim() !== '');
          setQuestions(generatedQuestions);
          break;
        }
      } catch (error) {
        console.error(`Error with model ${models[modelIndex]}:`, error.message);
        if (modelIndex === models.length - 1) {
          setQuestions(['Failed to generate questions. Please try again later.']);
        }
      }
      modelIndex++;
    }

    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting answers for disease:", diseaseName);
    setLoading(true);
    setResponse(null);

    const answers = Array.from(e.target.elements)
      .filter((el) => el.name.startsWith('question'))
      .map((el) => el.value);

    console.log("Collected answers:", answers);

    const prompt = `
      Disease: ${diseaseName}
      ${answers.map((answer, index) => `Question ${index + 1}: ${answer}`).join('\n')}
      Based on the above information, provide a concise summary of the potential causes for the disease.
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

        if (result && result.text) {
          console.log("Response received:", result.text);
          const cleanedResponse = result.text
            .replace(/\*/g, '') // Remove asterisks
            .replace(/(Important Note:|Disclaimer:|This information is for general knowledge purposes only[\s\S]*?$)/gi, '') // Remove disclaimers
            .replace(/(Please consult a healthcare professional[\s\S]*?$)/gi, '') // Remove consultation messages
            .replace(/(The AI-generated content is not a substitute[\s\S]*?$)/gi, '') // Remove AI disclaimer messages
            .trim();
          setResponse(cleanedResponse);
        } else {
          console.warn("No summary identified.");
          setResponse('No summary identified. Please try again.');
        }
      } catch (error) {
        console.error(`Error with model ${models[modelIndex]}:`, error.message);
        if (modelIndex === models.length - 1) {
          setResponse('All models failed. Please try again later.');
        }
      }
      modelIndex++;
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Cause Prediction</h2>
      <p>Answer the following questions to help us predict potential causes of your skin condition, <strong>{diseaseName}</strong>:</p>
      {questions.length === 0 && !loading && (
        <button onClick={generateQuestions} style={styles.button}>
          Generate Questions
        </button>
      )}
      {loading && <p style={styles.loading}>Loading...</p>}
      {questions.length > 0 && (
        <form onSubmit={handleSubmit} style={styles.questionContainer}>
          {questions.map((question, index) => (
            <div key={index}>
              <label style={styles.questionLabel}>
                {question}
                <input type="text" name={`question${index + 1}`} style={styles.input} required />
              </label>
            </div>
          ))}
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Analyzing...' : 'Submit'}
          </button>
        </form>
      )}
      {response && (
        <div style={styles.response}>
          <div style={styles.responseTitle}>Summary</div>
          {response === 'All models failed. Please try again later.'
            ? 'We encountered an issue processing your request. Please try again later.'
            : response}
        </div>
      )}
    </div>
  );
}

export default CausePrediction;

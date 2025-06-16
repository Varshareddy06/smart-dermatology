import React from 'react';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#000000', // Black background
    color: 'white',
    overflow: 'auto', // Allow scrolling for content
  },
  leftPanel: {
    flex: 2,
    padding: '40px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // Center content vertically
    alignItems: 'flex-start', // Align content to the left
    maxWidth: '55%', // Reduce the width to move content further left
    marginLeft: '5%', // Add margin to move the content away from the edge
    position: 'relative', // Ensure proper positioning for scrolling
    zIndex: 1, // Ensure content is above the background
  },
  rightPanel: {
    flex: 1,
    backgroundImage: 'url("/1.jpg")', // Use the image as background
    backgroundSize: 'auto', // Preserve the original size of the image
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center', // Center the image
    position: 'fixed', // Fix the image in place
    top: 0,
    right: 0,
    bottom: 0,
    width: '35%', // Fixed width for the image panel
    zIndex: 0, // Ensure the image stays behind the content
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.7)', // Add shadow for better separation
  },
  header: {
    marginBottom: '30px',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#61dafb', // Highlighted color for the header
    textAlign: 'left', // Align the header to the left
  },
  subHeader: {
    marginBottom: '20px',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#61dafb',
  },
  paragraph: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    marginBottom: '20px',
    color: '#ddd',
  },
  list: {
    textAlign: 'left',
    margin: '20px 0',
    paddingLeft: '20px',
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: '#ddd',
  },
  disclaimer: {
    fontSize: '1rem',
    fontStyle: 'italic',
    color: '#bbb',
    marginTop: '30px',
    borderTop: '1px solid #444',
    paddingTop: '15px',
    lineHeight: '1.6',
  },
};

function About() {
  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <header>
          <h2 style={styles.header}>About Smart Dermatology</h2>
          <h3 style={styles.subHeader}>Our Mission:</h3>
          <p style={styles.paragraph}>
            Welcome to Smart Dermatology! Our goal is to empower you with preliminary insights into common skin conditions using the power of Artificial Intelligence. We aim to foster greater awareness and encourage informed conversations with healthcare professionals.
          </p>
          <h3 style={styles.subHeader}>How It Works:</h3>
          <ul style={styles.list}>
            <li><strong>Upload:</strong> Simply upload a clear image of the skin area you're curious about.</li>
            <li><strong>AI Analysis:</strong> Our application utilizes Google's advanced Gemini AI model to analyze the visual characteristics of the image provided.</li>
            <li><strong>Receive Information:</strong> Based on the analysis, you'll receive general information which may include:
              <ul style={styles.list}>
                <li>Potential condition names commonly associated with such visuals.</li>
                <li>General, non-prescription relief measures or remedies.</li>
                <li>An estimated severity level (e.g., Mild, Moderate).</li>
              </ul>
            </li>
          </ul>
          <h3 style={styles.subHeader}>Crucial Medical Disclaimer:</h3>
          <p style={styles.disclaimer}>
            <strong>Smart Dermatology is an informational tool ONLY.</strong><br />
            <strong>It is NOT a substitute for professional medical advice, diagnosis, or treatment.</strong><br />
            The AI provides suggestions based on patterns; it <strong>CANNOT</strong> provide a definitive medical diagnosis.<br />
            AI analysis lacks the context of your medical history, lifestyle, and a physical examination that only a qualified healthcare provider can offer.<br />
            <strong>ALWAYS</strong> consult a certified dermatologist or healthcare professional for any health concerns or before making any decisions about your health or treatment. Do not disregard or delay seeking professional medical advice because of information obtained from this application.
          </p>
          <h3 style={styles.subHeader}>Our Hope:</h3>
          <p style={styles.paragraph}>
            We hope Smart Dermatology serves as a helpful first step in understanding your skin better, guiding you toward seeking appropriate professional care when needed.
          </p>
          <p style={styles.paragraph}>Thank you for using Smart Dermatology responsibly.</p>
        </header>
      </div>
      <div style={styles.rightPanel}></div>
    </div>
  );
}

export default About;

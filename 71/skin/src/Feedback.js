import React from 'react';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh', // Ensure the container takes the full viewport height
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#000000', // Black background
    color: 'white',
    overflow: 'hidden', // Prevent scrolling
  },
  leftPanel: {
    flex: 2,
    padding: '20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start', // Move content slightly up
    alignItems: 'center', // Center content horizontally
    marginTop: '-20px', // Adjust margin to move content up
    overflow: 'hidden', // Prevent content overflow
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
    marginBottom: '20px',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#61dafb', // Highlighted color for the header
  },
  paragraph: {
    fontSize: '1rem',
    lineHeight: '1.6',
    marginBottom: '20px',
    color: '#ddd',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '100%', // Ensure the form takes full width
    maxWidth: '500px', // Limit the form width for better readability
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #666',
    fontSize: '1rem',
    backgroundColor: '#222', // Darker background for inputs
    color: 'white',
  },
  textarea: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #666',
    fontSize: '1rem',
    backgroundColor: '#222', // Darker background for textareas
    color: 'white',
    resize: 'none', // Prevent resizing
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
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 10px rgba(33, 161, 241, 0.5)',
    },
  },
};

function Feedback() {
  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <header>
          <h2 style={styles.header}>Feedback</h2>
          <p style={styles.paragraph}>
            We value your feedback! Please share your thoughts below:
          </p>
          <form style={styles.form}>
            <input
              type="text"
              placeholder="Name"
              required
              style={styles.input}
            />
            <input
              type="email"
              placeholder="Email"
              required
              style={styles.input}
            />
            <textarea
              placeholder="How was your experience?"
              rows="3"
              required
              style={styles.textarea}
            ></textarea>
            <textarea
              placeholder="Suggestions"
              rows="5"
              style={styles.textarea}
            ></textarea>
            <button type="submit" style={styles.button}>
              Submit Feedback
            </button>
          </form>
        </header>
      </div>
      <div style={styles.rightPanel}></div>
    </div>
  );
}

export default Feedback;

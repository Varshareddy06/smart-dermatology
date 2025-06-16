# Smart Dermatology

Smart Dermatology is a web application that leverages AI to provide preliminary insights into skin conditions. It allows users to upload images of skin conditions for analysis, receive dietary recommendations, predict potential causes, and find nearby dermatologists.

## Features

- **Skin Condition Analysis**: Upload an image of a skin condition to get AI-generated insights, including:
  - Disease Name
  - Medications
  - Severity
  - Quick Remedies
- **Food Recommendations**: Get dietary suggestions based on the identified skin condition.
- **Cause Prediction**: Answer insightful questions to identify potential causes of the skin condition.
- **Nearby Dermatologists**: Find dermatologists near your location using geolocation and Google Maps.
- **Feedback**: Share your experience and suggestions to improve the application.

## Technologies Used

- **React**: Frontend framework for building the user interface.
- **Google GenAI**: AI model for analyzing skin conditions and generating insights.
- **React Router**: For navigation between different pages.
- **Geolocation API**: To fetch the user's location for finding nearby dermatologists.
- **Google Maps Embed API**: For displaying nearby dermatologists on a map.

## Getting Started

### Prerequisites

- Node.js and npm installed on your system.
- A valid Google GenAI API key.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/smart-dermatology.git
   cd smart-dermatology
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Google GenAI API key:
   ```properties
   REACT_APP_GOOGLE_GENAI_API_KEY=your-api-key
   ```

4. Start the development server:
   ```bash
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Available Pages

- **Home**: Upload an image for analysis.
- **About**: Learn more about the application and its purpose.
- **Feedback**: Submit your feedback and suggestions.
- **Food Recommendation**: View dietary recommendations based on the analysis.
- **Cause Prediction**: Answer questions to identify potential causes of the condition.
- **Nearby Dermatologists**: Find dermatologists near your location.

## Deployment

To build the app for production, run:
```bash
npm run build
```

The build artifacts will be stored in the `build/` directory. You can deploy the app to any static hosting service.

## Disclaimer

This application is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified dermatologist or healthcare professional for any health concerns.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

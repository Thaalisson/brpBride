import React, { useEffect } from 'react';
const API_KEY = process.env.REACT_APP_LOL_API_KEY;

const ApiTest = () => {
  useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await fetch(`/riot/riot/account/v1/accounts/by-riot-id/BRP%20FATE/BR1?api_key=${API_KEY}`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText} (status: ${response.status})`);
        }
        const data = await response.json();
        console.log('API test response:', data);
      } catch (error) {
        console.error('Error testing API:', error.message);
      }
    };

    testAPI();
  }, []);

  return (
    <div>
      <h1>API Test</h1>
      <p>Check the console for API response.</p>
    </div>
  );
};

export default ApiTest;

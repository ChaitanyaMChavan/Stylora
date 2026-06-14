import React from 'react';
import { AppRoutes } from './routes/AppRoutes'; // Adjust path if your AppRoutes is in a different folder
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black antialiased">
      <AppRoutes />
    </div>
  );
}

export default App;
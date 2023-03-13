import './css/App.css';
import Header from "./components/Header";
import NFTGenerator from './NFTGenerator';
import React from 'react';
import { Analytics } from '@vercel/analytics/react';


function App() {
  return (
    <div className="App">
	<Header />
      <header className="App-header">
	  <NFTGenerator />
      </header>
	  <Analytics />
    </div>
  );
}

export default App;

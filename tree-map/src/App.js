import React, {useState, useEffect} from 'react';
import TreeMap from './TreeMap'
import './App.css';

function App() {
  const GAMESALESURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'

  let [gameSales, setGameSales] = useState(null)  

  useEffect (() => {
    fetch(GAMESALESURL)
      .then(res => res.json())
      .then(data => setGameSales(data))
  }, [])

  return (
    <TreeMap games={gameSales}
             title='Video Game Sales by Platform'
             desc='Top 100 video games sold'
    />
  );
}

export default App;

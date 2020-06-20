import React, {useState, useEffect} from 'react';
import BarChart from './BarChart'
import './App.css';

function App() {
  const dataUrl = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
  const [data, setData] = useState([])
  const width = 500
  const height = 300
  const padding = 90
  const barMargin = 0

  useEffect(() => {
    const result = fetch(dataUrl)
        .then(res => {
          console.log('Fetching')
          return res.json()
        })
        .then(data => setData(data.data))
  }, [])
    
    return (
      <BarChart data={data}
                title="GDP in billions"
                width={width}
                height={height}
                padding={padding}
                barMargin={barMargin}     
    />
  );
}

export default App;

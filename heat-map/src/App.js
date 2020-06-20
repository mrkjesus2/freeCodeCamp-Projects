import React, {useState, useEffect} from 'react';
import HeatMap from './HeatMap'
import './App.css';

function App() {
  const DATAURL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
  const [DATA, SETDATA] = useState(null)
  const WIDTH = '90%'
  const HEIGHT = '50%'
  const PADDING  = 160

  useEffect(() => {
    fetch(DATAURL)
      .then(res => res.json())
      .then(data => SETDATA(data))
  }, [])

  return (
    <HeatMap data={DATA}
             title="Monthly Global Temperature Variance"
             description="from 1753 - 2015: temperature base 8.66"
             width={WIDTH}
             height={HEIGHT}
             padding={PADDING}
    />
  )
}

export default App;

import React, {useEffect, useState} from 'react';
import ScatterPlot from './ScatterPlot'
import './App.css';

function App() {
  const DATAURL='https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
  const [DATA, SETDATA] = useState([])
  const WIDTH = 500
  const HEIGHT = 300
  const PADDING = 80

  useEffect(() => {
    fetch(DATAURL)
      .then(res => res.json())
      .then(data => SETDATA(data))
  }, [])

  return (
    <ScatterPlot title="Doping analysis in Bicycle Racing"
                 data={DATA}
                 width={WIDTH}
                 height={HEIGHT}
                 padding={PADDING}
    />
  );
}

export default App;

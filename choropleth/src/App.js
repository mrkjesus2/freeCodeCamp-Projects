import React, { useState, useEffect } from 'react';
import Choropleth from './Choropleth'
import './App.css';


function App() {
  const EDUCATIONDATAURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
  const USCOUNTYDATAURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

  let [countyData, setCountyData] = useState(null)
  let [educationData, setEducationData] = useState(null)

  useEffect(() => {
    fetch(USCOUNTYDATAURL) 
      .then(res => res.json())
      .then(data => setCountyData(data))

    fetch(EDUCATIONDATAURL)
      .then(res => res.json())
      .then(data => setEducationData(data))
  }, [])

  return (
    <Choropleth title='United States Education Development'
                desc="Percentage of adults over 25 with bachelor's or higher (2010-2014)"
                padding='20'
                attr='USDA Economic Research Service'
                attrSrc='https://www.ers.usda.gov/data-products/county-level-data-sets/download-data.aspx'
                countyData={countyData}
                educData={educationData}
    />
  );
}

export default App;

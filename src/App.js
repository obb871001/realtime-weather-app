import logo from './logo.svg';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import { useState , useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import 'normalize.css';
import { ReactComponent as DayCloudy } from './images/day-cloudy.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTemperatureEmpty} from '@fortawesome/free-solid-svg-icons';
import { findLocation,getMoment } from './utils/helpers'
import WeatherCard from './views/WeatherCard';
import WeatherSetting from './views/WeatherSetting';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';



const Container = styled.div`
  background-color:${({theme})=>theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;



const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
}

const KEY = 'CWB-B990444E-46C7-4278-BA8B-FDD900765179';
const LOCATION_NAME = '新竹市';



function App() {


  const [nowCity , setNowCity] = useState('新竹縣');
  const nowLocation = useMemo(()=>findLocation(nowCity),[nowCity])
  const {cityName,locationName,sunriseCityName} = nowLocation

  const fetchCurrentWeather = () =>{

    // setcurrentWeather((prevState)=>({
    //   ...prevState,isLoading:true
    // }))


    return fetch(
      `
      https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-B990444E-46C7-4278-BA8B-FDD900765179&locationName=%E6%96%B0%E7%AB%B9
      `
    )
      .then((response)=>response.json())
      .then((data) => {
        const locationData = data.records.location[0];
        const weatherElements = locationData.weatherElement.reduce(
          (need,item) =>{
           if(['WDSD','TEMP','Weather'].includes(item.elementName)){
            need[item.elementName] = item.elementValue;
            }
            return need;
          },{}
        );
        console.log(weatherElements)
          return{
            observationTime:locationData.time.obsTime,
            locationName:locationData.locationName,
            temperature:weatherElements.TEMP,
            windSpeed:weatherElements.WDSD,
            isLoading:false,
          }
          
          // description:locationData.,
          // description:locationData.,
          // description:locationData.,

      })

  }



  const fetchWeather = () => {
    return fetch(
      `
      https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${KEY}&format=JSON&locationName=%E6%96%B0%E7%AB%B9%E5%B8%82

      `
    )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (need,item) => {
          if(['Wx','PoP','CI'].includes(item.elementName)){
            need[item.elementName] = item.time[0].parameter;
          }
          return need
        }
      )
        return{
          description:weatherElements.time[0].parameter.parameterName,
          rainPossibility:weatherElements.PoP.parameterName,
          comfortable:weatherElements.CI.parameterName,
          weatherCode:weatherElements.time[0].parameter.parameterValue,
          isLoading:false,
        }
    
      // setcurrentWeather({
      //   description:weatherElements.Wx.,
      //   rainPossibility:weatherElements.PoP,
    
      // })
    })

  }


  const [currentTheme,setcurrntTheme] = useState('dark');

  const moment = useMemo(() => getMoment(sunriseCityName),[sunriseCityName]);
  

  const [currentWeather,setcurrentWeather] = useState({
    locationName: '',
    description:'',
    windSpeed:0,
    temperature:0,
    rainPossibility:0,
    observationTime:new Date(),
    isLoading:true,
    comfortable:'',
    weatherCode:0,
  })


  
  const fetchData = async() =>{
    const [currentWeather, weatherForecast] = await Promise.all([fetchWeather(),fetchCurrentWeather()]);
    setcurrentWeather({
      ...currentWeather,
      ...weatherForecast,
      isLoading:false,
    });
  
};

const [nowPage, setnowPage] = useState('WeatherCard');

  useEffect(()=>{
    setcurrntTheme(moment ==='day' ? 'light' : 'dark');

    setcurrentWeather((prev)=>({
      ...prev,
      isLoading:true,
    }))  
    
    fetchData();
  },[moment])

 
const handleSettings = (nowPage) =>{
  setnowPage(nowPage)
}
const handleNowCityChange = (nowCity) =>{
  setNowCity(nowCity)
}

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {nowPage ==='WeatherCard' && (
          <WeatherCard 
          cityName={cityName}
          currentWeather={currentWeather}
          moment={moment}
          fetchData={fetchData}
          handleSettings={handleSettings}
           />
        )}
        {nowPage === 'WeatherSetting' && ( <WeatherSetting handleSettings={handleSettings} handleNowCityChange={handleNowCityChange} cityName={cityName}/>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;

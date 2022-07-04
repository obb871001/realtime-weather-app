import { useState,useEffect,useCallback } from "react";


const fetchCurrentWeather = () =>{

    // setcurrentWeather((prevState)=>({
    //   ...prevState,isLoading:true
    // }))


    return fetch(
      `
      https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-B990444E-46C7-4278-BA8B-FDD900765179
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
      https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-B990444E-46C7-4278-BA8B-FDD900765179&format=JSON&locationName=

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

const useWeatherAPI =()=>{
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
    
      useEffect(()=>{
        setcurrntTheme(moment ==='day' ? 'light' : 'dark');
    
        setcurrentWeather((prev)=>({
          ...prev,
          isLoading:true,
        }))  
        
        fetchData();
      },[moment])
         
};

export default useWeatherAPI;
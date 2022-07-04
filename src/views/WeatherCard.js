import React from "react";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import { ReactComponent as RainIcon } from './../images/rain.svg';
import { ReactComponent as AirFlowIcon } from './../images/airFlow.svg';
import { ReactComponent as RefreshIcon } from './../images/refresh.svg';
import { ReactComponent as LoadingIcon } from './../images/loading.svg';
import WeatherIcon from './../components/WeatherIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTemperatureEmpty} from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as CogIcon } from "./../images/cog.svg";


const WeatherCardWrapper = styled.div`
  min-width: 360px;
  box-shadow: ${({theme})=>theme.boxShadow};
  background-color: ${({theme})=>theme.foregroundColor};
  padding:10px 15px;
  position:relative
`

const Comfortable = styled.div`
margin-bottom: 10px;
display:flex;
align-items:center;
color:#828282;

svg{
  width:25px;
  height:23px;
  margin-right:30px;
  color:#e14028;
}
`
const Location = styled.div` 
  color:${({theme})=>theme.titleColor};
  font-size:28px;
  margin-bottom:20px;
`;

const Description = styled.div`
  font-size:14px;
  color:#9a9898;
`

const CurrentWeather = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
`
const Temperature = styled.div`
  display:flex;
  font-size:85px;
  color:${({theme})=>theme.temperatureColor};
`

const Celsius = styled.div`
  font-size:30px;
`

const AirFlow = styled.div`
  color:${({theme})=>theme.textColor};
  margin-bottom:10px;
  display:flex;
  align-items:center;

  svg{
    width:25px;
    height:auto;
    margin-right:30px;
  }
`

const Rain = styled.div`
  color:${({theme})=>theme.textColor};
  margin-bottom:10px;
  display:flex;
  align-items:center;

  svg{
    width:25px;
    height:auto;
    margin-right:30px;
  }

`

const Refresh = styled.div`
  color:${({theme})=>theme.textColor};
  margin-bottom:10px;
  display:flex;
  align-items:center;
  justify-content: end;
  font-size:14px;
  svg{
    width:14px;
    height:auto;
    margin-left:10px;
    cursor:pointer;
    animation:rotate infinite 1.5s linear;
    animation-duration:${({isLoading})=>(isLoading?'1.5s':'0s')};
  }
  @keyframes rotate{
    from {
      transform:rotate(360deg);
    }
    to{
      transform:rotate(0deg);
    }
  };
`
const Cog = styled(CogIcon)`
  position:absolute;
  top:15px;
  right:15px;
  width:25px;
  height:25px;
  cursor:pointer;
`


const WeatherCard = ({moment,currentWeather,fetchData,handleSettings,cityName}) =>{
    const {
        observationTime,
        locationName,
        temperature,
        windSpeed,
        rainPossibility,
        isLoading,
        comfortable,
        description,
        weatherCode,
      } = currentWeather;
    
    return (
        <WeatherCardWrapper className="rounded-3 bg-gradient">
        {/* <Cog onClick={()=>handleSettings('WeatherSetting')}/> */}
        <Location>{cityName}</Location>
        <Description>{description}</Description>
        <CurrentWeather>
          <Temperature>
            {Math.round(temperature)} <Celsius>°C</Celsius>
          </Temperature>
          <WeatherIcon weatherCode={weatherCode} moment={moment} />
        </CurrentWeather>
        <Comfortable><FontAwesomeIcon icon={faTemperatureEmpty} />{comfortable}</Comfortable>
        <AirFlow><AirFlowIcon/>{windSpeed} m/h</AirFlow>
        <Rain><RainIcon />{rainPossibility} %</Rain>
        <Refresh  onClick={fetchData} isLoading={isLoading}>最後觀測時間：{
            new Intl.DateTimeFormat('zh-TW',{
              hour:'numeric',
              minute:'numeric',
            }).format(dayjs(observationTime))
          }{''} 
            {currentWeather.isLoading?<LoadingIcon /> : < RefreshIcon/>}
        </Refresh>
      </WeatherCardWrapper>
    )
}

export default WeatherCard
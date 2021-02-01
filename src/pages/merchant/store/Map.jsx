import React, { useEffect } from 'react'
import ReactQMap from 'react-qmap'

let classMap, windowMap
const Map = ({ value = '' }) => {
  const location = value.split(',')
  const [latitude, longitude] = location
  const center = { latitude, longitude }

  const setMarker = (lat, lon) => {
    const marker = new windowMap.Marker({
      map: classMap,
      position: new windowMap.LatLng(lat, lon),
      animation: windowMap.MarkerAnimation.DROP
    })
  }
  const getMap = (map, wMap) => {
    classMap = map
    windowMap = wMap
    setMarker(longitude, latitude)
  }

  return (
    <div>
      <div style={{ width: 500, height: 250 }}>
        {value.length > 0 && (
          <>
            <ReactQMap
              center={center}
              mySpot={center}
              initialOptions={{ zoomControl: true, mapTypeControl: false }}
              apiKey="PYHBZ-DYXLR-4T4WX-WQGEE-MRX6J-B5BM3"
              // apiKey="SF7BZ-F5TC2-WRRUD-CWCXK-CF42Q-VYBIW"
            />
          </>
        )}
      </div>
      <p style={{ fontSize: 12 }}>
        经度：{latitude} / 纬度：{longitude}
      </p>
    </div>
  )
}
export default Map

import React from 'react';
import { useEffect, useRef } from 'react'

import CoordinateTranslator from './helpers/CoordinateTranslator'
import RoadsToDraw from './helpers/RoadsToDraw'

import QuoteApp from './components/QuoteApp'

import CatanCoordinate from './models/CatanCoordinate'

import CatanApiRoadsResponse from './api/models/CatanApiRoadsResponse'
import CatanApiSettlementResponse from './api/models/CatanApiSettlementResponse'
import { catanFetchApi, catanRoadPlacementAPI } from './api/CatanApiManager';

import './App.css';
import LineToDraw from './models/LineToDraw';

function App() {
  return (
    <div>
      <CatanGameBoard />
      <h3>CatanBoard</h3>
    </div>
  );
}

function CatanGameBoard() {

  let canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  let canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => { 
    catanFetchApi<CatanApiRoadsResponse>('/roads',{
      method: 'GET'
    }, (response) => {
      if (canvasRef.current) {
        canvasCtxRef.current = canvasRef.current.getContext('2d');
        let ctx = canvasCtxRef.current; // Assigning to a temp variable
        let redRoads = response.red
        var color = 'red';
        let width = 5;
        for(var road of redRoads) {
          let uiCoordinates = CoordinateTranslator.uiCoordinateMap(road)
          ctx!.beginPath(); // Note the Non Null Assertion
          ctx!.moveTo(uiCoordinates.x, uiCoordinates.y);
          ctx!.lineTo(uiCoordinates.x1, uiCoordinates.y1);
          ctx!.strokeStyle = color;
          ctx!.lineWidth = width; 
          ctx!.stroke();
        }
        color = 'blue';
        let blueRoads = response.blue
        for(var road1 of blueRoads) {
          let uiCoordinates = CoordinateTranslator.uiCoordinateMap(road1)
          ctx!.beginPath(); // Note the Non Null Assertion
          ctx!.moveTo(uiCoordinates.x, uiCoordinates.y);
          ctx!.lineTo(uiCoordinates.x1, uiCoordinates.y1);
          ctx!.strokeStyle = color;
          ctx!.lineWidth = width; 
          ctx!.stroke();
        }
      }
    })

    catanFetchApi<CatanApiSettlementResponse>('/settlements', {
      method: 'GET'
    }, (response) => {
      if (canvasRef.current) {
        canvasCtxRef.current = canvasRef.current.getContext('2d');
        let ctx = canvasCtxRef.current; // Assigning to a temp variable
        let redSettlements = response.red
        var color = 'red';
        let width = 15;
        for(var settlement of redSettlements) {
          let uiCoordinates = CoordinateTranslator.uiCoordinateMapSingle(settlement)
          ctx!.beginPath(); // Note the Non Null Assertion
          ctx!.moveTo(uiCoordinates.x, uiCoordinates.y);
          ctx!.lineTo(uiCoordinates.x, uiCoordinates.y+width);
          ctx!.strokeStyle = color;
          ctx!.lineWidth = width; 
          ctx!.stroke();
        }
        color = 'blue';
        let blueSettlements = response.blue
        for(var settlement1 of blueSettlements) {
          let uiCoordinates = CoordinateTranslator.uiCoordinateMapSingle({x: settlement1.x, y: settlement1.y} as CatanCoordinate)
          ctx!.beginPath(); // Note the Non Null Assertion
          ctx!.moveTo(uiCoordinates.x, uiCoordinates.y);
          ctx!.lineTo(uiCoordinates.x, uiCoordinates.y+width);
          ctx!.strokeStyle = color;
          ctx!.lineWidth = width; 
          ctx!.stroke();
        }
      }
    })

    // Second, Initialize Canvas and print
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext('2d');
      let ctx = canvasCtxRef.current; // Assigning to a temp variable
      let color = 'black';
      let width = 1;

      for (var road of RoadsToDraw.roadsCoordinates()/*.filter(rd => rd.y == 0)*/) {
        let uiCoordinates = CoordinateTranslator.uiCoordinateMap({x: road.x, y: road.y, x1: road.x1 , y1: road.y1});

        ctx!.beginPath(); // Note the Non Null Assertion
        ctx!.moveTo(uiCoordinates.x, uiCoordinates.y);
        ctx!.lineTo(uiCoordinates.x1, uiCoordinates.y1);
        ctx!.strokeStyle = color;
        ctx!.lineWidth = width; 
        ctx!.stroke();
      }
      console.log("Done painting board.")
    }
  }, []);

  const randomQuotes: string[] = [
    "Before you judge a man, walk a mile in his shoes. After that who cares?... He’s a mile away and you’ve got his shoes!",
    "Better to remain silent and be thought a fool than to speak out and remove all doubt.",
    "The best thing about the future is that it comes one day at a time.",
    "The only mystery in life is why the kamikaze pilots wore helmets.",
    "Light travels faster than sound. This is why some people appear bright until you hear them speak.",
    "The difference between stupidity and genius is that genius has its limits"
  ]

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={500}
        height={375}
        onClick={(e) => {

          catanRoadPlacementAPI<{}>({
            method: 'POST'
          }, (response) => {
              console.log(response)
          })
          if (canvasRef.current) {

            let xCoordinate = e.clientX
            let yCoordinate = e.clientY

            let closestRoad = CoordinateTranslator.closestRoad(
                { x: xCoordinate, y: yCoordinate } as CatanCoordinate
            )

            canvasCtxRef.current = canvasRef.current.getContext('2d');
            let ctx = canvasCtxRef.current; // Assigning to a temp variable

            ctx!.beginPath(); // Note the Non Null Assertion
            ctx!.moveTo(closestRoad.x, closestRoad.y);
            ctx!.lineTo(closestRoad.x1, closestRoad.y1);
            ctx!.strokeStyle = "blue";
            ctx!.lineWidth = 7;
            ctx!.stroke();

          }
          console.log(`click on x: ${e.clientX}, y: ${e.clientY}`);
        }}
      />
      <QuoteApp quotes={randomQuotes}/>
    </div>
  );
}

export default App;

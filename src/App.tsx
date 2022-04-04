import React from 'react';
import { useEffect, useRef, useState } from 'react'

import CoordinateTranslator from './helpers/CoordinateTranslator'
import RoadsToDraw from './helpers/RoadsToDraw'

import QuoteApp from './components/QuoteApp'

import CatanCoordinate from './models/CatanCoordinate'

import CatanApiRoadsResponse from './api/models/CatanApiRoadsResponse'
import CatanApiSettlementResponse from './api/models/CatanApiSettlementResponse'
import { catanFetchApi, catanRoadPlacementAPI } from './api/CatanApiManager';

import './App.css';
import LineToDraw from './models/LineToDraw';
import { CatanGameColor } from './models/CatanGameColor';

function App() {
  return (
    <div>
      <CatanGameBoard />
      <h3>CatanBoard</h3>
    </div>
  );
}

type PlayerState = {
  color: string,
  actionType: string
}

function CatanGameBoard() {

  const [playerState, setPlayerState] = useState({color:"BLUE"})

  const setRedRoad = (): void => {setPlayerState({color:"RED"})}
  const setBlueRoad = (): void => {setPlayerState({color:"BLUE"})}
  const setYellowRoad = (): void => {setPlayerState({color:"YELLOW"})}
  const setWhiteRoad = (): void => {setPlayerState({color:"WHITE"})}

  let canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  let canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => { 
    catanFetchApi<CatanApiRoadsResponse>('/roads',{
      method: 'GET'
    }, (response) => {
      if (canvasRef.current) {
        canvasCtxRef.current = canvasRef.current.getContext('2d');
        let ctx = canvasCtxRef.current; // Assigning to a temp variable

        let colorResponse = [
          {color: "red", response: response.red},
          {color: "blue", response: response.blue},
          {color: "yellow", response: response.yellow},
          {color: "white", response: response.white},
        ]
        let width = 5
        for(var playerPieces of colorResponse) {
         let response = playerPieces.response
         let color = playerPieces.color 

          for(var road of response) {
            let uiCoordinates = CoordinateTranslator.uiCoordinateMap(road)
            ctx!.beginPath(); // Note the Non Null Assertion
            ctx!.moveTo(uiCoordinates.x, uiCoordinates.y);
            ctx!.lineTo(uiCoordinates.x1, uiCoordinates.y1);
            ctx!.strokeStyle = color;
            ctx!.lineWidth = width; 
            ctx!.stroke();
          }

        }
      }
    })

    catanFetchApi<CatanApiSettlementResponse>('/settlements', {
      method: 'GET'
    }, (response) => {
      if (canvasRef.current) {
        canvasCtxRef.current = canvasRef.current.getContext('2d');
        let ctx = canvasCtxRef.current; // Assigning to a temp variable

        let width = 15

        let playerSettlements = [
          {color: "red", response: response.red},
          {color: "blue", response: response.blue},
          {color: "yellow", response: response.yellow},
          {color: "white", response: response.white},
        ]

        for (var currentPlayer of playerSettlements) {
          for(var settlement of currentPlayer.response) {
            let uiCoordinates = CoordinateTranslator.uiCoordinateMapSingle({x: settlement.x, y: settlement.y} as CatanCoordinate)
            ctx!.beginPath(); // Note the Non Null Assertion
            ctx!.moveTo(uiCoordinates.x, uiCoordinates.y);
            ctx!.lineTo(uiCoordinates.x, uiCoordinates.y+width);
            ctx!.strokeStyle = currentPlayer.color;
            ctx!.lineWidth = width; 
            ctx!.stroke();
          }
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
          if (canvasRef.current) {

            let xCoordinate = e.clientX
            let yCoordinate = e.clientY

            let closestRoad = CoordinateTranslator.closestRoad(
                { x: xCoordinate, y: yCoordinate } as CatanCoordinate
            )

            catanRoadPlacementAPI<{}>({
              x: closestRoad.modelCoordinate.x, 
              y: closestRoad.modelCoordinate.y, 
              x1: closestRoad.modelCoordinate.x1, 
              y1: closestRoad.modelCoordinate.y1
            } as LineToDraw, playerState.color, (response) => {
              console.log(response)
          })

            canvasCtxRef.current = canvasRef.current.getContext('2d');
            let ctx = canvasCtxRef.current; // Assigning to a temp variable

            ctx!.beginPath(); // Note the Non Null Assertion
            ctx!.moveTo(closestRoad.uiCoordinates.x, closestRoad.uiCoordinates.y);
            ctx!.lineTo(closestRoad.uiCoordinates.x1, closestRoad.uiCoordinates.y1);
            ctx!.strokeStyle = playerState.color.toLowerCase();
            ctx!.lineWidth = 7;
            ctx!.stroke();

          }
          console.log(`click on x: ${e.clientX}, y: ${e.clientY}`);
        }}
      />
       <button onClick={setRedRoad}>Red Roads</button>
       <button onClick={setBlueRoad}>Blue Roads</button>
       <button onClick={setYellowRoad}>Yellow Roads</button>
       <button onClick={setWhiteRoad}>White Roads</button>
      <QuoteApp quotes={randomQuotes}/>
    </div>
  );
}

export default App;

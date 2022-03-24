import React from 'react';
import { useEffect, useRef } from 'react'

import CoordinateTranslator from './helpers/CoordinateTranslator'
import RoadsToDraw from './helpers/RoadsToDraw'
import {createRoadsMap} from './helpers/BoardGenerationTools'

import QuoteApp from './components/QuoteApp'

import LineToDraw from './models/LineToDraw';
import LineProperties from './models/LineProperties'
import CatanCoordinate from './models/CatanCoordinate'
import {CatanGameColor} from './models/CatanGameColor'


import {CatanGameBoardState} from './state/CatanGameBoardState'
import './App.css';

interface CatanApiRoadsResponse {
  red: Array<LineToDraw>,
  yellow: Array<LineToDraw>,
  blue: Array<LineToDraw>,
  white: Array<LineToDraw>
}

function App() {
  return (
    <div>
      <CatanGameBoard />
      <h3>CatanBoard</h3>
    </div>
  );
}

// TODO: Clean this up
  const fetchRoads = async (func: { (response: CatanApiRoadsResponse): void }): Promise<CatanApiRoadsResponse> => {
      const response = await fetch('http://localhost:4567/catan/roads', {
        method: 'GET'
      }).then(response => response.json()).catch(error => console.log(error))

      let responseModel = JSON.parse(response) as CatanApiRoadsResponse
      func(responseModel)
      console.log(responseModel)
      return responseModel
  }

function CatanGameBoard() {

  let test = createRoadsMap()

  let canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  let canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);

  // const [value, setValue] = React.useState<Promise<CatanApiRoadsResponse>>(fetchRoads);

  // TODO: Paint roads from API
  // idea: Move fetch roads here returning a completion handler with roads,
  // update canvas from completion.

  useEffect(() => { 
    fetchRoads((response) => {
      console.log("In the completion block")
      if (canvasRef.current) {
        canvasCtxRef.current = canvasRef.current.getContext('2d');
        let ctx = canvasCtxRef.current; // Assigning to a temp variable
        let redRoads = response.red
        var color = 'red';
        let width = 5;
        for(var road of redRoads) {
          console.log(JSON.stringify(road))
          let uiCoordinates = CoordinateTranslator.uiCoordinateMap(road)
          ctx!.beginPath(); // Note the Non Null Assertion
          ctx!.moveTo(uiCoordinates.x, uiCoordinates.y);
          ctx!.lineTo(uiCoordinates.x1, uiCoordinates.y1);
          ctx!.strokeStyle = color;
          ctx!.lineWidth = width; 
          ctx!.stroke();
        }
        var color = 'blue';
        let blueRoads = response.blue
        for(var road of blueRoads) {
          console.log(JSON.stringify(road))
          let uiCoordinates = CoordinateTranslator.uiCoordinateMap(road)
          ctx!.beginPath(); // Note the Non Null Assertion
          ctx!.moveTo(uiCoordinates.x, uiCoordinates.y);
          ctx!.lineTo(uiCoordinates.x1, uiCoordinates.y1);
          ctx!.strokeStyle = color;
          ctx!.lineWidth = width; 
          ctx!.stroke();
        }
      }
    })

    // first, fetch game pieces
    // fetchRoads()
    // console.log(value)

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

  for (var roads of RoadsToDraw.roadsCoordinates().filter(rd => rd.y === 0)) {
    console.log(JSON.stringify(CoordinateTranslator.uiCoordinateMap(roads)));
  }

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

            canvasCtxRef.current = canvasRef.current.getContext('2d');
            let ctx = canvasCtxRef.current; // Assigning to a temp variable

            ctx!.beginPath(); // Note the Non Null Assertion
            ctx!.moveTo(closestRoad.x, closestRoad.y);
            ctx!.lineTo(closestRoad.x1, closestRoad.y1);
            ctx!.strokeStyle = "red";
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

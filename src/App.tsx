import React from 'react';
import { useEffect, useRef } from 'react'

import CoordinateTranslator from './helpers/CoordinateTranslator'
import RoadsToDraw from './helpers/RoadsToDraw'
import {createRoadsMap} from './helpers/BoardGenerationTools'

import QuoteApp from './components/QuoteApp'

import LineToDraw from './models/LineToDraw';
import LineProperties from './models/LineProperties'
import {CatanGameColor} from './models/CatanGameColor'


import {CatanGameBoardState} from './state/CatanGameBoardState'

import './App.css';


function App() {
  return (
    <div>
      <CatanGameBoard />
      <h3>CatanBoard</h3>
      <TestState />
    </div>
  );
}


// Testing State for the board.
function TestState() {
  let [roadsToDraw, updateRoadsToDraw] = React.useState(createRoadsMap())
  let newRoads = () => updateRoadsToDraw(roads => {
    return roadsToDraw
  })
  return <button onClick={newRoads}>{JSON.stringify(roadsToDraw.size)}</button>
}

function CatanGameBoard() {

  let test = createRoadsMap()

  let canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  let canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => { 
    // Initialize
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
            canvasCtxRef.current = canvasRef.current.getContext('2d');
            let ctx = canvasCtxRef.current; // Assigning to a temp variable
            ctx!.beginPath(); // Note the Non Null Assertion
            ctx!.moveTo(0, 0);
            ctx!.lineTo(250, 250);
            ctx!.strokeStyle = "red";
            ctx!.lineWidth = 3;
            ctx!.stroke();
            console.log("here")
          }
          console.log(`click on x: ${e.clientX}, y: ${e.clientY}`);
        }}
      />
      <QuoteApp quotes={randomQuotes}/>
    </div>
  );
}

export default App;

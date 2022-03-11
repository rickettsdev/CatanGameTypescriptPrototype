import React from 'react';
import { useEffect, useRef } from 'react'

import logo from './logo.svg';
import './App.css';

import CoordinateTranslator from './helpers/CoordinateTranslator';
import RoadsToDraw from './helpers/RoadsToDraw';
// import getCanvasContext from './canvas/CanvasComponent';


function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);

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
 
  const coordinates = JSON.stringify(CoordinateTranslator.uiCoordinateMap({ x: 0, y: 1, x1: 0, y1: 2 }));

  for (var roads of RoadsToDraw.roadsCoordinates().filter(rd => rd.y == 0)) {
    console.log(JSON.stringify(CoordinateTranslator.uiCoordinateMap(roads)));
  }
  return (
      <canvas
        ref={canvasRef}
        width={500}
        height={375}
        onClick={(e) => {
          console.log(`click on x: ${e.clientX}, y: ${e.clientY}`);
        }}
      />
  );
}

export default App;

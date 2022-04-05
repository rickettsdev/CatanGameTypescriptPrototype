import React from 'react';
import { useEffect, useRef, useState } from 'react'

import CoordinateTranslator from './helpers/CoordinateTranslator'
import RoadsToDraw from './helpers/RoadsToDraw'

import QuoteApp from './components/QuoteApp'

import CatanCoordinate from './models/CatanCoordinate'

import CatanApiRoadsResponse from './api/models/CatanApiRoadsResponse'
import CatanApiSettlementResponse from './api/models/CatanApiSettlementResponse'
import { catanFetchApi, catanAddSettlementAPI, catanAddRoadAPI } from './api/CatanApiManager';

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

interface CatanApiRoadsResponseStateDifference {
  color: string,
  response: Array<LineToDraw>
}

interface CatanApiSettlementResponseStateDifference {
  color: string,
  response: Array<CatanCoordinate>
}

type PlayerState = {
  color: string,
  actionType: string,
  settlementPieces: CatanApiSettlementResponse,
  roadPieces: CatanApiRoadsResponse
}

function CatanGameBoard() {

  let updateSpeed = 5000//ms

  const [playerState, setPlayerState] = useState({
    color:"BLUE",
    actionType:"R",
    settlementPieces:{red: [] as Array<CatanCoordinate>, blue: [] as Array<CatanCoordinate>, yellow: [] as Array<CatanCoordinate>, white: [] as Array<CatanCoordinate>},
    roadPieces:{red: [] as Array<LineToDraw>, blue: [] as Array<LineToDraw>, yellow: [] as Array<LineToDraw>, white: [] as Array<LineToDraw>}
  })

  const setRedPlayer = (): void => {setPlayerState({...playerState, color:"RED"})}
  const setBluePlayer = (): void => {setPlayerState({...playerState, color:"BLUE"})}
  const setYellowPlayer = (): void => {setPlayerState({...playerState, color:"YELLOW"})}
  const setWhitePlayer = (): void => {setPlayerState({...playerState, color:"WHITE"})}
  const setActionTypeSettlement = (): void => {setPlayerState({...playerState, actionType:"S"})}
  const setActionTypeRoad = (): void => {setPlayerState({...playerState, actionType:"R"})}
  const setSettlementPieces = (response: CatanApiSettlementResponse): void => {setPlayerState({...playerState, settlementPieces: response})}
  const setRoadPieces = (response: CatanApiRoadsResponse): void => {setPlayerState({...playerState, roadPieces: response})}

  const setRoadPiecesReturnDiff = (response: CatanApiRoadsResponse): Array<CatanApiRoadsResponseStateDifference> => {
    
    let currentState = playerState.roadPieces
    let stateDifference: Array<CatanApiRoadsResponseStateDifference> = [
      {color: "red", response: response.red.filter(road => !currentState.red.includes(road))},
      {color: "blue", response: response.blue.filter(road => !currentState.blue.includes(road))},
      {color: "yellow", response: response.yellow.filter(road => !currentState.yellow.includes(road))},
      {color: "white", response: response.white.filter(road => !currentState.white.includes(road))},
    ]

    setPlayerState({...playerState, roadPieces: response})

    return stateDifference
  }

  const setSettlementPiecesReturnDiff = (response: CatanApiSettlementResponse): Array<CatanApiSettlementResponseStateDifference> => {
    let currentState = playerState.settlementPieces

    let stateDifference: Array<CatanApiSettlementResponseStateDifference> = [
      {color: "red", response: response.red.filter(settlement => !currentState.red.includes(settlement))},
      {color: "blue", response: response.blue.filter(settlement => !currentState.blue.includes(settlement))},
      {color: "yellow", response: response.yellow.filter(settlement => !currentState.yellow.includes(settlement))},
      {color: "white", response: response.white.filter(settlement => !currentState.white.includes(settlement))},
    ]

    setPlayerState({...playerState, settlementPieces: response})

    return stateDifference
  }


  let canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  let canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);

  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => { 
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext('2d');
      let ctx = canvasCtxRef.current; // Assigning to a temp variable

      catanFetchApi<CatanApiRoadsResponse>('/roads',{
        method: 'GET'
      }, (response) => {
          let colorResponse = setRoadPiecesReturnDiff(response)
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
      })

      timerRef.current = setInterval(() => {
        catanFetchApi<CatanApiRoadsResponse>('/roads',{
          method: 'GET'
        }, (response) => {
            let colorResponse = setRoadPiecesReturnDiff(response)
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
        })
    }, updateSpeed);

      catanFetchApi<CatanApiSettlementResponse>('/settlements', {
        method: 'GET'
      }, (response) => {
          let playerSettlements = setSettlementPiecesReturnDiff(response)
          let width = 15

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
      })

      timerRef.current = setInterval(() => {
        catanFetchApi<CatanApiSettlementResponse>('/settlements', {
          method: 'GET'
        }, (response) => {
            let width = 15
            let playerSettlements = setSettlementPiecesReturnDiff(response)
  
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
        })
    }, updateSpeed);

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

            canvasCtxRef.current = canvasRef.current.getContext('2d');
            let ctx = canvasCtxRef.current; // Assigning to a temp variable

            if(playerState.actionType === "R") {
              let closestRoad = CoordinateTranslator.closestRoad({ x: xCoordinate, y: yCoordinate } as CatanCoordinate)
              catanAddRoadAPI({
                x: closestRoad.modelCoordinate.x, 
                y: closestRoad.modelCoordinate.y, 
                x1: closestRoad.modelCoordinate.x1, 
                y1: closestRoad.modelCoordinate.y1
              }, playerState.color).then((success) => {
                if (success) {
                  ctx!.beginPath(); // Note the Non Null Assertion
                  ctx!.moveTo(closestRoad.uiCoordinates.x, closestRoad.uiCoordinates.y);
                  ctx!.lineTo(closestRoad.uiCoordinates.x1, closestRoad.uiCoordinates.y1);
                  ctx!.strokeStyle = playerState.color.toLowerCase();
                  ctx!.lineWidth = 7;
                  ctx!.stroke();
                }
              }).catch(error => console.log(error))
            } else if (playerState.actionType === "S") {
              let closestSettlement = CoordinateTranslator.closestSettlementLocation({x: xCoordinate, y: yCoordinate})
              let width = 15
              catanAddSettlementAPI({
                x: closestSettlement.modelCoordinate.x, 
                y: closestSettlement.modelCoordinate.y
              }, playerState.color).then((success) => {
                if(success) {
                  ctx!.beginPath(); // Note the Non Null Assertion
                  ctx!.moveTo(closestSettlement.uiCoordinate.x, closestSettlement.uiCoordinate.y);
                  ctx!.lineTo(closestSettlement.uiCoordinate.x, closestSettlement.uiCoordinate.y+width);
                  ctx!.strokeStyle = playerState.color;
                  ctx!.lineWidth = width; 
                  ctx!.stroke();
                }
              })
              .catch(error=> console.log(error))
            }
        }
          console.log(`click on x: ${e.clientX}, y: ${e.clientY}`);
        }}
      />
       <button onClick={setRedPlayer}>Red Player</button>
       <button onClick={setBluePlayer}>Blue Player</button>
       <button onClick={setYellowPlayer}>Yellow Player</button>
       <button onClick={setWhitePlayer}>White Player</button>
       <button onClick={setActionTypeRoad}>Build Roads</button>
       <button onClick={setActionTypeSettlement}>Build Settlements</button>
       <h3>Current Color: {playerState.color}, Current Action: {playerState.actionType}</h3>
      <QuoteApp quotes={randomQuotes}/>
    </div>
  );
}

export default App;

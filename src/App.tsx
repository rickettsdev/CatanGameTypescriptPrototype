import React from 'react';
import { useEffect, useRef, useState } from 'react'

import CoordinateTranslator from './helpers/CoordinateTranslator'
import RoadsToDraw from './helpers/RoadsToDraw'

import CatanCoordinate from './models/CatanCoordinate'

import CatanApiRoadsResponse from './api/models/CatanApiRoadsResponse'
import CatanApiSettlementResponse from './api/models/CatanApiSettlementResponse'
import { catanFetchApi, catanAddSettlementAPI, catanAddRoadAPI } from './api/CatanApiManager';
import CatanSettlementModel from './api/models/CatanSettlementModel';

import './App.css';
import LineToDraw from './models/LineToDraw';
import CatanResourceTileInfoResponse from './api/models/CatanResourceTileInfoResponse';
import CatanDiceRollResponse from './api/models/CatanDiceRollResponse';

function App() {
  return (
    <div>
      <CatanGameBoard />
      <h3>The game is called 'Batan'</h3>
    </div>
  );
}

interface CatanApiRoadsResponseStateDifference {
  color: string,
  response: Array<LineToDraw>
}

interface CatanApiSettlementResponseStateDifference {
  color: string,
  response: Array<CatanSettlementModel>
}

type PlayerState = {
  color: string,
  actionType: string,
  settlementPieces: CatanApiSettlementResponse,
  roadPieces: CatanApiRoadsResponse,
  initialBoardDrawn: boolean,
  mostRecentDiceRoll: number
}

function CatanGameBoard() {

  // Yes, I understand short polling is garbage for scalability and cost
  let updateSpeed = 2000//ms

  const [playerState, setPlayerState] = useState<PlayerState>({
    color:"BLUE",
    actionType:"R",
    settlementPieces:{red: [] as Array<CatanSettlementModel>, blue: [] as Array<CatanSettlementModel>, yellow: [] as Array<CatanSettlementModel>, white: [] as Array<CatanSettlementModel>},
    roadPieces:
      {
        red: [] as Array<LineToDraw>,
        blue: [] as Array<LineToDraw>,
        yellow: [] as Array<LineToDraw>,
        white: [] as Array<LineToDraw>
      },
    initialBoardDrawn: false,
    mostRecentDiceRoll: 0
  })

  const rollDice = (): void => {
    catanFetchApi<CatanDiceRollResponse>('/rollDice', {
      method: 'GET'
    },() => {}).then(response => setMostRecentDiceRoll(response.diceRoll))
  }
  const setBoardDrawn = (): void => setPlayerState({...playerState, initialBoardDrawn: true})
  const setRedPlayer = (): void => {setPlayerState({...playerState, color:"RED"})}
  const setBluePlayer = (): void => {setPlayerState({...playerState, color:"BLUE"})}
  const setYellowPlayer = (): void => {
    setPlayerState({...playerState, color:"YELLOW"})
    console.log(`yellow clicked: Player state: ${JSON.stringify(playerState)}`)
  }
  const setWhitePlayer = (): void => {setPlayerState({...playerState, color:"WHITE"})}
  const setActionTypeSettlement = (): void => {setPlayerState({...playerState, actionType:"S"})}
  const setActionTypeRoad = (): void => {setPlayerState({...playerState, actionType:"R"})}
  const setMostRecentDiceRoll = (diceRoll: number): void => {setPlayerState({...playerState, mostRecentDiceRoll: diceRoll})}

  const setRoadPiecesReturnDiff = (response: CatanApiRoadsResponse): Array<CatanApiRoadsResponseStateDifference> => {
    // TODO: State difference doesn't work. Setting state doesn't either.
    let stateDifference: Array<CatanApiRoadsResponseStateDifference> = [
      {color: "red", response: response.red.filter(road => !playerState.roadPieces.red.includes(road))},
      {color: "blue", response: response.blue.filter(road => !playerState.roadPieces.blue.includes(road))},
      {color: "yellow", response: response.yellow.filter(road => !playerState.roadPieces.yellow.includes(road))},
      {color: "white", response: response.white.filter(road => !playerState.roadPieces.white.includes(road))},
    ]

    console.log(`road response: ${JSON.stringify(response)}`)

    console.log(`state difference: ${JSON.stringify(stateDifference)}`)

    console.log(`Player State: ${JSON.stringify(playerState.roadPieces)}`)

    let newPlayerState: PlayerState = {...playerState, roadPieces: response}

    console.log(`new player state: ${JSON.stringify(newPlayerState)}`)

    setPlayerState(newPlayerState)

    console.log(`Player State After setPlayerState: ${JSON.stringify(playerState.roadPieces)}`)

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

    console.log(`settlement Pieces Return Diff player state: ${JSON.stringify(playerState.settlementPieces)}`)

    setPlayerState({...playerState, settlementPieces: response})

    console.log(`2nd settlement Pieces Return Diff player state: ${JSON.stringify(playerState.settlementPieces)}`)

    return stateDifference
  }


  let canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  let canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);

  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => { 
    console.log(`player state: ${JSON.stringify(playerState)}`)
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext('2d');
      let ctx = canvasCtxRef.current; // Assigning to a temp variable

      // Drawing the board for first time.
      if(!playerState.initialBoardDrawn) {
        ctx!.fillText('Batan: The Board Game', 10, 10);

        //Get Resources Tiles
        catanFetchApi<CatanResourceTileInfoResponse>('/resourceTiles',{
          method: 'GET'
        }, (response) => {
          for (var resource of response.resources) {
            let resourceCoordinate: CatanCoordinate = {x: +resource.x, y: +resource.y}
            let uiResourceCoordinate = CoordinateTranslator.provideUICoordinateForResourceTileSlot(resourceCoordinate)
            let uiDiceRollCoordinate = CoordinateTranslator.provideUICoordinateForDiceRollTileSlot(resourceCoordinate)

            ctx!.font = '13px serif';
            ctx!.fillText(resource.resource, uiResourceCoordinate.x, uiResourceCoordinate.y)
            ctx!.font = '12px serif';
            ctx!.strokeText(resource.diceRoll, uiDiceRollCoordinate.x, uiDiceRollCoordinate.y)
          }
        })
        //End get resource tiles

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
        setBoardDrawn()
      }
      // End draw board

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
    }
    return () => {
      console.log("clearing time interval")
      clearInterval(timerRef.current!);
    };
  }, [timerRef, setRoadPiecesReturnDiff, setBoardDrawn]);
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
       <button onClick={rollDice}>Roll Dice</button>
       <h3>Current Color: {playerState.color}, Current Action: {playerState.actionType}, Most Recent Roll: {playerState.mostRecentDiceRoll}</h3>
    </div>
  );
}

export default App;

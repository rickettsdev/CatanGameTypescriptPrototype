import LineToDraw from '../models/LineToDraw';
import CatanCoordinate from '../models/CatanCoordinate';

import RoadsToDraw from '../helpers/RoadsToDraw'

export default abstract class CoordinateTranslator {

	// Remembers when you converted your model coordinates into UI coordinates. 
	private static theMappingMap = new Map<CatanCoordinate, CatanCoordinate>() 

    private static xCoordinateMultiplier = 85;
    private static yCoordinateMultiplier = 32;
    private static leftSideMargin = 40;

    public static uiCoordinateMap(coordinates: LineToDraw): LineToDraw {
    	const firstNewCoordinate = 
    		CoordinateTranslator.mapHexagonPointCoordinate({
    			x: coordinates.x, 
    			y: coordinates.y
    		} as CatanCoordinate
    	);

		const secondNewCoordinate = 
			CoordinateTranslator.mapHexagonPointCoordinate({
				x: coordinates.x1,
				y: coordinates.y1
			} as CatanCoordinate
		);

		CoordinateTranslator.theMappingMap.set(
			{x: coordinates.x, y: coordinates.y} as CatanCoordinate,
			firstNewCoordinate
		)

		CoordinateTranslator.theMappingMap.set(
			{x: coordinates.x1, y: coordinates.y1} as CatanCoordinate,
			secondNewCoordinate
		)

		return {
			x: firstNewCoordinate.x,
			y: firstNewCoordinate.y,
			x1: secondNewCoordinate.x,
			y1: secondNewCoordinate.y
		} as LineToDraw
    }

    public static closestRoad(uiCoordinate: CatanCoordinate, maxPixelDistance: number): LineToDraw {
    	let closestCoordinate = CoordinateTranslator.findClosestCoordinate(uiCoordinate)
    	let closestCoordinateUIMapped = CoordinateTranslator.mapHexagonPointCoordinate(closestCoordinate)

    	console.log(`${JSON.stringify(closestCoordinate)}`)

    	// next, get the two road segments that contain the closest points. 

    	let closestRoadSegments = RoadsToDraw.roadsCoordinates().filter(
    		rd => (rd.y === closestCoordinate.y && rd.x === closestCoordinate.x) 
    				|| (rd.y1 === closestCoordinate.y && rd.x1 === closestCoordinate.x)
    	)

    	let secondClosestPoint = CoordinateTranslator.findSecondClosestPoint(
    		closestRoadSegments,
    		closestCoordinate,
    		uiCoordinate
    	)

    	let firstCandidateCloseRoad = closestRoadSegments[0]
    	let secondCandidateCloseRoad = closestRoadSegments[1]

    	console.log(`First closest road candidate: ${JSON.stringify(firstCandidateCloseRoad)}`)
    	console.log(`Second closest road candidate: ${JSON.stringify(secondCandidateCloseRoad)}`)


    	let firstOtherCoordinateCandidate = 
    		{x: firstCandidateCloseRoad.x, y: firstCandidateCloseRoad.y} as CatanCoordinate === closestCoordinate ?
    		 {x: firstCandidateCloseRoad.x1, y: firstCandidateCloseRoad.y1} : {x: firstCandidateCloseRoad.x, y: firstCandidateCloseRoad.y}

    	let secondOtherCoordinateCandidate = 
    		{x: secondCandidateCloseRoad.x, y: secondCandidateCloseRoad.y} as CatanCoordinate === closestCoordinate ?
    		 {x: secondCandidateCloseRoad.x1, y: secondCandidateCloseRoad.y1} : {x: secondCandidateCloseRoad.x, y: secondCandidateCloseRoad.y}

    	console.log(`first potential closest coordiante: ${JSON.stringify(firstOtherCoordinateCandidate)}`)
    	console.log(`second potential closest coordiante: ${JSON.stringify(secondOtherCoordinateCandidate)}`)

    	let uiCoordinateFirstCandidate = CoordinateTranslator.mapHexagonPointCoordinate(firstOtherCoordinateCandidate)
    	let uiCoordinateSecondCandidate = CoordinateTranslator.mapHexagonPointCoordinate(secondOtherCoordinateCandidate)

    	console.log(`First closest road candidate UI: ${JSON.stringify(uiCoordinateFirstCandidate)}`)
    	console.log(`Second closest road candidate UI: ${JSON.stringify(uiCoordinateSecondCandidate)}`)


    	let closestRoad = Math.abs(
    		uiCoordinate.x - uiCoordinateFirstCandidate.x
    	) > 
    	Math.abs(
    		uiCoordinate.x - uiCoordinateSecondCandidate.x
    	) ? {x: closestCoordinateUIMapped.x, y: closestCoordinateUIMapped.y, x1: uiCoordinateFirstCandidate.x, y1: uiCoordinateFirstCandidate.y} as LineToDraw
    	: {x: closestCoordinateUIMapped.x, y: closestCoordinateUIMapped.y, x1: uiCoordinateSecondCandidate.x, y1: uiCoordinateSecondCandidate.y} as LineToDraw

    	console.log(`Closest Road: ${JSON.stringify(closestRoad)}`)

    	return closestRoad
    }

    // takes in list of roads which share coordinate ${connectedRoadSharedCoordinate}
    private static findSecondClosestPoint(
    	connectedRoads: Array<LineToDraw>,
    	sharedCoordinate: CatanCoordinate,
    	touchEventCoord: CatanCoordinate
    ) {

    	// First, identify coordinates that are not the closest point
    	var listOfCoordinates = new Array<CatanCoordinate>()
    	console.log(`Shared Coordinate: ${JSON.stringify(sharedCoordinate)}`)
    	for (var roads of connectedRoads) {
    		let candidateCoord = (roads.x === sharedCoordinate.x && roads.y === sharedCoordinate.y
    			? {x: roads.x1, y: roads.y1} : {x: roads.x, y: roads.y}) as CatanCoordinate
    		listOfCoordinates.push({x: candidateCoord.x, y: candidateCoord.y} as CatanCoordinate)

    		console.log(`Potential closest: ${JSON.stringify(candidateCoord)}`)
    	}

    	// Second, iterate these coordinates and find the closest to touchEventCoord
    	var currentLeastDistance = 9001 // Arbitrarily Large
    	var currentLeastDistanceCoord = {x:0,y:0} as CatanCoordinate
    	for (var coord of listOfCoordinates) {
    		let uiCoord = CoordinateTranslator
    						.mapHexagonPointCoordinate(coord)
    		let distance = CoordinateTranslator
    						.distanceBetweenTwoCoordinates(uiCoord, touchEventCoord)

    		console.log(`coord: ${JSON.stringify(coord)} distance: ${distance}`)
    		if (distance < currentLeastDistance) {
    			currentLeastDistance = distance
    			currentLeastDistanceCoord = coord
    		}
    	}

    	console.log(`second closest point: ${JSON.stringify(currentLeastDistanceCoord)}`)

    }

    private static findClosestCoordinate(uiCoordinate: CatanCoordinate): CatanCoordinate {

    	let closestModelYCoordinate = Math.round(
    		uiCoordinate.y/CoordinateTranslator.yCoordinateMultiplier
    	)

    	let closestModelXCoordinate = Math.round(
    		(uiCoordinate.x - CoordinateTranslator.calculateLeftSideMargin(closestModelYCoordinate)) 
    			/ CoordinateTranslator.xCoordinateMultiplier
    	)


    	return {x: closestModelXCoordinate, y: closestModelYCoordinate} as CatanCoordinate
    }


    // Private Functions
    private static mapHexagonPointCoordinate(coordinate: CatanCoordinate): CatanCoordinate {

    	const newXCoordinate = CoordinateTranslator.calculateLeftSideMargin(coordinate.y) + coordinate.x * CoordinateTranslator.xCoordinateMultiplier;
    	const newYCoordinate = coordinate.y * CoordinateTranslator.yCoordinateMultiplier;

    	return {x: newXCoordinate, y: newYCoordinate} as CatanCoordinate;
    }

    private static calculateLeftSideMargin(y: number): number {

    	switch(y) {
    		case 0:
    		case 11:
    			return 4 * CoordinateTranslator.leftSideMargin;
    		case 1:
    		case 2: 
    		case 9:
    		case 10:
    			return 3 * CoordinateTranslator.leftSideMargin;
    		case 3:
    		case 4:
    		case 7:
    		case 8:
    			return 2 * CoordinateTranslator.leftSideMargin;
    		default: {
    			return 1 * CoordinateTranslator.leftSideMargin;
    		}
    	}
    }

    private static distanceBetweenTwoCoordinates(
    	firstCoord: CatanCoordinate,
    	secondCoord: CatanCoordinate
    ): number {
    	let ySqrd = Math.pow(secondCoord.y - firstCoord.y, 2)
    	let xSqrd = Math.pow(secondCoord.x - firstCoord.x, 2)

    	return Math.sqrt(ySqrd + xSqrd)
    }
}
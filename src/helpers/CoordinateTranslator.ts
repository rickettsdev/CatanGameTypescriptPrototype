import LineToDraw from '../models/LineToDraw';
import CatanCoordinate from '../models/CatanCoordinate';

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

    	console.log(`${JSON.stringify(closestCoordinate)}`)

    	return {
    		x: 0,
			y: 0,
			x1: 250,
			y1: 250
		} as LineToDraw
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
}
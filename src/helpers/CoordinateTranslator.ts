import LineToDraw from '../models/LineToDraw';
import CatanCoordinate from '../models/CatanCoordinate';

export default abstract class CoordinateTranslator {
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

		// console.log(`${JSON.stringify(coordinates)}`);

		// TODO: will return UI coordiantes.
		return {
			x: firstNewCoordinate.x,
			y: firstNewCoordinate.y,
			x1: secondNewCoordinate.x,
			y1: secondNewCoordinate.y
		} as LineToDraw
    }

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
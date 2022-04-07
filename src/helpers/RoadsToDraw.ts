import CatanCoordinate from "../models/CatanCoordinate";
import LineToDraw from "../models/LineToDraw";

export default abstract class RoadsToDraw {

	private static allPossibleCoordinatesSet = new Array<CatanCoordinate>()
	public static roadsCoordinates(): Array<LineToDraw> {
		const r =  [
			{
				x: 0,
				y: 0,
				x1: 0,
				y1: 1
			}, {
				x: 0,
				y: 1,
				x1: 0,
				y1: 2
			}, {
				x: 0,
				y: 2,
				x1: 0,
				y1: 3
			}, {
				x: 0,
				y: 3,
				x1: 0,
				y1: 4
			}, {
				x: 0,
				y: 4,
				x1: 0,
				y1: 5
			}, {
				x: 0,
				y: 5,
				x1: 0,
				y1: 6
			}, {
				x: 0,
				y: 6,
				x1: 0,
				y1: 7
			}, {
				x: 0,
				y: 7,
				x1: 0,
				y1: 8
			}, {
				x: 0,
				y: 8,
				x1: 0,
				y1: 9
			}, {
				x: 0,
				y: 9,
				x1: 0,
				y1: 10
			}, {
				x: 0,
				y: 10,
				x1: 0,
				y1: 11
			}, {
				x: 0,
				y: 4,
				x1: 1,
				y1: 5
			}, {
				x: 1,
				y: 5,
				x1: 1,
				y1: 6
			}, {
				x: 1,
				y: 6,
				x1: 0,
				y1: 7
			}, {
				x: 1,
				y: 6,
				x1: 1,
				y1: 7
			}, {
				x: 1,
				y: 7,
				x1: 1,
				y1: 8
			}, {
				x: 1,
				y: 8,
				x1: 0,
				y1: 9
			}, {
				x: 1,
				y: 8,
				x1: 1,
				y1: 9
			}, {
				x: 1,
				y: 9,
				x1: 1,
				y1: 10
			}, {
				x: 1,
				y: 10,
				x1: 0,
				y1: 11
			}, {
				x: 1,
				y: 10,
				x1: 1,
				y1: 11
			}, {
				x: 0,
				y: 2,
				x1: 1,
				y1: 3
			}, {
				x: 1,
				y: 3,
				x1: 1,
				y1: 4
			}, {
				x: 1,
				y: 4,
				x1: 1,
				y1: 5
			}, {
				x: 1,
				y: 4,
				x1: 2,
				y1: 5
			}, {
				x: 2,
				y: 5,
				x1: 2,
				y1: 6
			}, {
				x: 2,
				y: 6,
				x1: 1,
				y1: 7
			}, {
				x: 2,
				y: 6,
				x1: 2,
				y1: 7
			}, {
				x: 2,
				y: 7,
				x1: 2,
				y1: 8
			}, {
				x: 2,
				y: 8,
				x1: 1,
				y1: 9
			}, {
				x: 2,
				y: 8,
				x1: 2,
				y1: 9
			}, {
				x: 2,
				y: 9,
				x1: 2,
				y1: 10
			}, {
				x: 2,
				y: 10,
				x1: 1,
				y1: 11
			}, {
				x: 2,
				y: 10,
				x1: 2,
				y1: 11
			}, {
				x: 0,
				y: 0,
				x1: 1,
				y1: 1
			}, {
				x: 1,
				y: 1,
				x1: 1,
				y1: 2
			}, {
				x: 1,
				y: 2,
				x1: 1,
				y1: 3
			}, {
				x: 1,
				y: 2,
				x1: 2,
				y1: 3
			}, {
				x: 2,
				y: 3,
				x1: 2,
				y1: 4
			}, {
				x: 2,
				y: 4,
				x1: 2,
				y1: 5
			}, {
				x: 2,
				y: 4,
				x1: 3,
				y1: 5
			}, {
				x: 3,
				y: 5,
				x1: 3,
				y1: 6
			}, {
				x: 3,
				y: 6,
				x1: 2,
				y1: 7
			}, {
				x: 3,
				y: 6,
				x1: 3,
				y1: 7
			}, {
				x: 3,
				y: 7,
				x1: 3,
				y1: 8
			}, {
				x: 3,
				y: 8,
				x1: 2,
				y1: 9
			}, {
				x: 3,
				y: 8,
				x1: 3,
				y1: 9
			}, {
				x: 3,
				y: 9,
				x1: 3,
				y1: 10
			}, {
				x: 3,
				y: 10,
				x1: 2,
				y1: 11
			}, {
				x: 1,
				y: 0,
				x1: 1,
				y1: 1
			}, {
				x: 1,
				y: 0,
				x1: 2,
				y1: 1
			}, {
				x: 2,
				y: 1,
				x1: 2,
				y1: 2
			}, {
				x: 2,
				y: 2,
				x1: 2,
				y1: 3
			}, {
				x: 2,
				y: 2,
				x1: 3,
				y1: 3
			}, {
				x: 3,
				y: 3,
				x1: 3,
				y1: 4
			}, {
				x: 3,
				y: 4,
				x1: 3,
				y1: 5
			}, {
				x: 3,
				y: 4,
				x1: 4,
				y1: 5
			}, {
				x: 4,
				y: 5,
				x1: 4,
				y1: 6
			}, {
				x: 4,
				y: 6,
				x1: 3,
				y1: 7
			}, {
				x: 4,
				y: 6,
				x1: 4,
				y1: 7
			}, {
				x: 4,
				y: 7,
				x1: 4,
				y1: 8
			}, {
				x: 4,
				y: 8,
				x1: 3,
				y1: 9
			}, {
				x: 2,
				y: 0,
				x1: 2,
				y1: 1
			}, {
				x: 2,
				y: 0,
				x1: 3,
				y1: 1
			}, {
				x: 3,
				y: 1,
				x1: 3,
				y1: 2
			}, {
				x: 3,
				y: 2,
				x1: 3,
				y1: 3
			}, {
				x: 3,
				y: 2,
				x1: 4,
				y1: 3
			}, {
				x: 4,
				y: 3,
				x1: 4,
				y1: 4
			}, {
				x: 4,
				y: 4,
				x1: 4,
				y1: 5
			}, {
				x: 4,
				y: 4,
				x1: 5,
				y1: 5
			}, {
				x: 5,
				y: 5,
				x1: 5,
				y1: 6
			}, {
				x: 5,
				y: 6,
				x1: 4,
				y1: 7
			}
		] as Array<LineToDraw>;
		return r;
	}

	public static allPossibleCoordinates(): Array<CatanCoordinate> {
		if (this.allPossibleCoordinatesSet.length != 0) {
			console.log("Retrieving cached coordinates")
			return this.allPossibleCoordinatesSet
		}

		let allRoads = RoadsToDraw.roadsCoordinates()

		var allCoordinatesSet: Set<string> = new Set<string>()

		for (var road of allRoads) {
			let firstCoordinate: CatanCoordinate = {x: road.x, y: road.y}
			let secondCoordinate: CatanCoordinate = {x: road.x1, y: road.y1}

			allCoordinatesSet.add(`${firstCoordinate.x}-${firstCoordinate.y}`)
			allCoordinatesSet.add(`${secondCoordinate.x}-${secondCoordinate.y}`)
		}

		// This is a stinky hack due to me not figuring out how to have Set<interface> values be unique.
		let coordinatesList: Array<CatanCoordinate> = Array.from(allCoordinatesSet.values()).map(value => {
			let coordArray = value.split('-', 2).map(value => {
				return +value
			})
			let x = coordArray[0]
			let y = coordArray[1]
			return {x: x, y: y}
		})

		this.allPossibleCoordinatesSet = coordinatesList

		return coordinatesList
	}
}
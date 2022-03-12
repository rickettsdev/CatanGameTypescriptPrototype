import LineToDraw from '../models/LineToDraw';
import RoadsToDraw from '../helpers/RoadsToDraw';

import LineProperties from '../models/LineProperties'
import {CatanGameColor} from '../models/CatanGameColor'

export const createRoadsMap = (): Map<LineToDraw, LineProperties> => {

  let roadsColorMap = new Map<LineToDraw, LineProperties>()

  for (var road of RoadsToDraw.roadsCoordinates()) {
    let lineData: LineProperties = {width: 1, color: CatanGameColor.UNASSIGNED}

    roadsColorMap.set(road, lineData)
  }

  return roadsColorMap
}
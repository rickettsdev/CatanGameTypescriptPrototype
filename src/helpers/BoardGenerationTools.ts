import LineToDraw from '../models/LineToDraw';
import RoadsToDraw from '../helpers/RoadsToDraw';

import {CatanGameColor} from '../models/CatanGameColor'

export const createRoadsMap = (): Map<LineToDraw, CatanGameColor> => {

  let roadsColorMap = new Map<LineToDraw, CatanGameColor>()

  for (var road of RoadsToDraw.roadsCoordinates()) {
    roadsColorMap.set(road, CatanGameColor.UNASSIGNED)
  }

  return roadsColorMap
}
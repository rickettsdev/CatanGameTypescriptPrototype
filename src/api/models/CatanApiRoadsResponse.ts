import LineToDraw from '../../models/LineToDraw';

export default interface CatanApiRoadsResponse {
  red: Array<LineToDraw>,
  yellow: Array<LineToDraw>,
  blue: Array<LineToDraw>,
  white: Array<LineToDraw>
}
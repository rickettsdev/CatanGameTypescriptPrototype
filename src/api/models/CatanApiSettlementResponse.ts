import CatanSettlementModel from './CatanSettlementModel'

export default interface CatanApiSettlementResponse {
	red: Array<CatanSettlementModel>,
	yellow: Array<CatanSettlementModel>,
	blue: Array<CatanSettlementModel>,
	white: Array<CatanSettlementModel>,
}
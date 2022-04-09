import { CatanResource } from "./CatanResource";

export default interface CatanPlayerResourceCardsResponse {
    red: Array<CatanResource>,
    blue: Array<CatanResource>,
    yellow: Array<CatanResource>,
    white: Array<CatanResource>,
}
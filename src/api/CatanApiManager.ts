import CatanCoordinate from "../models/CatanCoordinate"
import LineToDraw from "../models/LineToDraw"

let host = "localhost"

export async function catanFetchApi<T>(path: string, requestInit: RequestInit,
   completion: { (response: T): void}): Promise<T> {
    const response = await fetch(`http://${host}:4567/catan${path}`, requestInit)
                        .then(response => response.json())
                        .catch(error => console.log(error))
  
      let responseModel = JSON.parse(response) as T
      completion(responseModel)
      console.log(responseModel)
      return responseModel
}

export async function catanAddRoadAPI(lineToDraw: LineToDraw, color: string): Promise<boolean> {
  let headers = new Headers()
  headers.set('x', `${lineToDraw.x}`)
  headers.set('y', `${lineToDraw.y}`)
  headers.set('x1', `${lineToDraw.x1}`)
  headers.set('y1', `${lineToDraw.y1}`)
  headers.set('color', `${color}`)

  return catanPostAPI(`http://${host}:4567/catan/addRoad`, headers)
}

export async function catanAddSettlementAPI(coordinate: CatanCoordinate, color: string): Promise<boolean> {
  let headers = new Headers()
  headers.set('x', `${coordinate.x}`)
  headers.set('y', `${coordinate.y}`)
  headers.set('color', `${color}`)

  return catanPostAPI(`http://${host}:4567/catan/addSettlement`, headers)
}

// Returns true or false based on whether call was successful.
async function catanPostAPI(url: string, headers: HeadersInit): Promise<boolean> {
  let requestInit: RequestInit = {method: 'POST', headers: headers}
  const response = await fetch(url, requestInit)
                        .catch(error => console.log(error)) as Response
  
  return new Promise<boolean>((resolve, reject) => {

    if(response.status === 200) resolve(true)
    else reject()
  })
}
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

// This is POC for POST
export async function catanRoadPlacementAPI<T>(lineToDraw: LineToDraw, color: string,
   completion: { (response: T): void}): Promise<T> {
    let requestInit: RequestInit = {
      method: 'POST'
    }
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('x', `${lineToDraw.x}`)
    requestHeaders.set('y', `${lineToDraw.y}`)
    requestHeaders.set('x1', `${lineToDraw.x1}`)
    requestHeaders.set('y1', `${lineToDraw.y1}`)
    requestHeaders.set('color', `${color}`)
    requestInit.headers = requestHeaders
    const response = await fetch(`http://${host}:4567/catan/addRoad`, requestInit)
                        .then(response => response.json())
                        .catch(error => console.log(error))
      return response
}
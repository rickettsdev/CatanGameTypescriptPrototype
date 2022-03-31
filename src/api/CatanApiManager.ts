export async function catanFetchApi<T>(path: string, requestInit: RequestInit,
   completion: { (response: T): void}): Promise<T> {
    const response = await fetch(`http://localhost:4567/catan${path}`, requestInit)
                        .then(response => response.json())
                        .catch(error => console.log(error))
  
      let responseModel = JSON.parse(response) as T
      completion(responseModel)
      console.log(responseModel)
      return responseModel
}

// This is POC for POST
export async function catanRoadPlacementAPI<T>(requestInit: RequestInit,
   completion: { (response: T): void}): Promise<T> {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('x', '1')
    requestHeaders.set('y', '5')
    requestHeaders.set('x1', '1')
    requestHeaders.set('y1', '6')
    requestHeaders.set('color', 'BLUE')
    requestInit.headers = requestHeaders
    const response = await fetch(`http://localhost:4567/catan/addRoad`, requestInit)
                        .then(response => response.json())
                        .catch(error => console.log(error))
  
      let responseModel = JSON.parse(response) as T
      completion(responseModel)
      console.log(responseModel)
      return responseModel
}
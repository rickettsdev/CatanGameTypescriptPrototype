export async function catanFetchApi<T>(path: string, completion: { (response: T): void}): Promise<T> {
    const response = await fetch(`http://localhost:4567/catan${path}`, {
        method: 'GET'
      }).then(response => response.json()).catch(error => console.log(error))
  
      let responseModel = JSON.parse(response) as T
      completion(responseModel)
      console.log(responseModel)
      return responseModel
}
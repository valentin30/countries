import { Country } from '../dto/Country'

const basePath: string = process.env.REACT_APP_API_URL ?? ''

const getResource = <T>(route: string): Promise<T> => {
    return fetch(basePath + route)
        .then(res => res.json())
        .catch(console.log)
}

export const getAllCountries = (): Promise<Country[]> => getResource<Country[]>('/countries')
export const getCountriesByName = (name: string): Promise<Country[]> => getResource<Country[]>(`/countries/${name}`)

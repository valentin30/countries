import { resolve } from 'path/posix'
import { useSearchParams } from 'react-router-dom'

export enum QueryTypes {
    String = 'string',
    Number = 'number',
    Boolean = 'boolean'
}

const getValue = <T>(value: string, type: QueryTypes): T => {
    switch (type) {
        case QueryTypes.Number:
            return +value as unknown as T
        case QueryTypes.Boolean:
            return (value === 'true') as unknown as T
        default:
            return value as unknown as T
    }
}

const config: { timerId: number; paramsMap: { [key: string]: string } } = {
    timerId: 0,
    paramsMap: {}
}

export const useQuery = <T>(key: string, type: QueryTypes = QueryTypes.String): [T, (value: T) => void] => {
    const [params, setParams] = useSearchParams()
    const query = getValue<T>(params.get(key), type)

    if (!config.paramsMap[key]) {
        config.paramsMap[key] = `${query}`
    }

    const setQuery = (value: T) => {
        config.timerId++
        config.paramsMap[key] = `${value}`
        let current = config.timerId
        Promise.resolve()
            .then(() => {
                if (config.timerId !== current) {
                    throw new Error(`CANCEL UPDATE: ${current} updates from it applied to update ${config.timerId}`)
                }
                setParams(config.paramsMap)
                config.timerId = 0
            })
            .catch(console.log)
    }

    return [query, setQuery]
}

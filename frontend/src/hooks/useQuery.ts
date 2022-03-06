import { useCallback } from 'react'
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

const config: { currentBatchNumber: number; paramsMap: { [key: string]: string } } = {
    currentBatchNumber: 0,
    paramsMap: {}
}

export const useQuery = <T>(key: string, type: QueryTypes = QueryTypes.String): [T, (value: T) => void] => {
    const [params, setParams] = useSearchParams()
    const query = getValue<T>(params.get(key), type)

    if (!config.paramsMap[key]) {
        config.paramsMap[key] = `${query}`
    }

    const setQuery = useCallback(
        (value: T) => {
            config.currentBatchNumber++
            config.paramsMap[key] = `${value}`
            let current = config.currentBatchNumber
            Promise.resolve()
                .then(() => {
                    if (config.currentBatchNumber !== current) {
                        throw new Error(`CANCEL UPDATE: another update requested`)
                    }
                    setParams(config.paramsMap)
                    config.currentBatchNumber = 0
                })
                .catch(error => console.log(error.message))
        },
        [key, setParams]
    )

    return [query, setQuery]
}

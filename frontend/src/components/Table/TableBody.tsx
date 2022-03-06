import React, { FunctionComponent, PointerEventHandler, useCallback, useRef, useState } from 'react'
import { Country } from '../../dto/Country'
import { QueryTypes, useQuery } from '../../hooks/useQuery'
import { Detail } from '../Detail'
import { LoadingTableRow, TableRow } from './TableRow'

interface Props {
    loading: boolean
    error: boolean
    list: Country[]
}

export const TableBody: FunctionComponent<Props> = props => {
    const [size] = useQuery<number>('size', QueryTypes.Number)

    const [loading, setLoading] = useState<string | null>(null)
    const [active, setActive] = useState<string | null>(null)

    const longPressTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)
    const longPressDebounceTimerId = useRef<ReturnType<typeof setTimeout> | null>(null)

    const country = props.list.find(c => c.code === active)

    const longPressHandler = useCallback<PointerEventHandler>(event => {
        if (event.button === 0 && event.buttons === 1) {
            // For Chrome, Brave and Firefox event.button === 0 and event.buttons === 1 only on left click
            longPressDebounceTimerId.current = setTimeout(() => {
                setLoading(event.target.closest('.table__row').dataset.code)
                longPressTimeoutId.current = setTimeout(() => {
                    setActive(event.target.closest('.table__row').dataset.code)
                }, 2500)
            }, 500)
        }
    }, [])

    const longPressFailHandler = useCallback<PointerEventHandler>(() => {
        if (longPressDebounceTimerId.current !== null) {
            clearTimeout(longPressDebounceTimerId.current)
            longPressDebounceTimerId.current = null
        }
        if (longPressTimeoutId.current !== null) {
            clearTimeout(longPressTimeoutId.current)
            longPressTimeoutId.current = null
            setLoading(null)
        }
    }, [])

    return (
        <>
            <Detail country={country} onClose={() => setActive(null)} />
            <div className='table__body'>
                {!props.loading &&
                    props.list.map(country => (
                        <TableRow
                            key={country.code}
                            country={country}
                            onLongPress={longPressHandler}
                            onLongPressFail={longPressFailHandler}
                            loading={country.code === active || country.code === loading}
                        />
                    ))}
                {props.loading &&
                    Array(size)
                        .fill(1)
                        .map((_, i) => <LoadingTableRow key={i} />)}
                {props.error &&
                    Array(size)
                        .fill(1)
                        .map((_, i) => <div className='table__row' key={i} />)}
            </div>
        </>
    )
}

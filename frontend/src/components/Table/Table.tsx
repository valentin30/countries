import React, { FunctionComponent, PointerEventHandler, useCallback, useRef, useState } from 'react'
import { Country } from '../../dto/Country'
import { TableHeader } from './TableHeader'
import { TableRow } from './TableRow'
import { Columns } from './types'
import './Table.scss'

interface Props {
    countries: Country[]
    columns: Columns
    onLongPress: (code: string) => void
    onLongPressCancel: PointerEventHandler
}

export const Table: FunctionComponent<Props> = props => {
    const [activeCode, setActiveCode] = useState<string | null>(null)
    const longPressTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)
    const longPressDebounceTimerId = useRef<ReturnType<typeof setTimeout> | null>(null)
    const { onLongPress, onLongPressCancel } = props

    const pointerDownEventHandler = useCallback<PointerEventHandler>(
        event => {
            if (event.button === 0 && event.buttons === 1) {
                // For Chrome, Brave and Firefox event.button === 0 and event.buttons === 1 only on left click
                longPressDebounceTimerId.current = setTimeout(() => {
                    setActiveCode(event.target.closest('tr').dataset.code)
                    longPressTimeoutId.current = setTimeout(() => {
                        onLongPress(event.target.closest('tr').dataset.code)
                    }, 2500)
                }, 500)
            }
        },
        [onLongPress]
    )

    const pointerOutEventHandler = useCallback<PointerEventHandler>(
        event => {
            if (longPressDebounceTimerId.current !== null) {
                clearTimeout(longPressDebounceTimerId.current)
                longPressDebounceTimerId.current = null
            }
            if (longPressTimeoutId.current !== null) {
                clearTimeout(longPressTimeoutId.current)
                longPressTimeoutId.current = null
                setActiveCode(null)
                onLongPressCancel(event)
            }
        },
        [onLongPressCancel]
    )

    return (
        <div className='table'>
            <table>
                <TableHeader columns={props.columns} />
                <tbody>
                    {props.countries.map(country => (
                        <TableRow
                            key={country.code}
                            country={country}
                            onLongPress={pointerDownEventHandler}
                            onLongPressCancel={pointerOutEventHandler}
                            loading={country.code === activeCode}
                            columns={props.columns}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

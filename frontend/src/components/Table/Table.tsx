import React, { FunctionComponent, PointerEventHandler, useCallback, useRef, useState } from 'react'
import { Country } from '../../dto/Country'
import './Table.scss'
import { TableRow } from './TableRow'

interface Props {
    countries: Country[]
    onLongPress: PointerEventHandler
    onLongPressCancel: PointerEventHandler
}

export const Table: FunctionComponent<Props> = props => {
    const [activeCode, setActiveCode] = useState<string | null>(null)
    const longPressTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)
    const longPressDebounceTimerId = useRef<ReturnType<typeof setTimeout> | null>(null)

    const pointerDownEventHandler = useCallback<PointerEventHandler>(
        event => {
            longPressDebounceTimerId.current = setTimeout(() => {
                setActiveCode(event.target.closest('tr').dataset.code)
                longPressTimeoutId.current = setTimeout(() => {
                    props.onLongPress(event)
                }, 2500)
            }, 500)
        },
        [props.onLongPress]
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
                props.onLongPressCancel(event)
            }
        },
        [props.onLongPressCancel]
    )

    return (
        <div className='table'>
            <table>
                <thead>
                    <tr>
                        <th className='table__loader'></th>
                        <th className='table__code'>Code</th>
                        <th className='table__flag'>Flag</th>
                        <th className='table__name'>Name</th>
                        <th className='table__capital'>Capital</th>
                        <th className='table__population'>Population</th>
                        <th className='table__region'>Region</th>
                        <th className='table__subregion'>Subregion</th>
                    </tr>
                </thead>
                <tbody>
                    {props.countries.map(country => (
                        <TableRow
                            country={country}
                            onLongPress={pointerDownEventHandler}
                            onLongPressCancel={pointerOutEventHandler}
                            key={country.code}
                            loading={country.code === activeCode}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

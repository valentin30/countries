import React, { FunctionComponent, PointerEventHandler } from 'react'
import { Country } from '../../dto/Country'
import { Loader } from '../Loader'
import { TableCell } from './TableCell'
import { Columns, TableColumns, TableColumsArray } from './types'

interface Props {
    country: Country
    columns: Columns
    loading: boolean
    onLongPress: PointerEventHandler
    onLongPressFail: PointerEventHandler
}

export const TableRowComponent: FunctionComponent<Props> = props => {
    return (
        <div
            data-code={props.country.code}
            onPointerDown={props.onLongPress}
            onPointerLeave={props.onLongPressFail}
            onPointerUp={props.onLongPressFail}
            className='table__row'
        >
            <div className='table__cell loader'>
                <Loader loading={props.loading} size='small' />
            </div>
            {TableColumsArray.map(key => {
                if (!props.columns[key]) {
                    return null
                }
                switch (key) {
                    case TableColumns.FLAG:
                        return (
                            <TableCell key={key} name={key} src={props.country.flag} alt={props.country.code} image />
                        )
                    case TableColumns.CAPITAL:
                        return (
                            <TableCell key={key} name={key}>
                                {props.country.capitalName}
                            </TableCell>
                        )
                    case TableColumns.POPULATION:
                        return (
                            <TableCell key={key} name={key}>
                                {props.country.population
                                    .toString()
                                    .split('')
                                    .reverse()
                                    .reduce((num, ch, i) => ((i + 1) % 3 === 0 ? ' ' : '') + (ch + num), '')}
                            </TableCell>
                        )
                    default:
                        return (
                            <TableCell key={key} name={key}>
                                {props.country[key]}
                            </TableCell>
                        )
                }
            })}
        </div>
    )
}

export const TableRow = React.memo(TableRowComponent)
// export const TableRow = TableRowComponent

import React, { FunctionComponent, PointerEventHandler } from 'react'
import { Country } from '../../dto/Country'
import { TableColumsArray, TableColumns } from '../../utils/constants'
import { Loader } from '../Loader'
import { TableCell } from './TableCell'
import { getReadableNumber } from '../../utils/functions'

export const LoadingTableRow: FunctionComponent = () => {
    return (
        <div className='table__row'>
            <div className='table__cell loader'></div>
            {TableColumsArray.map(key => (
                <TableCell key={key} name={key} loading />
            ))}
        </div>
    )
}

interface TableRowProps {
    country: Country
    loading: boolean
    onLongPress: PointerEventHandler
    onLongPressFail: PointerEventHandler
}

export const TableRowComponent: FunctionComponent<TableRowProps> = props => {
    const population = getReadableNumber(props.country.population)
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
                                {population}
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

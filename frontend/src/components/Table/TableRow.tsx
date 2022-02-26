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
    onLongPressCancel: PointerEventHandler
}

export const TableRowComponent: FunctionComponent<Props> = props => {
    return (
        <tr
            data-code={props.country.code}
            onPointerDown={props.onLongPress}
            onPointerLeave={props.onLongPressCancel}
            onPointerUp={props.onLongPressCancel}
            className='table-row'
        >
            <td className='table-row__loader'>
                <Loader loading={props.loading} size='small' />
            </td>
            {TableColumsArray.map(key => {
                if (!props.columns[key]) {
                    return null
                }
                switch (key) {
                    case TableColumns.FLAG:
                        return (
                            <TableCell key={key} name={key}>
                                <img src={props.country.flag} alt={props.country.code} />
                            </TableCell>
                        )
                    case TableColumns.CAPITAL:
                        return (
                            <TableCell key={key} name={key}>
                                {props.country.capitalName}
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
        </tr>
    )
}

export const TableRow = React.memo(TableRowComponent)

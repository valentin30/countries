import React, { FunctionComponent, MouseEventHandler } from 'react'
import { Columns, TableColumsArray } from '../../types'
import { TableCell } from './TableCell'
import { Sort } from './Table'

interface Props {
    columns: Columns
    onSort: MouseEventHandler<HTMLButtonElement>
    sort: Sort
}

const TableHeaderComponent: FunctionComponent<Props> = props => {
    return (
        <div className='table__header'>
            <div className='table__row'>
                <div className='table__cell loader'></div>
                {TableColumsArray.map(key => {
                    if (!props.columns[key]) {
                        return null
                    }
                    return (
                        <TableCell
                            onSort={props.onSort}
                            direction={props.sort.name === key ? props.sort.direction : 1}
                            key={key}
                            name={key}
                            header
                        />
                    )
                })}
            </div>
        </div>
    )
}

export const TableHeader = React.memo(TableHeaderComponent)
// export const TableHeader = TableHeaderComponent

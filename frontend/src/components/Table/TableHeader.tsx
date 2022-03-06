import React, { FunctionComponent, MouseEventHandler } from 'react'
import { TableColumsArray } from '../../utils/constants'
import { Sort } from './Table'
import { TableCell } from './TableCell'

interface Props {
    onSort: MouseEventHandler<HTMLButtonElement>
    sort: Sort
}

const TableHeaderComponent: FunctionComponent<Props> = props => {
    return (
        <div className='table__header'>
            <div className='table__row'>
                <div className='table__cell loader'></div>
                {TableColumsArray.map(key => (
                    <TableCell
                        onSort={props.onSort}
                        direction={props.sort.name === key ? props.sort.direction : 1}
                        key={key}
                        name={key}
                        header
                    />
                ))}
            </div>
        </div>
    )
}

export const TableHeader = React.memo(TableHeaderComponent)

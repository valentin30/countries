import React, { FunctionComponent } from 'react'
import { TableCell } from './TableCell'
import { Columns, TableColumsArray } from './types'

interface Props {
    columns: Columns
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
                    return <TableCell key={key} name={key} header />
                })}
            </div>
        </div>
    )
}

export const TableHeader = React.memo(TableHeaderComponent)
// export const TableHeader = TableHeaderComponent

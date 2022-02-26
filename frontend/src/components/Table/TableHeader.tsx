import React, { FunctionComponent, useEffect } from 'react'
import { TableCell } from './TableCell'
import { Columns, TableColumsArray } from './types'

interface Props {
    columns: Columns
}

const TableHeaderComponent: FunctionComponent<Props> = props => {
    useEffect(() => {
        console.log('UPDATE - TABLE HEAER COMPONENT')
    })

    return (
        <thead>
            <tr className='table-row'>
                <th className='table-row__loader'></th>
                {TableColumsArray.map(key => {
                    if (!props.columns[key]) {
                        return null
                    }
                    return <TableCell key={key} name={key} header />
                })}
            </tr>
        </thead>
    )
}

export const TableHeader = React.memo(TableHeaderComponent)

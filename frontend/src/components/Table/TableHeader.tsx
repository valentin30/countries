import React, { FocusEventHandler, FunctionComponent, MouseEventHandler } from 'react'
import { BsFilterLeft } from 'react-icons/bs'
import { TableColumsArray } from '../../utils/constants'
import { Sort } from './Table'
import { TableCell } from './TableCell'

interface Props {
    onSort: MouseEventHandler<HTMLButtonElement>
    onFilterOpen: MouseEventHandler<HTMLButtonElement>
    sort: Sort
    hasActiveFilters: boolean
}

const TableHeaderComponent: FunctionComponent<Props> = props => {
    return (
        <div className='table__header'>
            <div className='table__row'>
                <div className='table__cell loader header'>
                    <button
                        onClick={props.onFilterOpen}
                        className={`table__filters${props.hasActiveFilters ? ' active' : ''}`}
                        aria-label='Filters'
                    >
                        <BsFilterLeft />
                    </button>
                </div>
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

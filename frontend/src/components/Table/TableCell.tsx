import React, { FunctionComponent, MouseEventHandler } from 'react'
import { AiOutlineSortAscending, AiOutlineSortDescending } from 'react-icons/ai'
import { TableColumns } from '../../types'

interface Props {
    name: TableColumns
    header?: boolean
    image?: boolean
    src?: string
    alt?: string
    children?: React.ReactNode
    loading?: boolean
    direction?: number
    onSort?: MouseEventHandler<HTMLButtonElement>
}

const getChildren = (props: Props): React.ReactNode => {
    if (props.image) {
        return <img src={props.src} alt={props.alt} />
    }
    if (props.header && props.name === TableColumns.FLAG) {
        return props.name
    }
    if (props.header) {
        return (
            <>
                {props.name}
                <button
                    className='table__sort'
                    onClick={props.onSort}
                    data-sort={props.name}
                    aria-label={props.direction === 1 ? 'Sort Ascending' : 'Sort Descending'}
                >
                    {props.direction === 1 ? <AiOutlineSortAscending /> : <AiOutlineSortDescending />}
                </button>
            </>
        )
    }
    return props.children
}

const TableCellComponent: FunctionComponent<Props> = props => {
    if (props.loading) {
        return <div className={`table__cell ${props.name} loading`} />
    }
    return (
        <div className={`table__cell ${props.name}${props.header ? ' header' : ''}`}>{getChildren(props) || 'n/a'}</div>
    )
}

export const TableCell = React.memo(TableCellComponent)
// export const TableCell = TableCellComponent

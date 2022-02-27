import React, { FunctionComponent } from 'react'

interface Props {
    name: string
    header?: boolean
    image?: boolean
    src?: string
    alt?: string
    children?: React.ReactNode
}

const TableCellComponent: FunctionComponent<Props> = props => {
    if (props.image) {
        return (
            <div className={`table__cell ${props.name}`}>
                <img src={props.src} alt={props.alt} />
            </div>
        )
    }
    if (props.header) {
        return <div className={`table__cell ${props.name}`}>{props.name}</div>
    }
    return <div className={`table__cell ${props.name}`}>{props.children}</div>
}

export const TableCell = React.memo(TableCellComponent)
// export const TableCell = TableCellComponent

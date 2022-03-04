import React, { FunctionComponent } from 'react'

interface Props {
    name: string
    header?: boolean
    image?: boolean
    src?: string
    alt?: string
    children?: React.ReactNode
    loading?: boolean
}

const getChildren = (props: Props): React.ReactNode => {
    if (props.image) {
        return <img src={props.src} alt={props.alt} />
    }
    if (props.header) {
        return props.name
    }
    return props.children
}

const TableCellComponent: FunctionComponent<Props> = props => {
    if (props.loading) {
        return <div className={`table__cell ${props.name} loading`} />
    }
    return <div className={`table__cell ${props.name}`}>{getChildren(props) || 'n/a'}</div>
}

export const TableCell = React.memo(TableCellComponent)
// export const TableCell = TableCellComponent

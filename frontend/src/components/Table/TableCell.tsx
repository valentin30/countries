import { FunctionComponent } from 'react'

interface Props {
    name: string
    header?: boolean
}

export const TableCell: FunctionComponent<Props> = props => {
    if (props.header) {
        return <th className={`table-row__${props.name}`}>{props.name}</th>
    }
    return <td className={`table-row__${props.name}`}>{props.children}</td>
}

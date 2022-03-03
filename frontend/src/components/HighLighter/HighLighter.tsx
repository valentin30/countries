import React, { FunctionComponent } from 'react'

interface Props {
    highlight: string
    children: string
}

const getIndexes = (string: string, search: string): number[] => {
    let index = string.indexOf(search)
    const indexes = [0]
    while (index !== -1) {
        indexes.push(index)
        indexes.push(index + search.length)
        index = string.indexOf(search, index + search.length)
    }
    indexes.push(string.length)
    return indexes
}

export const HighLighter: FunctionComponent<Props> = props => {
    const { children, highlight } = props
    if (!children || !highlight) return <>{children}</>

    const components = getIndexes(children.toLowerCase(), highlight.toLowerCase()).map(
        (value, index, array): JSX.Element => {
            if (array.length - 1 === index) return null
            const tag = (index + 1) % 2 === 0 ? 'b' : 'span'
            const text = children.substring(value, array[index + 1])
            return React.createElement(tag, { key: value + text + index }, text)
        }
    )

    return <>{components}</>
}

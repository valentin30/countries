import React, { useEffect } from 'react'
import { FunctionComponent, PointerEventHandler } from 'react'
import { Country } from '../../../dto/Country'
import { Loader } from '../../Loader'

interface Props {
    country: Country
    loading: boolean
    onLongPress: PointerEventHandler
    onLongPressCancel: PointerEventHandler
}

export const TableRowComponent: FunctionComponent<Props> = ({ country, loading, onLongPress, onLongPressCancel }) => {
    return (
        <tr
            data-code={country.code}
            onPointerDown={onLongPress}
            onPointerLeave={onLongPressCancel}
            onPointerUp={onLongPressCancel}
        >
            <td className='table__loader'>
                <Loader loading={loading} size='small' />
            </td>
            <td className='table__code'>{country.code}</td>
            <td className='table__flag'>
                <img src={country.flag} alt={country.code} />
            </td>

            <td className='table__name'>{country.name}</td>
            <td className='table__capital'>{country.capitalName}</td>
            <td className='table__population'>{country.population}</td>
            <td className='table__region'>{country.region}</td>
            <td className='table__subregion'>{country.subregion}</td>
        </tr>
    )
}

export const TableRow = React.memo(TableRowComponent)

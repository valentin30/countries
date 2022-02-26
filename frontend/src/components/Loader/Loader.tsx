import React, { FunctionComponent } from 'react'
import './Loader.scss'

interface Props {
    loading: boolean
    size?: 'tiny' | 'small' | 'big' | 'huge'
}

export const Loader: FunctionComponent<Props> = ({ size = 'regular', loading }) => {
    return (
        <div className={`tick-loader${loading ? ' loading' : ''} ${size}`}>
            <div className='tick-loader__tick'></div>
        </div>
    )
}

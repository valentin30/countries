import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import './Loader.scss'

interface Props {
    loading: boolean
    size?: 'tiny' | 'small' | 'big' | 'huge'
}

export const Loader: FunctionComponent<Props> = props => {
    return (
        <div>
            <div className={`tick-loader${props.loading ? ' loading' : ''} ${props.size ? props.size : 'regular'}`}>
                <div className='tick-loader__tick'></div>
            </div>
        </div>
    )
}

import React, { FunctionComponent } from 'react'
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from 'react-icons/md'
import { useLocation } from 'react-router'

interface Props {
    page: number
    count: number
    totalCount: number
    onBack: () => void
    onNext: () => void
}

export const Pager: FunctionComponent<Props> = props => {
    const from = props.count * (props.page - 1)
    const to = from + props.count > props.totalCount ? props.totalCount : from + props.count
    return (
        <div className='pager'>
            <p className='pager__info'>
                {from + 1} - {from + props.count} of {props.totalCount}
            </p>
            <button aria-label='Previous page' onClick={props.onBack} disabled={from === 0} className='pager__previous'>
                <MdOutlineArrowBackIosNew />
            </button>
            <button
                aria-label='Next page'
                onClick={props.onNext}
                disabled={to === props.totalCount}
                className='pager__next'
            >
                <MdOutlineArrowForwardIos />
            </button>
        </div>
    )
}

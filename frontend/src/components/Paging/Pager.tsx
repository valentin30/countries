import React, { FunctionComponent } from 'react'
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from 'react-icons/md'

interface Props {
    page: number
    count: number
    totalCount: number
    onBack: () => void
    onNext: () => void
}

export const Pager: FunctionComponent<Props> = props => {
    let from: number, to: number
    if (props.totalCount) {
        from = props.count * (props.page - 1)
        to = from + props.count > props.totalCount ? props.totalCount : from + props.count
        from++
    } else {
        from = 0
        to = 0
    }
    return (
        <div className='pager'>
            <p className='pager__info'>
                {from} - {to} of {props.totalCount}
            </p>
            <button
                aria-label='Previous page'
                onClick={props.onBack}
                disabled={!from || from === 1}
                className='pager__previous'
            >
                <MdOutlineArrowBackIosNew />
            </button>
            <button
                aria-label='Next page'
                onClick={props.onNext}
                disabled={!to || to === props.totalCount}
                className='pager__next'
            >
                <MdOutlineArrowForwardIos />
            </button>
        </div>
    )
}

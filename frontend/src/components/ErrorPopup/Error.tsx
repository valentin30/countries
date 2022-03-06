import React, { FunctionComponent, MouseEventHandler } from 'react'
import { HiOutlineEmojiSad } from 'react-icons/hi'

interface Props {
    error: boolean
    onClick: MouseEventHandler<HTMLButtonElement>
}

export const ErrorPopup: FunctionComponent<Props> = props => {
    if (!props.error) return null
    return (
        <>
            <div className='backdrop'></div>
            <div className='error'>
                <div className='error__header'>
                    <HiOutlineEmojiSad className='error__icon' />
                    <p className='error__title'>Oh Snap!</p>
                </div>
                <div className='error__body'>
                    <p className='error__description'>Oops, something went wrong. Please try again later.</p>
                    <button className='error__action' onClick={props.onClick}>
                        Refresh
                    </button>
                </div>
            </div>
        </>
    )
}

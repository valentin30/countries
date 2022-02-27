import React, { ChangeEventHandler, FunctionComponent } from 'react'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'

interface Props {
    options: number[]
    selected: number
    onChange: ChangeEventHandler<HTMLSelectElement>
}

export const PageSizer: FunctionComponent<Props> = props => {
    return (
        <div className='page-sizer'>
            <label className='page-sizer__info' htmlFor='page-size'>
                Rows on page:
            </label>
            <div className='page-sizer__select'>
                <select value={props.selected} onChange={props.onChange} name='page-size' id='page-size'>
                    {props.options.map(value => (
                        <option key={value} value={value}>
                            {value}
                        </option>
                    ))}
                </select>
                <MdOutlineKeyboardArrowDown className='page-sizer__icon' />
            </div>
        </div>
    )
}

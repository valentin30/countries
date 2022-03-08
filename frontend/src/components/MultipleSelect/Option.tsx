import React, { FunctionComponent } from 'react'
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md'

interface Props {
    checked: boolean
    name: string
    value: string
    disabled: boolean
    count: number
}

const onChange = () => {}

export const Option: FunctionComponent<Props> = props => {
    return (
        <div className={`filters__option${props.disabled ? ' disabled' : ''}`}>
            <input
                checked={props.checked}
                onChange={onChange}
                type='checkbox'
                name={props.name}
                value={props.value}
                id={props.value + props.name}
                disabled={props.disabled}
            />
            <MdCheckBox className='filters__icon checked' />
            <MdCheckBoxOutlineBlank className='filters__icon blank' />
            <label htmlFor={props.value + props.name}>
                <b>{props.value}</b> <span>[ {props.count ?? 0} ]</span>
            </label>
        </div>
    )
}

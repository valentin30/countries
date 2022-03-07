import React, { ChangeEventHandler, FormEventHandler, FunctionComponent } from 'react'
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md'
import { Map } from '../../utils/constants'
import { isMobile } from '../../utils/functions'

interface Props {
    name: string
    full: Map
    filtered: Map
    onChange: FormEventHandler<HTMLFieldSetElement>
    onClear: () => void
    value: string[]
}

const onChange = () => {}

export const MultipleSelect: FunctionComponent<Props> = props => {
    const name = props.name.toLowerCase()
    const id = `filter-${name}`

    return (
        <div className={`filters__${name}`}>
            <div className='filters__header'>
                <label className='filters__label' htmlFor={id}>
                    {props.name}
                </label>
                <button onClick={props.onClear} className='filters__clear'>
                    Clear all
                </button>
            </div>
            <fieldset onChange={props.onChange} className='filters__options' id={id}>
                {Object.keys(props.full).map(value => (
                    <div className={`filters__option${!props.filtered[value] ? ' disabled' : ''}`} key={value}>
                        <input
                            checked={props.value.includes(value)}
                            onChange={onChange}
                            type='checkbox'
                            name={name}
                            value={value}
                            id={value + name}
                            disabled={!props.filtered[value]}
                        />
                        <MdCheckBox className='filters__icon checked' />
                        <MdCheckBoxOutlineBlank className='filters__icon blank' />
                        <label htmlFor={value + name}>
                            <b>{value}</b> <span>[ {props.filtered[value] ?? 0} ]</span>
                        </label>
                    </div>
                ))}
            </fieldset>
        </div>
    )
}

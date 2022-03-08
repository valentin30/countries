import React, { FormEventHandler, FunctionComponent, MouseEventHandler } from 'react'
import { Map } from '../../utils/constants'
import { Option } from './Option'

interface Props {
    name: string
    full: Map
    filtered: Map
    onChange: FormEventHandler<HTMLFieldSetElement>
    onClear: MouseEventHandler<HTMLButtonElement>
    value: string[]
}

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
                    <Option
                        checked={props.value.includes(value)}
                        count={props.filtered[value]}
                        disabled={!props.filtered[value]}
                        name={props.name}
                        value={value}
                        key={value}
                    />
                ))}
            </fieldset>
        </div>
    )
}

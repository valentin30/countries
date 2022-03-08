import React, { ChangeEventHandler, FormEventHandler, FunctionComponent } from 'react'
import { Map } from '../../utils/constants'
import { MultipleSelect } from '../MultipleSelect'

interface Props {
    open: boolean

    onClose: () => void
    filterName: string
    onFilterNameChange: ChangeEventHandler<HTMLInputElement>

    selectedRegions: string[]
    fullRegions: Map
    filteredRegions: Map
    onRegionsClear: () => void
    onRegionsChange: FormEventHandler<HTMLFieldSetElement>

    selectedSubRegions: string[]
    fullSubRegions: Map
    filteredSubRegions: Map
    onSubRegionsClear: () => void
    onSubRegionsChange: FormEventHandler<HTMLFieldSetElement>
}

export const Filters: FunctionComponent<Props> = props => {
    if (!props.open) return null
    return (
        <>
            <div className='filters__helper' onClick={props.onClose} />
            <div className='filters__container'>
                <div className='filters__name'>
                    <label className='filters__label' htmlFor='filter-name'>
                        Name
                    </label>
                    <input
                        id='filter-name'
                        type='text'
                        name='filter name'
                        placeholder='Enter keyword to filter results'
                        value={props.filterName}
                        onChange={props.onFilterNameChange}
                    />
                </div>
                <MultipleSelect
                    value={props.selectedRegions}
                    onClear={props.onRegionsClear}
                    onChange={props.onRegionsChange}
                    name='Regions'
                    full={props.fullRegions}
                    filtered={props.filteredRegions}
                />
                <MultipleSelect
                    value={props.selectedSubRegions}
                    onClear={props.onSubRegionsClear}
                    onChange={props.onSubRegionsChange}
                    name='Subregions'
                    full={props.fullSubRegions}
                    filtered={props.filteredSubRegions}
                />
            </div>
        </>
    )
}

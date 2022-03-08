import React, { FunctionComponent } from 'react'
import { IoMdClose } from 'react-icons/io'
import { Country } from '../../dto/Country'

interface Props {
    country: Country
    onClose: () => void
}

export const Detail: FunctionComponent<Props> = props => {
    if (!props.country) return null
    return (
        <>
            <div onClick={props.onClose} className='backdrop'></div>
            <div className='detail-view'>
                <div className='detail-view__header'>
                    <h3 className='detail-view__title'>{props.country.name}</h3>
                    <span className='detail-view__subtitle'>#{props.country.code}</span>
                    <button onClick={props.onClose} className='detail-view__close-btn'>
                        <IoMdClose />
                    </button>
                </div>
                <img className='detail-view__image' src={props.country.flag} alt={props.country.code} />
                <ul className='detail-view__details'>
                    <li className='detail-view__list-item'>
                        <p className='detail-view__property-name'>Capital:</p>
                        <p className='detail-view__property-value'>{props.country.capitalName}</p>
                    </li>
                    <li className='detail-view__list-item'>
                        <p className='detail-view__property-name'>Population: </p>
                        <p className='detail-view__property-value'>{props.country.population}</p>
                    </li>
                    <li className='detail-view__list-item'>
                        <p className='detail-view__property-name'>Region: </p>
                        <p className='detail-view__property-value'>{props.country.region}</p>
                    </li>
                    <li className='detail-view__list-item'>
                        <p className='detail-view__property-name'>Subregion: </p>
                        <p className='detail-view__property-value'>{props.country.subregion}</p>
                    </li>
                </ul>
            </div>
        </>
    )
}

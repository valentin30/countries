import React, { ChangeEventHandler, FunctionComponent } from 'react'
import { QueryTypes, useQuery } from '../../hooks/useQuery'
import { PAGE_SIZES } from '../../utils/constants'
import { Pager, PageSizer } from '../Paging'

interface Props {
    totalCount: number
}

export const TableFooter: FunctionComponent<Props> = props => {
    const { totalCount } = props

    const [page, setPage] = useQuery<number>('page', QueryTypes.Number)
    const [size, setSize] = useQuery<number>('size', QueryTypes.Number)

    const sizeChangeHandler: ChangeEventHandler<HTMLSelectElement> = event => {
        const total = totalCount < size * page ? totalCount : size * page
        const newSize = +event.target.value
        const newPage = Math.floor(total / newSize) || 1
        setSize(newSize)
        setPage(newPage)
    }

    return (
        <div className='table__footer'>
            <div className='table__row'>
                <div className='paging'>
                    <PageSizer
                        selected={size}
                        options={PAGE_SIZES}
                        disabled={!props.totalCount}
                        onChange={sizeChangeHandler}
                    />
                    <Pager
                        page={page}
                        count={size}
                        totalCount={props.totalCount}
                        onBack={() => {
                            setPage(page - 1)
                        }}
                        onNext={() => {
                            setPage(page + 1)
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

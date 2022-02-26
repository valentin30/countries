export type Columns = {
    [key in TableColumns]?: boolean
}

export enum TableColumns {
    CODE = 'code',
    FLAG = 'flag',
    NAME = 'name',
    CAPITAL = 'capital',
    POPULATION = 'population',
    REGION = 'region',
    SUBREGION = 'subregion'
}

export const TableColumsArray = [
    TableColumns.CODE,
    TableColumns.FLAG,
    TableColumns.NAME,
    TableColumns.CAPITAL,
    TableColumns.POPULATION,
    TableColumns.REGION,
    TableColumns.SUBREGION
]

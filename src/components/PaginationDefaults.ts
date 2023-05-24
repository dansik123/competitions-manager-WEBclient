import type { LeagueSelectorPageQueryParam, PageQueryParams, PageQuerySortedParams, PaginationData } from "@/types/HttpResponseTypes";

export const paginationResponseDefault: PaginationData = {
    number: 0,
    paginationNumber: 1,
    first: true,
    last: true,
    totalElements: 1,
    totalPages: 1,
    size: 1,
    empty: false
}

export const paginationQuerySortedDefault: PageQuerySortedParams = {
    page: 0,
    size: 5,
    sort: 'name',
    direction: 'asc'
}

export const paginationQueryRequestDefault: PageQueryParams = {
    page: 0,
    size: 5
}

export const leagueQueryRequestDefaults: LeagueSelectorPageQueryParam = {
    page: paginationQueryRequestDefault.page,
    size: paginationQueryRequestDefault.size,
    gunType: ''
}
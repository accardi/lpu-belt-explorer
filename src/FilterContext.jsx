import React, {useCallback, useEffect, useMemo, useState} from 'react'
import queryString from 'query-string'

const FilterContext = React.createContext({})

export function FilterProvider({children}) {
    const [filters, setFilters] = useState(() => queryString.parse(location.search))

    const addFilter = useCallback((keyToAdd, valueToAdd, replace) => {
        const oldValue = filters[keyToAdd]

        let newValue
        if (replace) {
            newValue = valueToAdd
        } else {
            if (Array.isArray(oldValue)) {
                if (!oldValue.includes(valueToAdd)) {
                    newValue = [...oldValue, valueToAdd]
                } else {
                    newValue = oldValue
                }
            } else if (oldValue && oldValue !== valueToAdd) {
                newValue = [oldValue, valueToAdd]
            } else {
                newValue = valueToAdd
            }
        }

        const {id, ...keepFilters} = filters
        setFilters({...keepFilters, [keyToAdd]: newValue})
    }, [filters])

    const removeFilter = useCallback((keyToDelete, valueToDelete) => {
        const currentValue = filters[keyToDelete]

        if (Array.isArray(currentValue)) {
            const newValue = currentValue.filter(value => value !== valueToDelete)
            setFilters({...filters, [keyToDelete]: newValue})
        } else {
            const {[keyToDelete]: _, ...newValue} = filters
            setFilters(newValue)
        }
    }, [filters])

    const clearFilters = useCallback(searchToo => {
        const newValue = searchToo ? {} : {search: filters.search}
        setFilters(newValue)
    }, [filters])

    useEffect(() => {
        const query = queryString.stringify(filters)
        const newUrl = new URL(window.location.href)
        newUrl.search = query
        history.replaceState({path: newUrl.href}, '', newUrl.href)
    }, [filters])

    const filterCount = useMemo(() => {
        const {search, ...rest} = filters
        return Object.keys(rest).length
    }, [filters])

    const value = useMemo(() => ({
        filters,
        filterCount,
        addFilter,
        removeFilter,
        clearFilters
    }), [addFilter, clearFilters, filterCount, filters, removeFilter])

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    )
}

export default FilterContext

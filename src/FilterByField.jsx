import React, {useCallback, useContext, useDeferredValue, useMemo} from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import DataContext from './DataContext.jsx'
import FilterContext from './FilterContext.jsx'
import {Box} from '@mui/material'
import Chip from '@mui/material/Chip'

function FilterByField({label, fieldName, onFilter}) {
    const {visibleEntries} = useContext(DataContext)
    const {filters} = useContext(FilterContext)

    const handleSelect = useCallback(event => {
        onFilter(fieldName, event.target.value, true)
        setTimeout(() => document.activeElement.blur())
    }, [fieldName, onFilter])

    const handleBlur = useCallback(() => {
        setTimeout(() => document.activeElement.blur())
    }, [])

    const {counts, options} = useMemo(() => {
        const allValues = visibleEntries
            .map(datum => datum[fieldName])
            .flat()
            .filter(x => x)

        const counts = allValues.reduce((acc, val) => {
            if (!acc[val]) acc[val] = 0
            acc[val]++
            return acc
        }, {})

        const options = [...new Set(allValues)].sort()

        return {counts, options}
    }, [visibleEntries, fieldName])

    const defFilters = useDeferredValue(filters)
    const filterValue = defFilters[fieldName]
    const value = Array.isArray(filterValue)
        ? defFilters[fieldName]
        : (filterValue ? [filterValue] : [])

    return (
        <FormControl style={{minWidth: 120, maxWidth: 300, marginTop: 4}} fullWidth>
            <InputLabel id={`filter-${fieldName}`}>{label}</InputLabel>
            <Select
                multiple
                label={label}
                labelId={`filter-${fieldName}`}
                value={value}
                onChange={handleSelect}
                style={{marginBottom: 8}}
                onClose={handleBlur}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: ITEM_HEIGHT * 8 + ITEM_PADDING_TOP
                        }
                    }
                }}
                renderValue={selected =>
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                        {selected.map((value) => (
                            <Chip key={value} label={value}/>
                        ))}
                    </Box>
                }
            >
                {options.map((value, index) =>
                    <MenuItem key={index} value={value}>
                        {`${value} (${counts[value]})`}
                    </MenuItem>
                )}
            </Select>
        </FormControl>
    )
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

export default FilterByField

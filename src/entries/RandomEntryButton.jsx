import CasinoIcon from '@mui/icons-material/Casino'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, {useCallback, useContext} from 'react'
import AppContext from '../contexts/AppContext'
import LazyDataContext from '../contexts/LazyDataContext'

function RandomEntryButton() {
    const {data} = useContext(LazyDataContext)
    const {setTab, setExpanded} = useContext(AppContext)

    const handleClick = useCallback(() => {
        const index = Math.floor(Math.random() * data.length)
        const entry = data[index]
        setTab(entry.belt.replace(/\s\d/g, ''))
        setExpanded(entry.id)
    }, [setTab, setExpanded, data])

    return (
        <Tooltip title='Random Lock' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <CasinoIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default RandomEntryButton

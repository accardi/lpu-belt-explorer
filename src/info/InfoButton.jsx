import React, {useCallback, useState} from 'react'
import {Button, Tooltip} from '@mui/material'
import InfoDialog from './InfoDialog.jsx'
import IconButton from '@mui/material/IconButton'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

function InfoButton({icon}) {
    const [open, setOpen] = useState(false)
    const handleOpen = useCallback(() => setOpen(true), [])
    const handleClose = useCallback(() => setOpen(false), [])

    const button = icon
        ? (
            <IconButton color='inherit' onClick={handleOpen}>
                <InfoOutlinedIcon/>
            </IconButton>
        )
        : (
            <Button color='inherit' onClick={handleOpen}>
                Read more...
            </Button>
        )

    return (
        <React.Fragment>
            <Tooltip title='Information'>
                {button}
            </Tooltip>
            {
                open &&
                <InfoDialog
                    open={open}
                    onClose={handleClose}
                />
            }
        </React.Fragment>
    )
}

export default InfoButton
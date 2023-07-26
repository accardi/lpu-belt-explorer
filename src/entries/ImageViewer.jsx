import React, {useCallback, useState} from 'react'
import LaunchIcon from '@mui/icons-material/Launch'
import Stack from '@mui/material/Stack'
import DialogActions from '@mui/material/DialogActions'
import Fab from '@mui/material/Fab'
import LinearProgress from '@mui/material/LinearProgress'
import CloseIcon from '@mui/icons-material/Close'
import AppBar from '@mui/material/AppBar'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import {useHotkeys} from 'react-hotkeys-hook'
import {useSwipeable} from 'react-swipeable'
import licenses from '../data/licenses'
import Transition from '../util/Transition'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor'
import useWindowSize from '../util/useWindowSize'
import Tooltip from '@mui/material/Tooltip'

function ImageViewer({startIndex = 0, media, onClose}) {
    const [open, setOpen] = useState(true)
    const [loading, setLoading] = useState(true)
    const [{x: initX, y: initY}, setInitXY] = useState({x: 0, y: 0})
    const [{x: lastX, y: lastY}, setLastXY] = useState({x: 0, y: 0})
    const [{x, y}, setXY] = useState({x: 0, y: 0})
    const [zoom, setZoom] = useState(1)
    const [moving, setMoving] = useState(false)
    const [index, setIndex] = useState(startIndex)
    const {fullSizeUrl, thumbnailUrl, fullUrl, title, subtitle, subtitleUrl} = media[index]
    const {width} = useWindowSize()
    const isMobile = width <= 500

    const handleLoaded = useCallback(() => setLoading(false), [])
    const handleClose = useCallback(() => {
        setOpen(false)
        setTimeout(() => onClose(), 200)
    }, [onClose])

    const handleZoomIn = useCallback(() => setZoom(zoom + zoomIncrement), [zoom])
    const handleZoomOut = useCallback(() => setZoom(Math.max(zoom - zoomIncrement, 1)), [zoom])
    const handleReset = useCallback(() => {
        setXY({x: 0, y: 0})
        setInitXY({x: 0, y: 0})
        setLastXY({x: 0, y: 0})
        setZoom(1)
    }, [])

    const handleNavigatePrevious = useCallback(() => {
        const nextIndex = index === 0 ? media.length - 1 : index - 1
        setIndex(nextIndex)
        handleReset()
        setLoading(true)
    }, [index, media, handleReset])
    const handleNavigateNext = useCallback(() => {
        const nextIndex = index === media.length - 1 ? 0 : index + 1
        setIndex(nextIndex)
        handleReset()
        setLoading(true)
    }, [index, media, handleReset])

    const handleMoveStart = useCallback(event => {
        if (zoom !== 1) {
            setMoving(true)
            const xy = getCurrentPosition(event)
            const initXY = {
                x: xy.x - lastX, y: xy.y - lastY
            }
            setInitXY(initXY)
        }
    }, [lastX, lastY, zoom])
    const handleMoveDuring = useCallback(event => {
        if (moving) {
            const xy = getCurrentPosition(event)
            const lastXY = {
                x: xy.x - initX, y: xy.y - initY
            }
            setLastXY(lastXY)
            setXY(lastXY)
        }
    }, [moving, initX, initY])
    const handleMoveEnd = useCallback(() => {
        setMoving(false)
    }, [])

    // Keyboard / swipe navigation
    useHotkeys('left', handleNavigatePrevious, {preventDefault: true})
    useHotkeys('right', handleNavigateNext, {preventDefault: true})
    useHotkeys('up', handleZoomIn, {preventDefault: true})
    useHotkeys('down', handleZoomOut, {preventDefault: true})
    const swipeHandlers = useSwipeable({
        onSwipedLeft: handleNavigatePrevious, onSwipedRight: handleNavigateNext,
        swipeDuration: 250
    })

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            fullScreen
            PaperProps={{
                onClick: handleClose
            }}
        >
            <AppBar sx={{position: 'relative'}}>
                <Toolbar>
                    <IconButton
                        edge='start'
                        color='inherit'
                        onClick={handleClose}
                        aria-label='close'
                    >
                        <CloseIcon/>
                    </IconButton>

                    <Stack direction='column' sx={{marginLeft: 2, width: '100%'}}>
                        <Typography variant='subtitle1' component='div'>
                            {title}
                        </Typography>
                        <Typography variant='subtitle2' component='div' style={{color: '#777'}}>
                            <a href={subtitleUrl || licenses[subtitle]} target='_blank' rel='noopener noreferrer'>
                                {subtitle}
                            </a>
                        </Typography>
                    </Stack>
                    <Tooltip title='View Full Size' arrow disableFocusListener>
                        <IconButton
                            href={fullUrl}
                            style={{color: 'rgba(255, 255, 255, 0.5)'}}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <LaunchIcon/>
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>

            {loading && <LinearProgress color='secondary'/>}

            {
                !isMobile && media.length > 1 &&
                <React.Fragment>
                    <Tooltip title='Previous Image' arrow disableFocusListener>
                        <Fab
                            onClick={handleNavigatePrevious}
                            sx={{
                                position: 'fixed', left: 16, top: '50vh', zIndex: 1000
                            }}>
                            <ArrowBackIcon/>
                        </Fab>
                    </Tooltip>

                    <Tooltip title='Next Image' arrow disableFocusListener>
                        <Fab
                            onClick={handleNavigateNext}
                            sx={{
                                position: 'fixed', right: 16, top: '50vh', zIndex: 1000
                            }}>
                            <ArrowForwardIcon/>
                        </Fab>
                    </Tooltip>
                </React.Fragment>
            }

            <DialogContent style={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                overflow: 'hidden'
            }}>
                <img
                    draggable={false}
                    style={{
                        transform: `translate3d(${x}px, ${y}px, 0px) scale(${zoom})`,
                        cursor: zoom > 1 ? 'grab' : 'unset',
                        transition: moving ? 'none' : 'all 0.1s',
                        maxWidth: 'calc(100vw - 64px)',
                        maxHeight: 'calc(100vh - 160px)',
                        backgroundSize: 50,
                        transformOrigin: 'center center'

                    }}
                    onLoad={handleLoaded}

                    onTouchStart={handleMoveStart}
                    onMouseDown={handleMoveStart}
                    onTouchMove={handleMoveDuring}
                    onMouseMove={handleMoveDuring}
                    onTouchEnd={handleMoveEnd}
                    onMouseUp={handleMoveEnd}
                    onMouseLeave={handleMoveEnd}

                    {...swipeHandlers}

                    title={title}
                    src={fullSizeUrl || thumbnailUrl}
                    alt={title}
                />
            </DialogContent>
            <DialogActions
                sx={{
                    maxHeight: 64,
                    display: 'flex',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                {
                    isMobile && media.length > 0 &&
                    <Tooltip title='Previous Image' arrow disableFocusListener>
                        <IconButton
                            color='inherit'
                            onClick={handleNavigatePrevious}
                            aria-label='previousImage'
                        >
                            <ArrowBackIcon/>
                        </IconButton>
                    </Tooltip>
                }
                <Tooltip title='Zoom In' arrow disableFocusListener>
                    <IconButton
                        color='inherit'
                        onClick={handleZoomIn}
                        aria-label='zoomIn'
                    >
                        <ZoomInIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title='Reset Zoom' arrow disableFocusListener>
                <span>
                    <IconButton
                        color='inherit'
                        onClick={handleReset}
                        aria-label='reset'
                        disabled={zoom === 1 && x === 0 && y === 0}
                    >
                        <YoutubeSearchedForIcon/>
                    </IconButton>
                </span>
                </Tooltip>
                <Tooltip title='Zoom Out' arrow disableFocusListener>
                <span>
                    <IconButton
                        color='inherit'
                        onClick={handleZoomOut}
                        aria-label='zoomOut'
                        disabled={zoom === 1}
                    >
                        <ZoomOutIcon/>
                    </IconButton>
                </span>
                </Tooltip>
                {
                    isMobile && media.length > 0 &&
                    <Tooltip title='Next Image' arrow disableFocusListener>
                        <IconButton
                            color='inherit'
                            onClick={handleNavigateNext}
                            aria-label='nextImage'
                        >
                            <ArrowForwardIcon/>
                        </IconButton>
                    </Tooltip>
                }
            </DialogActions>
        </Dialog>)
}

const getCurrentPosition = event => {
    if (event.touches && event.touches.length) {
        return {x: event.touches[0].pageX, y: event.touches[0].pageY}
    } else {
        return {x: event.pageX, y: event.pageY}
    }
}

const zoomIncrement = 0.4

export default ImageViewer

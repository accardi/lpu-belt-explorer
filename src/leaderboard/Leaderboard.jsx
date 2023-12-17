import React, {useContext} from 'react'
import LeaderboardContext from '../contexts/LeaderboardContext.jsx'
import AuthContext from '../contexts/AuthContext.jsx'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import LockIcon from '@mui/icons-material/Lock'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined'
import dayjs from "dayjs";


function Leaderboard(index) {

    const {leaderboardData = []} = useContext(LeaderboardContext)

    const {user} = useContext(AuthContext)

    const currentID = user?.uid

    const updateTime = dayjs(leaderboardData?.[0]?.DateTime).format('MM/DD/YY hh:mm')

    function TextStyle(DisplayName, id) {

        let tcWeight =  400
        let tcColor = '#fff'

        tcColor = (DisplayName !== 'Anonymous' ? '#fff' : '#ccc')

        if (id === currentID) {
            tcWeight =  500
            tcColor = '#4db013'
        }

        return {
            fontWeight: tcWeight,
            color: tcColor
        }
    }

    /*  "id": "UbhgAjZIuLauV1dw2G4QsocHIk83",
        "DisplayName": "Georgia Jim",
        "DateTime": "2023-12-15T20:28:42",
        "position": 1,
        "own": 233,
        "picked": 255,
        "recorded": 240,
        "wishlist": 0      */

    return (
        <React.Fragment>
            <div style={{
                padding: '8px', fontSize: '0.8rem', textAlign: 'right', color: '#ccc',
                maxWidth: 700, backgroundColor: '#111', marginLeft: 'auto', marginRight: 'auto'
            }}/>

            <div style={{
                maxWidth: 700, padding: '8px 8px 16px 8px', backgroundColor: '#000',
                marginLeft: 'auto', marginRight: 'auto'
            }}>
                <TableContainer sx={{borderRadius: 0, overflowY: 'scroll', backgroundColor: '#111'}}>
                    <Table sx={{borderRadius: 0}}
                           aria-label="simple table">
                        <TableHead>
                            <TableRow sx={{backgroundColor: '#000',}}>
                                <TableCell align={'center'} style={{border: 0, padding: '4px 12px'}}>#</TableCell>
                                <TableCell key='Display Name'
                                           style={{
                                               fontWeight: 700, fontSize: '1.2rem', border: 0,
                                               padding: '4px 16px 4px 0px'
                                           }}
                                >Name</TableCell>
                                <TableCell align={'center'}
                                           style={{border: 0, padding: '4px 12px'}}><LockIcon/></TableCell>
                                <TableCell align={'center'}
                                           style={{border: 0, padding: '4px 12px'}}><LockOpenOutlinedIcon/></TableCell>
                                <TableCell align={'center'}
                                           style={{border: 0, padding: '4px 12px'}}><VideocamOutlinedIcon/></TableCell>
                                <TableCell align={'center'}
                                           style={{border: 0, padding: '4px 12px'}}><SavingsOutlinedIcon/></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {leaderboardData.map((leader) => (
                                <TableRow
                                    key={leader.id}
                                    sx={{
                                        '&:nth-of-type(even) td, &:nth-of-type(even) th': {backgroundColor: '#000'},
                                        'td, th': {padding: '6px 2px', border: 0}
                                    }}
                                >
                                    <TableCell align={'center'}
                                               sx={{
                                                   fontWeight: 500,
                                                   color: (leader.DisplayName !== 'Anonymous' ? '#fff' : '#bbb')
                                               }}
                                               style={TextStyle(leader.DisplayName, leader.id)}
                                    >{leader.position}</TableCell>
                                    <TableCell component="th" scope="row"
                                               sx={{
                                                   fontWeight: (leader.DisplayName !== 'Anonymous' ? 500 : null),
                                                   color: (leader.DisplayName !== 'Anonymous' ? '#fff' : '#ccc')
                                               }}
                                               style={TextStyle(leader.DisplayName, leader.id)}
                                    >{(leader.id !== currentID ? leader.DisplayName : 'ME!')}
                                    </TableCell>
                                    <TableCell align={'center'}
                                               sx={{color: (leader.DisplayName !== 'Anonymous' ? '#fff' : '#ccc')}}
                                               style={TextStyle(leader.DisplayName, leader.id)}
                                    >{leader.own}</TableCell>
                                    <TableCell align={'center'}
                                               sx={{
                                                   color: (leader.DisplayName !== 'Anonymous' ? '#fff' : '#ccc'),
                                               }}
                                               style={TextStyle(leader.DisplayName, leader.id)}
                                    >{leader.picked}</TableCell>
                                    <TableCell align={'center'}
                                               sx={{
                                                   color: (leader.DisplayName !== 'Anonymous' ? '#fff' : '#ccc'),
                                               }}
                                               style={TextStyle(leader.DisplayName, leader.id)}
                                    >{leader.recorded}</TableCell>
                                    <TableCell align={'center'}
                                               sx={{
                                                   color: (leader.DisplayName !== 'Anonymous' ? '#fff' : '#ccc'),
                                               }}
                                               style={TextStyle(leader.DisplayName, leader.id)}
                                    >{leader.wishlist}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div style={{
                padding: '8px 12px 24px 8px', fontSize: '0.8rem', textAlign: 'right', color: '#ccc',
                maxWidth: 700, backgroundColor: '#111', marginLeft: 'auto', marginRight: 'auto'
            }}>
                Last updated: {updateTime} GMT
            </div>

        </React.Fragment>
    )
}

export default React.memo(Leaderboard)

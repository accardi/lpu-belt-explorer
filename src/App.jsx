import React, {useEffect, useState} from 'react'
import Entries from './Entries.jsx'
import Nav from './Nav.jsx'
import {FilterProvider} from './FilterContext.jsx'
import {StorageProvider} from './StorageContext.jsx'

function App() {
    const [tab, setTab] = useState(() => {
        return location.search.length > 0 ? 'search' : 'white'
    })
    const handleChangeTab = newBelt => setTab(newBelt)

    const [data, setData] = useState([])
    useEffect(() => {
        if (!data.length) {
            const loadData = async () => {
                const {default: value} = (await import('./data/data.js'))
                setData(value)
            }
            loadData()
        }
    }, [data])

    return (
        <StorageProvider>
            <FilterProvider>
                <Nav
                    data={data}
                    tab={tab}
                    onChangeTab={handleChangeTab}
                />

                <Entries
                    tab={tab}
                    data={data}
                    onChangeTab={handleChangeTab}
                />
            </FilterProvider>
        </StorageProvider>
    )
}


export default App

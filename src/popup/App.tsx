import { useEffect, useState, useCallback } from 'react'
import './App.css'
import { Bookmark } from '../types'
import { SearchInput } from './components/SearchInput'
import { BookmarkList } from './components/BookmarkList'
import { Loading } from './components/Loading'

import { Switch } from '@headlessui/react'

function App() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [isFastSearch, setIsFastSearch] = useState<boolean>(true)

  const search = useCallback(async (searchText: string) => {
    if (!searchText) {
      setBookmarks([])
      return
    }
    const startTime = Date.now()
    setLoading(true)
    const bookmark_list = await chrome.runtime.sendMessage({ action: 'search', searchText, isFastSearch })
    
    // to avoid sudden UI jumps
    setTimeout(() => {
      setLoading(false)  
    }, Date.now() - startTime < 300 ? 300 : 0);
    setBookmarks(bookmark_list)
  }, [isFastSearch])

  useEffect(() => {
    const listener = (message: any) => {
      console.log("Received message: ", message)
    }

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [])

  return (
    <div className="flex flex-col min-w-80 min-h-40 max-w-80 py-4 px-4">
      <SearchInput onSearch={search} />

      <div className="flex flex-row items-center justify-center mt-2">
        <p>Speed</p>
        <Switch
          checked={isFastSearch}
          onChange={setIsFastSearch}
          className={`${
            isFastSearch ? 'bg-yellow-300' : 'bg-blue-300'
          } flex h-4 w-8 items-center rounded-full mx-1`}
        >
          <span
            className={`${
              isFastSearch ? 'translate-x-1' : 'translate-x-4'
            } inline-block h-3 w-3 transform rounded-full bg-white transition`}
          />
        </Switch>
        <span>Accuracy</span>
      </div>
      
      {loading ? (
        <div className='flex grow justify-center items-center'>
          <Loading size={32} />
        </div>
      ) 
      : <BookmarkList bookmarks={bookmarks} />
      }
    </div>
  )
}

export default App

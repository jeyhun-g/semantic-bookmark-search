import { useEffect, useState, useCallback } from 'react'
import './App.css'
import { Bookmark } from '../types'
import { SearchInput } from './components/SearchInput'
import { BookmarkList } from './components/BookmarkList'
import { Loading } from './components/Loading'

function App() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const search = useCallback(async (searchText: string) => {
    if (!searchText) {
      setBookmarks([])
      return
    }
    setLoading(true)
    const bookmark_list = await chrome.runtime.sendMessage({ action: 'search', searchText })
    setLoading(false)
    setBookmarks(bookmark_list)
  }, [])

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

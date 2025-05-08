import { useEffect, useState, useCallback } from 'react'
import './App.css'
import { Bookmark } from '../types'
import { SearchInput } from './components/SearchInput'
import { BookmarkCard } from './components/BookmarkCard'

function App() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])

  const search = useCallback(async (searchText: string) => {
    if (!searchText) {
      setBookmarks([])
      return
    }

    const bookmark_list = await chrome.runtime.sendMessage({ action: 'search', searchText })
    console.log(bookmark_list)
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
    <div className="min-w-80 min-h-40 max-w-80 py-4 px-4">
      <SearchInput onSearch={search} />

      {bookmarks?.length > 0 ? bookmarks.map((b) => (
        <BookmarkCard bookmark={b} />
      )) : <p>Not filtered yet</p>}
    </div>
  )
}

export default App

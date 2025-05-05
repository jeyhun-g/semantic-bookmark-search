import { useEffect, useState } from 'react'
import './App.css'
import { Bookmark } from '../types'

function App() {
  const [searchText, setSearchText] = useState<string>("")
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])

  const searchBookmarks = async () => {
    const bookmark_list = await chrome.runtime.sendMessage({ action: 'search', searchText })
    console.log(bookmark_list)
    setBookmarks(bookmark_list)
  }

  useEffect(() => {
    const listener = (message: any) => {
      console.log("Received message: ", message)
    }

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [])

  return (
    <>
      <h1>Vite + React</h1>
      <input value={searchText} onChange={(e) => {
        setSearchText(e.target.value)
      }} />
      
      <button onClick={searchBookmarks}>
        Search
      </button>

      {bookmarks?.length > 0 ? bookmarks.map((b) => (
        <div>{b.title}</div>
      )) : <p>Not filtered yet</p>}
    </>
  )
}

export default App

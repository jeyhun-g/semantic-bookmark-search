
import { useState, useEffect, useCallback } from 'react'
import { Bookmark } from '../../types'
import { SearchInput } from '../components/SearchInput'
import { BookmarkList } from '../components/BookmarkList'
import { Loading } from '../components/Loading'

import { Switch } from '@headlessui/react'
import { Pages, useAppContext } from '../appContext'

function SearchPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[] | null>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [isFastSearch, setIsFastSearch] = useState<boolean>(true)
  const { navigateTo, searchText, setSearchText } = useAppContext()

  useEffect(() => {
    async function effect() {
      if (!searchText) {
        setBookmarks(null)
        return
      }
      const startTime = Date.now()
      setLoading(true)
      const bookmark_list = await chrome.runtime.sendMessage({ action: 'search', searchText, isFastSearch })
      
      // to avoid sudden UI jumps
      setTimeout(() => {
        setLoading(false)  
        setBookmarks(bookmark_list)
      }, Date.now() - startTime < 300 ? 300 : 0);

      return bookmark_list
    }

    effect()
  }, [searchText, isFastSearch])

  return (
    <div className="flex flex-col min-w-80 min-h-80 max-w-80 py-4 px-4">
      <p className="my-2 text-center text-xl">BookmarkIQ</p>
      
      <SearchInput searchText={searchText} onSearch={setSearchText} />

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
      ) : (
        <>
          {!bookmarks && !loading && (
            <div className='flex flex-col grow justify-center items-center'>
              <button className="px-4 py-1 rounded border border-gray-300 hover:bg-gray-100" onClick={() => navigateTo(Pages.EXPLORE)}>Explore</button>
            </div>
          )}

          {bookmarks && <BookmarkList bookmarks={bookmarks} />}
        </>
      )}
      
      
    </div>
  )
}

export default SearchPage

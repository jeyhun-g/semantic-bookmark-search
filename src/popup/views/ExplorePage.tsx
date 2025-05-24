import { useState, useEffect } from 'react'
import { Bookmark } from '../../types'
import { Loading } from '../components/Loading'
import { Pages, useAppContext } from '../appContext'
import { KeywordCard } from '../components/KeywordCard'


function ExplorePage() {
  const [keywords, setKeywords] = useState<string[] | null>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { setSearchText, navigateTo } = useAppContext()
  
  useEffect(() => {
    async function effect() {
      const startTime = Date.now()
      setLoading(true)
      const bookmark_list = await chrome.runtime.sendMessage({ action: 'get_bookmarks' }) as Bookmark[]
      const keywords = Array.from(bookmark_list.reduce((all, curr) => {
        curr.keywords.forEach(k => all.add(k))
        return all
      }, new Set<string>()))

      keywords.sort((a, b) => {
        if (a > b) {
          return 1
        } else if (a < b) {
          return -1
        }

        return 0
      })
      
      // to avoid sudden UI jumps
      setTimeout(() => {
        setLoading(false)
        setKeywords(keywords)
      }, Date.now() - startTime < 300 ? 300 : 0);
    }
    effect()
  }, [])

  return (
    <div className="flex flex-col min-w-80 min-h-40 max-w-80 py-4 px-4">
      <p className="text-center text-lg">Explore Keywords</p>
      {loading && <Loading size={24} />}
      {!keywords && <>No boomarks found</>}
      {keywords && keywords.map(k => (
        <div key={k}>
          <KeywordCard keyword={k} onClick={() => {
            setSearchText(k)
            navigateTo(Pages.SEARCH)
          }} />
        </div>
      ))}
    </div>
  )
}

export default ExplorePage

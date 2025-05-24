import { Pages, useAppContext } from './appContext'
import ExplorePage from './views/ExplorePage'
import SearchPage from './views/SearchPage'

function App() {
  const { currentPage } = useAppContext()

  switch (currentPage) {
    case Pages.SEARCH:
      return <SearchPage />
    case Pages.EXPLORE:
      return <ExplorePage />
    default:
      return <SearchPage />
  }
}

export default App

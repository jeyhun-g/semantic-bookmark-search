import { BookmarksManager } from './managers'
import { accurateSearch, fastSearch } from './Search';
import { Bookmark } from './types';

const bookmarkManager = new BookmarksManager()
bookmarkManager.registerListeners()

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.action === 'search') {
    (async function func() {
      const searchText: string = message.searchText.toLowerCase();
      const isFastSearch: boolean = message.isFastSearch
      let results: Bookmark[] = []
      console.log("isFastSearch: ", isFastSearch)
      if (isFastSearch) {
        results = await fastSearch(searchText, bookmarkManager)
      } else {
        results = await accurateSearch(searchText, bookmarkManager)
      }

      sendResponse(results)
    })()
  }

  return true
});

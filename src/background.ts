import { BookmarksManager } from './managers'
import { accurateSearch, fastSearch } from './search';
import { Bookmark } from './types';

const bookmarkManager = new BookmarksManager()
bookmarkManager.registerListeners()

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  switch(message.action) {
    case 'search':
      (async function func() {
        const searchText: string = message.searchText.toLowerCase();
        const isFastSearch: boolean = message.isFastSearch
        let results: Bookmark[] = []
        if (isFastSearch) {
          results = await fastSearch(searchText, bookmarkManager)
        } else {
          results = await accurateSearch(searchText, bookmarkManager)
        }

        sendResponse(results)
      })()
      break;
    case 'get_bookmarks':
      (async function func() {
        const bookmarks = await bookmarkManager.getBookmarksAsList();
        sendResponse(bookmarks)
      })()
  }

  return true
});

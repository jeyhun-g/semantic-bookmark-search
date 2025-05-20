import { BookmarksManager, EmbedderSingleton } from './managers'
import similarity from "compute-cosine-similarity";
import { Bookmark } from './types';

const SIMILARITY_THRESHOLD = 0.2
const bookmarkManager = new BookmarksManager()
bookmarkManager.registerListeners()

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.action === 'search') {
      (async function func() {
        const searchText = message.searchText.toLowerCase();
        const embedder = await EmbedderSingleton.getInstance()
        const bookmarks = await bookmarkManager.getBookmarksAsList();
        let embeddings: any[] = await embedder.getEmbeddings(
          bookmarks
          .map((b) => b.title.toLowerCase())
          .filter((t) => !!t.trim())
        );
        
        const searchEmbedding = await embedder.getEmbeddings(searchText);
        
        let results: [Bookmark, number][] = []
    
        for (let i = 0; i < embeddings.length; i++) {
          const bookmark = bookmarks[i]
          let s: number;
          if (
            bookmark.title.toLowerCase().includes(searchText)
          ) {
             s = 1.0; 
          } else {
            s = similarity(searchEmbedding[0], embeddings[i]) || -1
          }
          results.push([bookmark, s])
        }
        console.log(results)
        
        results = results.sort((a, b) => {
          return a[1] < b[1] ? 1 : a[1] === b[1] ? 0 : -1
        })
  
        const top10 = results.slice(0, 10).filter(r => r[1] > SIMILARITY_THRESHOLD).map(r => r[0])
  
        sendResponse(top10)
      })()
    }

    return true
});

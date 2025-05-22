import { BookmarksManager, EmbedderSingleton } from "./managers";
import similarity from "compute-cosine-similarity";
import { Bookmark } from "./types";

const SIMILARITY_THRESHOLD = 0.2

export const getNgrams = (text: string, n: number = 3): string[] => {
  const tokens = text.split(/\s+/).filter(Boolean);

  if (tokens.length < n) {
    return [text]
  }

  const ngramList: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    const ngram = tokens.slice(i, i + n).join(' ');
    ngramList.push(ngram);
  }

  return ngramList;
};


export const fastSearch = async (searchText: string, bookmarkManager: BookmarksManager) => {
  const embedder = await EmbedderSingleton.getInstance()
  const bookmarks = await bookmarkManager.getBookmarksAsList();
  let embeddings: any[] = await embedder.getEmbeddings(
    bookmarks
    .map((b) => b.title.toLowerCase())
    .filter((t) => !!t.trim())
  );
  
  const searchEmbedding = await embedder.getEmbeddings([searchText]);
  
  let results: [Bookmark, number][] = []

  for (let i = 0; i < embeddings.length; i++) {
    const bookmark = bookmarks[i]
    let s: number;
    if (bookmark.title.toLowerCase().includes(searchText)) {
      s = 1.0; 
    } else {
      s = similarity(searchEmbedding[0], embeddings[i]) || -1
    }
    results.push([bookmark, s])
  }
  results = results.sort((a, b) => {
    return a[1] < b[1] ? 1 : a[1] === b[1] ? 0 : -1
  })

  return results.slice(0, 10).filter(r => r[1] > SIMILARITY_THRESHOLD).map(r => r[0])
}

export const accurateSearch = async (searchText: string, bookmarkManager: BookmarksManager) => {
  const embedder = await EmbedderSingleton.getInstance()
  const bookmarks = await bookmarkManager.getBookmarksAsList();
  const ngramTexts = bookmarks.map(b => ({ bookmark: b, ngrams: getNgrams(b.title.toLocaleLowerCase()) }))
  const searchEmbedding = await embedder.getEmbeddings([searchText]);
    
  let results: [Bookmark, number][] = []


  for (let i = 0; i < ngramTexts.length; i++) {
    const bookmark = ngramTexts[i].bookmark

    if (bookmark.title.toLowerCase().includes(searchText)) {
      results.push([bookmark, 1.0])
      continue
    }

    const texts = ngramTexts[i].ngrams.filter((t) => !!t.trim())
    let embeddings: any[] = await embedder.getEmbeddings(texts)

    let s: number = Number.NEGATIVE_INFINITY;
    for (const embedding of embeddings) {
      const newSimilarity = similarity(searchEmbedding[0], embedding) || -1
      if (newSimilarity > s) {
        s = newSimilarity;
      }
    }
  
    results.push([bookmark, s])
  }

  results = results.sort((a, b) => {
    return a[1] < b[1] ? 1 : a[1] === b[1] ? 0 : -1
  })

  return results.slice(0, 10).filter(r => r[1] > SIMILARITY_THRESHOLD).map(r => r[0])
}
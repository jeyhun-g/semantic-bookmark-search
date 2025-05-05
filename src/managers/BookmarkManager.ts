import { Bookmark } from '../types'

export class BookmarksManager {
  private bookmarks: Bookmark[]
  private loaded: boolean

  constructor() {
    this.bookmarks = []
    this.loaded = false
  }

  async getBookmarks() {
    if (!this.loaded) {
      this.loaded = true
      await this.readBookmarks()
    }

    return this.bookmarks
  }

  async readBookmarks() {
    const bookmarkTree = await chrome.bookmarks.getTree()
    const bookmarks: any[] = []
    
    const nodes = bookmarkTree
    while(nodes.length > 0) {
      const node = bookmarkTree.pop()
      if (node?.children) {
        nodes.push(...node.children)
        continue
      }

      if (node?.url && node.dateAdded) {
        bookmarks.push({
          title: node.title,
          url: node.url,
          createdAt: node.dateAdded
        })
      }
    }

    this.bookmarks = bookmarks
  }

}
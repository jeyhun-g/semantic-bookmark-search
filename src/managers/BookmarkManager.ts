import { Bookmark } from '../types'

interface BookmarkNodeTreeWrapper {
  treeNode: chrome.bookmarks.BookmarkTreeNode
  path: string[]
}

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
    const bookmarks: Bookmark[] = []
    
    const nodes: BookmarkNodeTreeWrapper[] = bookmarkTree.map(n => ({
      treeNode: n,
      path: []
    }))

    while(nodes.length > 0) {
      const node = nodes.pop()
      if (!node) break;

      const { treeNode, path } = node

        if (treeNode?.children) {
          nodes.push(...treeNode.children.map<BookmarkNodeTreeWrapper>((c) => ({
              treeNode: c,
              path: [...path, c.title]
            })
          ))
          continue
        }
  
        if (treeNode?.url && treeNode.dateAdded) {
          bookmarks.push({
            title: treeNode.title,
            url: treeNode.url,
            createdAt: treeNode.dateAdded,
            folders: path
          })
        }
    }

    this.bookmarks = bookmarks
  }

}
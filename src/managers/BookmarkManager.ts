import { Bookmark, BookmarkChangeInfo, BookmarkMovedInfo } from '../types'
import { extractKeywords } from '../Keywords'

interface BookmarkNodeTreeWrapper {
  treeNode: chrome.bookmarks.BookmarkTreeNode
  path: string[]
}

export class BookmarksManager {
  private bookmarks: Record<string, Bookmark>
  private loaded: boolean

  constructor() {
    this.bookmarks = {}
    this.loaded = false
  }

  async getBookmarksAsList(): Promise<Bookmark[]> {
    if (!this.loaded) {
      this.loaded = true
      await this.readBookmarks()
    }

    return Object.values(this.bookmarks)
  }

  async readBookmarks() {
    const bookmarkTree = await chrome.bookmarks.getTree()
    
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
        this.bookmarks[treeNode.id] = {
          title: treeNode.title,
          url: treeNode.url,
          createdAt: treeNode.dateAdded,
          folders: path,
          keywords: extractKeywords(treeNode.title)
        }
      }
    }
  }

  registerListeners() {
    chrome.bookmarks.onCreated.addListener(this.onCreated.bind(this))
    chrome.bookmarks.onRemoved.addListener(this.onRemoved.bind(this))
    chrome.bookmarks.onChanged.addListener(this.onChanged.bind(this))
    chrome.bookmarks.onMoved.addListener(this.onMoved.bind(this))
  }

  private async onCreated(id: string, bookmark: chrome.bookmarks.BookmarkTreeNode) {
    if (bookmark?.url && bookmark.dateAdded) {
      const path = await this.buildPath(bookmark.parentId)

      this.bookmarks[id] = {
        title: bookmark.title,
        url: bookmark.url,
        createdAt: bookmark.dateAdded,
        folders: path,
        keywords: extractKeywords(bookmark.title)
      }
    }
  }

  private onRemoved(id: string) {
    delete this.bookmarks[id]
  }

  private onChanged(id: string, changeInfo: BookmarkChangeInfo) {
    if (this.bookmarks[id]) {
      if (changeInfo.url) {
        this.bookmarks[id].url = changeInfo.url
      }

      this.bookmarks[id].title = changeInfo.title
    }
  }

  private async onMoved(id: string, modeInfo: BookmarkMovedInfo) {
    const path = await this.buildPath(modeInfo.parentId)
    if (this.bookmarks[id]){
      this.bookmarks[id].folders = path
    }
  }

  private async buildPath(parentId?: string) {
    const parentNodes = []
    let parentNode = await this.getParentNode(parentId);
    while (parentNode != null) {
      parentNodes.push(parentNode)
      parentNode = await this.getParentNode(parentNode.parentId);
    }
    return parentNodes.reverse().map(n => n.title).filter(t => !!t)
  }

  private async getParentNode(id?: string): Promise<chrome.bookmarks.BookmarkTreeNode | null> {
    if (!id) {
      return null;
    }
    const nodes = await chrome.bookmarks.get(id)
    return nodes.find(n => n.id === id) ?? null
  }
}
import { Plugin } from 'vite'

interface RenameFilesPluginOptions {
  filenames: Record<string, string>
}

export default function renameFiles({ filenames }: RenameFilesPluginOptions): Plugin {
  return {
    name: 'rename',
    enforce: 'post',
    generateBundle(_: unknown, bundle: any) {
      Object.entries(filenames).forEach(([oldName, newName]) => {
        bundle[oldName].fileName = bundle[oldName].fileName.replace(oldName, newName)
      })
    }
  }
}
const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

config.watchFolders = [workspaceRoot]

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

// Force all react/react-dom imports to mobile's React 18 copy.
// Root node_modules has React 19 (from web app) which causes
// "multiple React copies" crash when Metro bundles packages from root.
// resolveRequest intercepts before any path-walking can find React 19.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === 'react' ||
    moduleName === 'react-dom' ||
    moduleName.startsWith('react/') ||
    moduleName.startsWith('react-dom/')
  ) {
    const resolved = require.resolve(moduleName, {
      paths: [path.resolve(projectRoot, 'node_modules')],
    })
    return { filePath: resolved, type: 'sourceFile' }
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config

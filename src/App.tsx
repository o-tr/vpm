import './App.css'
import { useManifests } from './hooks/useManifests'

function App() {
  const manifests = useManifests();

  if (!manifests) {
    return <div>Loading...</div>
  }

  return (
    <>
      <a href={`vcc://vpm/addRepo?url=${manifests.url}`}>Add to VCC</a>
      <h1>ootr's vpm repository</h1>
      {Object.entries(manifests.packages).map(([packageName, packageItem]) => {
        const versions = Object.entries(packageItem.versions);
        const latestVersion = versions[0][1];
        return <div key={packageName} className='package' id={packageName}>
          <h2>{latestVersion.displayName} ( {packageName} )</h2>
          <p>{latestVersion.description}</p>
          <div className='meta'>
            <span>Author: {latestVersion.author.name}</span>
            <span>Unity: {latestVersion.unity}</span>
            <span>License: {latestVersion.license}</span>
          </div>
          <table className='versions'>
            <tr>
              <th>version</th>
              <th>dependencies</th>
              <th>link</th>
            </tr>
            {versions.map(([version, packageItem]) => {
              return <tr key={version} className='version'>
                <td>{packageItem.version}</td>
                <td className='list'>
                  {Object.entries(packageItem.vpmDependencies).map(([packageName, version]) => {
                    if (manifests.packages[packageName]) {
                      return <a key={packageName} href={`#${packageName}`}>{packageName}@{version}</a>
                    }
                    return <span key={packageName}>{packageName}@{version}</span>
                  })}
                </td>
                <td><a href={packageItem.url}>Download</a></td>
              </tr>
            })}
          </table>
        </div>
      })}
    </>
  )
}

export default App

import { useState } from 'react';
// import './App.css'; // App.cssは不要になるのでコメントアウト
import { useManifests } from './hooks/useManifests';
import { Manifest, PackageItem } from './types/manifest';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader } from './components/ui/card';

function App() {
  const manifests = useManifests();

  if (!manifests) {
    return <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-lg text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center py-8 px-2">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <Button asChild>
          <a
            href={`vcc://vpm/addRepo?url=${manifests.url}`}
          >
            Add to VCC
          </a>
        </Button>
        <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-white drop-shadow text-center w-full">ootr's vpm repository</h1>
        <div className="flex flex-col gap-8 w-full items-center">
          {Object.entries(manifests.packages).map(([packageName, packageItem]) => {
            const versions = Object.entries(packageItem.versions);
            const latestVersion = versions[0][1];
            return (
              <Card key={packageName} className="w-full max-w-xl mx-auto">
                <CardHeader>
                  <h2 className="text-xl font-semibold mb-1 text-white flex flex-wrap items-center gap-2">
                    {latestVersion.displayName}
                    <span className="text-xs text-zinc-400 font-mono">({packageName})</span>
                  </h2>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 text-zinc-300 text-sm">{latestVersion.description}</p>
                  <div className="flex flex-row flex-wrap gap-6 justify-center text-xs text-zinc-400 mb-2">
                    <span>Author: <span className="text-white">{latestVersion.author.name}</span></span>
                    <span>Unity: <span className="text-white">{latestVersion.unity}</span></span>
                    <span>License: <span className="text-white">{latestVersion.license}</span></span>
                  </div>
                  <VersionsDisplay manifests={manifests} versions={versions} />
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const VersionsDisplay = ({ manifests, versions }: { manifests: Manifest, versions: [string, PackageItem][] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isExpanded) {
    const packageItem = versions[0][1];
    return (
      <table className="w-full border-separate border-spacing-y-2 text-left text-xs bg-zinc-900/80 rounded-lg overflow-hidden">
        <thead>
          <tr className="border-b border-zinc-700 bg-zinc-800/80">
            <th className="px-3 py-2 font-semibold text-zinc-200">version</th>
            <th className="px-3 py-2 font-semibold text-zinc-200">dependencies</th>
            <th className="px-3 py-2 font-semibold text-zinc-200">link</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-zinc-800/60 transition">
            <td className="px-3 py-2 align-top whitespace-nowrap font-mono text-base text-blue-300">{packageItem.version}</td>
            <td className="px-3 py-2 align-top">
              <div className="flex flex-col gap-1">
                {Object.entries(packageItem.vpmDependencies).map(([packageName, version]) => {
                  if (manifests.packages[packageName]) {
                    return <a key={packageName} href={`#${packageName}`} className="text-blue-400 hover:underline whitespace-nowrap">{packageName}@{version}</a>
                  }
                  return <span key={packageName} className="whitespace-nowrap text-zinc-300">{packageName}@{version}</span>
                })}
              </div>
            </td>
            <td className="px-3 py-2 align-top"><a href={packageItem.url} className="text-green-400 hover:underline">Download</a></td>
          </tr>
          <tr>
            <td colSpan={3} className="text-center text-blue-500 cursor-pointer hover:underline py-2 bg-zinc-800/40 rounded-b-lg" onClick={() => setIsExpanded(true)}>
              &lt;&lt; Show all versions &gt;&gt;
            </td>
          </tr>
        </tbody>
      </table>
    )
  }

  return (
    <table className="w-full border-separate border-spacing-y-2 text-left text-xs bg-zinc-900/80 rounded-lg overflow-hidden">
      <thead>
        <tr className="border-b border-zinc-700 bg-zinc-800/80">
          <th className="px-3 py-2 font-semibold text-zinc-200">version</th>
          <th className="px-3 py-2 font-semibold text-zinc-200">dependencies</th>
          <th className="px-3 py-2 font-semibold text-zinc-200">link</th>
        </tr>
      </thead>
      <tbody>
        {versions.map(([version, packageItem]) => (
          <tr key={version} className="hover:bg-zinc-800/60 transition">
            <td className="px-3 py-2 align-top whitespace-nowrap font-mono text-base text-blue-300">{packageItem.version}</td>
            <td className="px-3 py-2 align-top">
              <div className="flex flex-col gap-1">
                {Object.entries(packageItem.vpmDependencies).map(([packageName, version]) => {
                  if (manifests.packages[packageName]) {
                    return <a key={packageName} href={`#${packageName}`} className="text-blue-400 hover:underline whitespace-nowrap">{packageName}@{version}</a>
                  }
                  return <span key={packageName} className="whitespace-nowrap text-zinc-300">{packageName}@{version}</span>
                })}
              </div>
            </td>
            <td className="px-3 py-2 align-top"><a href={packageItem.url} className="text-green-400 hover:underline">Download</a></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default App

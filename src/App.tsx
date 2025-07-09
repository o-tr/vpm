import { Button } from './components/ui/button';
import { PackageCard } from './components/PackageCard';
import { useManifests } from './hooks/useManifests';

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
          {Object.entries(manifests.packages).map(([packageName, pkg]) => (
            <PackageCard
              key={packageName}
              packageName={packageName}
              pkg={pkg}
              manifests={manifests}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App;

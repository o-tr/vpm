import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Manifest, Package } from "../types/manifest";
import { VersionsDisplay } from "./VersionsDisplay";

interface PackageCardProps {
  packageName: string;
  pkg: Package;
  manifests: Manifest;
}

export function PackageCard({ packageName, pkg, manifests }: PackageCardProps) {
  const versions = Object.entries(pkg.versions);
  const latestVersion = versions[0][1];
  return (
    <Card className="w-full max-w-xl mx-auto" id={packageName}>
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
  );
}

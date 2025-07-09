import { Copyright, Logs, UserPen } from "lucide-react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import type { Manifest, Package } from "../types/manifest";
import { MetadataItem } from "./MetadataItem";
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
          <span className="text-xs text-zinc-400 font-mono">
            ({packageName})
          </span>
        </h2>
      </CardHeader>
      <CardContent>
        <p className="mb-2 text-zinc-300 text-sm">
          {latestVersion.description}
        </p>
        <div className="flex flex-row flex-wrap gap-6 justify-center text-xs text-zinc-400 mb-2">
          <MetadataItem
            icon={<UserPen height={16} width={16} />}
            name="Author"
            value={latestVersion.author.name}
            href={latestVersion.author.url}
          />
          <MetadataItem name="Unity" value={latestVersion.unity} />
          <MetadataItem
            icon={<Copyright height={16} width={16} />}
            name="License"
            value={latestVersion.license}
            href={latestVersion.licensesUrl}
          />
          <MetadataItem
            icon={<Logs height={16} width={16} />}
            value={"Changelog"}
            href={latestVersion.changelogUrl}
          />
        </div>
        <VersionsDisplay manifests={manifests} versions={versions} />
      </CardContent>
    </Card>
  );
}

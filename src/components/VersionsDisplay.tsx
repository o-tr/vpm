import { useState } from "react";
import { Manifest, PackageItem } from "../types/manifest";

interface VersionsDisplayProps {
  manifests: Manifest;
  versions: [string, PackageItem][];
}

export function VersionsDisplay({ manifests, versions }: VersionsDisplayProps) {
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
                    return <a key={packageName} href={`#${packageName}`} className="text-blue-400 hover:underline whitespace-nowrap">{packageName}@{version}</a>;
                  }
                  return <span key={packageName} className="whitespace-nowrap text-zinc-300">{packageName}@{version}</span>;
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
    );
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
                    return <a key={packageName} href={`#${packageName}`} className="text-blue-400 hover:underline whitespace-nowrap">{packageName}@{version}</a>;
                  }
                  return <span key={packageName} className="whitespace-nowrap text-zinc-300">{packageName}@{version}</span>;
                })}
              </div>
            </td>
            <td className="px-3 py-2 align-top"><a href={packageItem.url} className="text-green-400 hover:underline">Download</a></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

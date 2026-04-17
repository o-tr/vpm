import { Fragment, useState } from "react";
import type { Manifest, PackageItem } from "../types/manifest";

interface VersionsDisplayProps {
  manifests: Manifest;
  versions: [string, PackageItem][];
}

const isYanked = (item: PackageItem): boolean => {
  const y = item["vrc-get"]?.yanked;
  return y !== undefined && y !== false;
};

const yankReason = (item: PackageItem): string | undefined => {
  const y = item["vrc-get"]?.yanked;
  return typeof y === "string" ? y : undefined;
};

interface DependenciesProps {
  manifests: Manifest;
  packageItem: PackageItem;
}

function Dependencies({ manifests, packageItem }: DependenciesProps) {
  return (
    <div className="flex flex-col gap-1">
      {Object.entries(packageItem.vpmDependencies).map(
        ([packageName, version]) => {
          if (manifests.packages[packageName]) {
            return (
              <a
                key={packageName}
                href={`#${packageName}`}
                className="text-blue-400 hover:underline whitespace-nowrap"
              >
                {packageName}@{version}
              </a>
            );
          }
          return (
            <span key={packageName} className="whitespace-nowrap text-zinc-300">
              {packageName}@{version}
            </span>
          );
        },
      )}
    </div>
  );
}

interface VersionRowProps {
  manifests: Manifest;
  packageItem: PackageItem;
}

function VersionRow({ manifests, packageItem }: VersionRowProps) {
  const yanked = isYanked(packageItem);
  const reason = yankReason(packageItem);
  return (
    <tr
      className={`hover:bg-zinc-800/60 transition ${yanked ? "opacity-60" : ""}`}
    >
      <td className="px-3 py-2 align-top whitespace-nowrap font-mono text-base text-blue-300">
        {yanked ? <s>{packageItem.version}</s> : packageItem.version}
        {yanked && (
          <span
            className="ml-2 inline-block px-1.5 py-0.5 rounded bg-red-900 text-red-200 text-[10px] font-semibold align-middle"
            title={reason}
          >
            YANKED
          </span>
        )}
        {reason && (
          <div className="text-[10px] text-red-300 mt-1 whitespace-normal">
            {reason}
          </div>
        )}
      </td>
      <td className="px-3 py-2 align-top">
        <Dependencies manifests={manifests} packageItem={packageItem} />
      </td>
      <td className="px-3 py-2 align-top">
        <a href={packageItem.url} className="text-green-400 hover:underline">
          Download
        </a>
      </td>
    </tr>
  );
}

interface YankedGroupProps {
  manifests: Manifest;
  group: [string, PackageItem][];
}

function YankedGroup({ manifests, group }: YankedGroupProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr
        className="bg-zinc-800/40 hover:bg-zinc-800/80 cursor-pointer"
        onClick={() => setOpen((v) => !v)}
      >
        <td
          colSpan={3}
          className="px-3 py-2 text-center text-red-300 text-xs select-none"
        >
          {open ? "▼" : "▶"} Yanked versions ({group.length})
        </td>
      </tr>
      {open &&
        group.map(([v, item]) => (
          <VersionRow key={v} manifests={manifests} packageItem={item} />
        ))}
    </>
  );
}

type Segment =
  | { kind: "active"; entry: [string, PackageItem] }
  | { kind: "yanked"; entries: [string, PackageItem][] };

const buildSegments = (versions: [string, PackageItem][]): Segment[] => {
  const segments: Segment[] = [];
  let buffer: [string, PackageItem][] = [];
  const flush = () => {
    if (buffer.length > 0) {
      segments.push({ kind: "yanked", entries: buffer });
      buffer = [];
    }
  };
  for (const entry of versions) {
    if (isYanked(entry[1])) {
      buffer.push(entry);
    } else {
      flush();
      segments.push({ kind: "active", entry });
    }
  }
  flush();
  return segments;
};

export function VersionsDisplay({ manifests, versions }: VersionsDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const thead = (
    <thead>
      <tr className="border-b border-zinc-700 bg-zinc-800/80">
        <th className="px-3 py-2 font-semibold text-zinc-200">version</th>
        <th className="px-3 py-2 font-semibold text-zinc-200">dependencies</th>
        <th className="px-3 py-2 font-semibold text-zinc-200">link</th>
      </tr>
    </thead>
  );

  if (!isExpanded) {
    const [, packageItem] = versions[0];
    return (
      <table className="w-full border-separate border-spacing-y-2 text-left text-xs bg-zinc-900/80 rounded-lg overflow-hidden">
        {thead}
        <tbody>
          <VersionRow manifests={manifests} packageItem={packageItem} />
          <tr>
            <td colSpan={3} className="p-0 rounded-b-lg bg-zinc-800/40">
              <button
                type="button"
                className="w-full text-center text-xs text-blue-500 cursor-pointer hover:underline py-2 bg-transparent border-0 rounded-b-lg"
                onClick={() => setIsExpanded(true)}
              >
                &lt;&lt; Show all versions &gt;&gt;
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  const segments = buildSegments(versions);

  return (
    <table className="w-full border-separate border-spacing-y-2 text-left text-xs bg-zinc-900/80 rounded-lg overflow-hidden">
      {thead}
      <tbody>
        {segments.map((segment, index) => {
          if (segment.kind === "active") {
            const [version, item] = segment.entry;
            return (
              <VersionRow
                key={`active-${version}`}
                manifests={manifests}
                packageItem={item}
              />
            );
          }
          const firstKey = segment.entries[0][0];
          return (
            <Fragment key={`yanked-${index}-${firstKey}`}>
              <YankedGroup manifests={manifests} group={segment.entries} />
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}

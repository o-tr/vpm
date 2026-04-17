import semver from "semver";
import type { PackageItem } from "../types/manifest";

function compareVersionKeys(a: string, b: string): number {
  const ca = semver.coerce(a);
  const cb = semver.coerce(b);
  if (ca && cb) return semver.rcompare(ca, cb);
  if (ca && !cb) return -1;
  if (!ca && cb) return 1;
  return a.localeCompare(b);
}

export function sortPackageVersionsDesc(
  versions: [string, PackageItem][],
): [string, PackageItem][] {
  return [...versions].sort((x, y) => compareVersionKeys(x[0], y[0]));
}

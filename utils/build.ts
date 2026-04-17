import "dotenv/config";
import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import semver from "semver";

const targetPackages = [
  "o-tr/jp.ootr.ImageGimmicksPack",
  "o-tr/jp.ootr.WeatherWidget",
  "o-tr/jp.ootr.othello",
  "o-tr/jp.ootr.chess",
  "o-tr/jp.ootr.LaserPointer",
  "o-tr/jp.ootr.UdonZip",
  "o-tr/jp.ootr.UdonLZ4",
  "o-tr/jp.ootr.udon-base64-csv-rle",
  "o-tr/jp.ootr.common",
  "o-tr/jp.ootr.CustomScaler",
  "o-tr/jp.ootr.ImageDeviceController",
  "o-tr/jp.ootr.ImageDeviceControllerVisualizer",
  "o-tr/jp.ootr.ImageTab",
  "o-tr/jp.ootr.ImageSlide",
  "o-tr/jp.ootr.ScreenMirror",
  "o-tr/jp.ootr.ImageScreen",
] as string[];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const token = process.env.GITHUB_TOKEN ?? "";

const fetchReleases = async (repo: string, page = 1): Promise<string[]> => {
  const releases = await fetch(
    `https://api.github.com/repos/${repo}/releases?per_page=100&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  ).then((res) => res.json());
  return releases.map((release: { tag_name: string }) => release.tag_name);
};

const fetchAllReleases = async (repo: string): Promise<string[]> => {
  let allReleases: string[] = [];
  let page = 1;
  let releases: string[];
  do {
    releases = await fetchReleases(repo, page);
    if (releases.length === 0) break;
    allReleases = allReleases.concat(releases);
    page++;
  } while (releases.length > 0);
  return allReleases;
};

void (async () => {
  const baseManifests = await Promise.all(
    targetPackages.map(async (pkg) => {
      const releases = await fetchAllReleases(pkg);
      const manifests = await Promise.all(
        releases.map<
          Promise<{
            name: string;
            version: string;
          }>
        >(async (tag) => {
          const manifest = await fetch(
            `https://raw.githubusercontent.com/${pkg}/${tag}/package.json`,
          ).then((res) => res.json());
          return {
            ...manifest,
            url: `https://github.com/${pkg}/releases/download/${tag}/release.zip`,
          };
        }),
      );

      return {
        name: manifests[0]?.name ?? pkg,
        versions: manifests.reduce(
          (acc, data) => {
            acc[data.version] = data;
            return acc;
          },
          {} as Record<string, unknown>,
        ),
      };
    }),
  );
  const packages = baseManifests.reduce(
    (acc, { name, versions }) => {
      acc[name] = { versions };
      return acc;
    },
    {} as Record<string, unknown>,
  );
  applyYanks(packages);

  const manifest = {
    packages,
    author: "ootr (o-tr)",
    name: "ootr",
    id: "jp.ootr.vpm",
    url: "https://o-tr.github.io/vpm/vpm.json",
  };
  fs.writeFileSync(
    path.join(__dirname, "..", "public", "vpm.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
})();

type YankRule = boolean | string;
type YanksConfig = Record<string, Record<string, YankRule>>;

function applyYanks(packages: Record<string, unknown>): void {
  const yanksPath = path.join(__dirname, "..", "yanks.json");
  if (!fs.existsSync(yanksPath)) return;

  const yanks: YanksConfig = JSON.parse(fs.readFileSync(yanksPath, "utf-8"));

  for (const [packageName, rules] of Object.entries(yanks)) {
    const pkg = packages[packageName] as
      | { versions: Record<string, Record<string, unknown>> }
      | undefined;
    if (!pkg) {
      console.warn(`[yanks] unknown package: ${packageName}`);
      continue;
    }

    const ruleEntries = Object.entries(rules);
    const exactRules = ruleEntries.filter(([k]) => semver.valid(k) !== null);
    const rangeRules = ruleEntries.filter(([k]) => semver.valid(k) === null);

    for (const [key] of exactRules) {
      if (!(key in pkg.versions)) {
        console.warn(
          `[yanks] ${packageName}: exact version "${key}" not found in manifest`,
        );
      }
    }

    for (const version of Object.keys(pkg.versions)) {
      let state: YankRule | undefined;
      for (const [range, value] of rangeRules) {
        if (semver.validRange(range) && semver.satisfies(version, range)) {
          state = value;
        }
      }
      const exact = exactRules.find(([k]) => k === version);
      if (exact) state = exact[1];

      if (state === false || state === undefined) continue;
      pkg.versions[version]["vrc-get"] = { yanked: state };
    }
  }
}

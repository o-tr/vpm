import 'dotenv/config';
import * as fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const targetPackages = [
  "o-tr/jp.ootr.ImageGimmicksPack",
  "o-tr/jp.ootr.WeatherWidget",
  "o-tr/jp.ootr.UdonZip",
  "o-tr/jp.ootr.UdonLZ4",
  "o-tr/jp.ootr.common",
  "o-tr/jp.ootr.ImageDeviceController",
  "o-tr/jp.ootr.ImageTab",
  "o-tr/jp.ootr.ImageSlide",
  "o-tr/jp.ootr.ImageScreen",
] as string[];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const token = process.env.GITHUB_TOKEN??"";

void (async()=>{
  const baseManifests = await Promise.all(targetPackages.map(async (pkg) => {
    const releases = await fetch(`https://api.github.com/repos/${pkg}/releases`,{
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then(res => res.json());
    console.log(releases);
    const tags = releases.map((release: {tag_name: string}) => release.tag_name);
    const manifests = await Promise.all(tags.map(async (tag) => {
      const manifest = await fetch(`https://raw.githubusercontent.com/${pkg}/${tag}/package.json`).then(res => res.json());
      return {
        ...manifest,
        url: `https://github.com/${pkg}/releases/download/${tag}/release.zip`
      };
    }));

    return {
      name: manifests[0]?.name??pkg,
      versions: manifests.reduce((acc, data) => {
        return {
          ...acc,
          [data.version]: data
        };
      }, {} as Record<string, unknown>),
    }
  }))
  const packages = baseManifests.reduce((acc, {name, versions}) => {
    return {
      ...acc,
      [name]: {
        versions
      }
    };
  }
  , {} as Record<string, unknown>);
  const manifest = {
    packages,
    author: "ootr (o-tr)",
    name: "ootr",
    id: "jp.ootr.vpm",
    url: "https://o-tr.github.io/vpm/vpm.json"
  };
  fs.writeFileSync(path.join(__dirname,"..","public","vpm.json"), JSON.stringify(manifest, null, 2)+"\n");
})();
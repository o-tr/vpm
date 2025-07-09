export type Manifest = {
    packages: {[packageName: string]: Package};
    author: string;
    name: string;
    id: string;
    url: string;
};

export type Package = {
    versions: {[version: string]: PackageItem};
}

export type PackageItem = {
    name: string;
    displayName: string;
    version: string;
    license: string;
    licensesUrl: string;
    unity: string;
    description: string;
    changelogUrl: string;
    author: {
        name: string;
        email: string;
        url: string;
    };
    url: string;
    vpmDependencies: {[packageName: string]: string};
    legacyFolders: {[path: string]: string};
}

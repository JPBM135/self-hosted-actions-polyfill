import type { PolyfillKey, PolyfillLib } from './types/polyfills.js';

export const POLYFILLS: Record<PolyfillKey, PolyfillLib> = {
  'ant-optional': { default: false, needs: [], aptPackage: 'ant-optional' },
  'build-essential': { default: true, needs: [], aptPackage: 'build-essential' },
  'ca-certificates': { default: true, needs: [], aptPackage: 'ca-certificates' },
  'dpkg-dev': { default: true, needs: [], aptPackage: 'dpkg-dev' },
  'fonts-noto-color-emoji': { default: false, needs: [], aptPackage: 'fonts-noto-color-emoji' },
  'g++': { default: true, needs: [], aptPackage: 'g++' },
  'iputils-ping': { default: false, needs: [], aptPackage: 'iputils-ping' },
  'libffi-dev': { default: true, needs: [], aptPackage: 'libffi-dev' },
  'libgbm-dev': { default: true, needs: [], aptPackage: 'libgbm-dev' },
  'libgconf-2-4': { default: true, needs: [], aptPackage: 'libgconf-2-4' },
  'libgsl-dev': { default: true, needs: [], aptPackage: 'libgsl-dev' },
  'libmagic-dev': { default: true, needs: [], aptPackage: 'libmagic-dev' },
  'libmagickcore-dev': { default: true, needs: [], aptPackage: 'libmagickcore-dev' },
  'libmagickwand-dev': { default: true, needs: [], aptPackage: 'libmagickwand-dev' },
  'libsecret-1-dev': { default: true, needs: [], aptPackage: 'libsecret-1-dev' },
  'libsqlite3-dev': { default: true, needs: [], aptPackage: 'libsqlite3-dev' },
  'libssl-dev': { default: true, needs: [], aptPackage: 'libssl-dev' },
  'libxkbfile-dev': { default: true, needs: [], aptPackage: 'libxkbfile-dev' },
  'libyaml-dev': { default: true, needs: [], aptPackage: 'libyaml-dev' },
  'net-tools': { default: false, needs: [], aptPackage: 'net-tools' },
  'openjdk-17-jre-headless"': { default: false, needs: [], aptPackage: 'openjdk-17-jre-headless"' },
  'openssh-client': { default: false, needs: [], aptPackage: 'openssh-client' },
  'p7zip-full': { default: false, needs: [], aptPackage: 'p7zip-full' },
  'p7zip-rar': { default: false, needs: [], aptPackage: 'p7zip-rar' },
  'pkg-config': { default: true, needs: [], aptPackage: 'pkg-config' },
  'python-is-python3': { default: false, needs: [], aptPackage: 'python-is-python3' },
  'python3-dev': { default: false, needs: [], aptPackage: 'python3-dev' },
  'python3-pip': { default: false, needs: [], aptPackage: 'python3-pip' },
  'python3-venv': { default: false, needs: [], aptPackage: 'python3-venv' },
  'xz-utils': { default: false, needs: [], aptPackage: 'xz-utils' },
  acl: { default: false, needs: [], aptPackage: 'acl' },
  ant: { default: false, needs: [], aptPackage: 'ant' },
  aria2: { default: false, needs: [], aptPackage: 'aria2' },
  autoconf: { default: false, needs: [], aptPackage: 'autoconf' },
  automake: { default: false, needs: [], aptPackage: 'automake' },
  binutils: { default: false, needs: [], aptPackage: 'binutils' },
  bison: { default: false, needs: [], aptPackage: 'bison' },
  brotli: { default: true, needs: [], aptPackage: 'brotli' },
  bzip2: { default: false, needs: [], aptPackage: 'bzip2' },
  coreutils: { default: true, needs: [], aptPackage: 'coreutils' },
  curl: { default: true, needs: [], aptPackage: 'curl' },
  dbus: { default: false, needs: [], aptPackage: 'dbus' },
  dnsutils: { default: false, needs: [], aptPackage: 'dnsutils' },
  dpkg: { default: true, needs: [], aptPackage: 'dpkg' },
  fakeroot: { default: false, needs: [], aptPackage: 'fakeroot' },
  file: { default: false, needs: [], aptPackage: 'file' },
  flex: { default: false, needs: [], aptPackage: 'flex' },
  ftp: { default: false, needs: [], aptPackage: 'ftp' },
  gcc: { default: true, needs: [], aptPackage: 'gcc' },
  gnupg: { default: true, needs: [], aptPackage: 'gnupg' },
  gnupg2: { default: true, needs: [], aptPackage: 'gnupg2' },
  haveged: { default: false, needs: [], aptPackage: 'haveged' },
  imagemagick: { default: false, needs: [], aptPackage: 'imagemagick' },
  iproute2: { default: false, needs: [], aptPackage: 'iproute2' },
  jq: { default: true, needs: [], aptPackage: 'jq' },
  kmod: { default: false, needs: [], aptPackage: 'kmod' },
  lib32z1: { default: true, needs: [], aptPackage: 'lib32z1' },
  libcurl4: { default: true, needs: [], aptPackage: 'libcurl4' },
  libtool: { default: true, needs: [], aptPackage: 'libtool' },
  libunwind8: { default: true, needs: [], aptPackage: 'libunwind8' },
  libxss1: { default: true, needs: [], aptPackage: 'libxss1' },
  locales: { default: false, needs: [], aptPackage: 'locales' },
  lz4: { default: false, needs: [], aptPackage: 'lz4' },
  m4: { default: false, needs: [], aptPackage: 'm4' },
  make: { default: true, needs: [], aptPackage: 'make' },
  mediainfo: { default: false, needs: [], aptPackage: 'mediainfo' },
  mercurial: { default: false, needs: [], aptPackage: 'mercurial' },
  netcat: { default: false, needs: [], aptPackage: 'netcat' },
  nodejs: { default: false, needs: [], aptPackage: 'nodejs' },
  parallel: { default: false, needs: [], aptPackage: 'parallel' },
  pass: { default: false, needs: [], aptPackage: 'pass' },
  patchelf: { default: false, needs: [], aptPackage: 'patchelf' },
  pigz: { default: false, needs: [], aptPackage: 'pigz' },
  pollinate: { default: false, needs: [], aptPackage: 'pollinate' },
  python3: { default: false, needs: [], aptPackage: 'python3' },
  rpm: { default: false, needs: [], aptPackage: 'rpm' },
  rsync: { default: false, needs: [], aptPackage: 'rsync' },
  shellcheck: { default: false, needs: [], aptPackage: 'shellcheck' },
  sphinxsearch: { default: false, needs: [], aptPackage: 'sphinxsearch' },
  sqlite3: { default: false, needs: [], aptPackage: 'sqlite3' },
  ssh: { default: true, needs: [], aptPackage: 'ssh' },
  sshpass: { default: false, needs: [], aptPackage: 'sshpass' },
  subversion: { default: false, needs: [], aptPackage: 'subversion' },
  sudo: { default: true, needs: [], aptPackage: 'sudo' },
  swig: { default: false, needs: [], aptPackage: 'swig' },
  tar: { default: true, needs: [], aptPackage: 'tar' },
  telnet: { default: false, needs: [], aptPackage: 'telnet' },
  texinfo: { default: false, needs: [], aptPackage: 'texinfo' },
  time: { default: false, needs: [], aptPackage: 'time' },
  tk: { default: false, needs: [], aptPackage: 'tk' },
  tzdata: { default: false, needs: [], aptPackage: 'tzdata' },
  uidmap: { default: false, needs: [], aptPackage: 'uidmap' },
  unzip: { default: true, needs: [], aptPackage: 'unzip' },
  upx: { default: false, needs: [], aptPackage: 'upx' },
  wget: { default: true, needs: [], aptPackage: 'wget' },
  xorriso: { default: false, needs: [], aptPackage: 'xorriso' },
  xvfb: { default: false, needs: [], aptPackage: 'xvfb' },
  zip: { default: true, needs: [], aptPackage: 'zip' },
  zsync: { default: false, needs: [], aptPackage: 'zsync' },
  yarn: {
    default: true,
    needs: ['curl'],
    path: '$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH',
    command: 'curl -o- -L https://yarnpkg.com/install.sh | bash || true',
  },
};

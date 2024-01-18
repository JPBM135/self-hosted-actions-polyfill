<span>
  <img style="border-radius: 6px" align="right" width="95" src="https://i.imgur.com/1tUj131.jpg"></img>
  <h1 align="left">Self-Hosted-Actions-Polyfill</h1>
</span>

Loads modules and binaries that are not available in the GitHub Actions self-hosted runner environment but are available in the GitHub Actions cloud environment.

## Inputs

### `ignore`

List of modules and binaries to ignore.

| **Type:** | **Required:** | **Default:** |
| --------- | ------------- | ------------ |
| Array     | No            | []           |

### `include`

List of modules and binaries to include that aren't default.

| **Type:** | **Required:** | **Default:** |
| --------- | ------------- | ------------ |
| Array     | No            | []           |

### `skip-defaults`

Ignore the default modules and binaries, only include the ones specified in the include input.

| **Type:** | **Required:** | **Default:** |
| --------- | ------------- | ------------ |
| Boolean   | No            | false        |

### `run-in-band`

Run the installs in band, useful for debugging but will be slower.

| **Type:** | **Required:** | **Default:** |
| --------- | ------------- | ------------ |
| Boolean   | No            | false        |

## Usage

```yaml
- uses: JPBM135/self-hosted-action-polyfill@v1.0.33
  with:
    # List of modules and binaries to ignore.
    ignore: ['libssl-dev', 'wget']
    # List of modules and binaries to include that aren't default.
    include: ['python3', 'uidmap']
    # Ignore the default modules and binaries, only include the ones specified in the include input.
    skip-defaults: false
    # Run the installs in band, useful for debugging but will be slower.
    run-in-band: false
```

## Supported Modules

| Module                 | Default |
| ---------------------- | ------- |
| ant-optional           | false   |
| build-essential        | true    |
| ca-certificates        | true    |
| dpkg-dev               | true    |
| fonts-noto-color-emoji | false   |
| g++                    | true    |
| gnome-terminal         | true    |
| iputils-ping           | false   |
| libffi-dev             | true    |
| libgbm-dev             | true    |
| libgconf-2-4           | true    |
| libgsl-dev             | true    |
| libmagic-dev           | false   |
| libmagickcore-dev      | false   |
| libmagickwand-dev      | false   |
| libpq-dev              | false   |
| libsecret-1-dev        | false   |
| libsqlite3-dev         | false   |
| libssl-dev             | true    |
| libxkbfile-dev         | true    |
| libyaml-dev            | true    |
| net-tools              | false   |
| openssh-client         | false   |
| p7zip-full             | false   |
| p7zip-rar              | false   |
| pkg-config             | true    |
| python-is-python3      | false   |
| python3-dev            | false   |
| python3-pip            | false   |
| python3-venv           | false   |
| xz-utils               | false   |
| acl                    | false   |
| ant                    | false   |
| aria2                  | false   |
| autoconf               | false   |
| automake               | false   |
| binutils               | false   |
| bison                  | false   |
| brotli                 | true    |
| bzip2                  | false   |
| coreutils              | true    |
| curl                   | true    |
| dbus                   | false   |
| dnsutils               | false   |
| dpkg                   | true    |
| fakeroot               | false   |
| file                   | false   |
| flex                   | false   |
| ftp                    | false   |
| gcc                    | true    |
| gnupg                  | true    |
| gnupg2                 | true    |
| haveged                | false   |
| imagemagick            | false   |
| iproute2               | false   |
| jq                     | true    |
| kmod                   | false   |
| libcurl4               | true    |
| libtool                | true    |
| libunwind8             | true    |
| libxss1                | true    |
| locales                | false   |
| lz4                    | false   |
| m4                     | false   |
| make                   | true    |
| mediainfo              | false   |
| mercurial              | false   |
| netcat                 | false   |
| nodejs                 | false   |
| parallel               | false   |
| pass                   | false   |
| patchelf               | false   |
| pigz                   | false   |
| pollinate              | false   |
| python3                | false   |
| rpm                    | false   |
| rsync                  | false   |
| shellcheck             | false   |
| sphinxsearch           | false   |
| sqlite3                | false   |
| ssh                    | true    |
| sshpass                | false   |
| subversion             | false   |
| sudo                   | true    |
| swig                   | false   |
| tar                    | true    |
| telnet                 | false   |
| texinfo                | false   |
| time                   | false   |
| tk                     | false   |
| tzdata                 | false   |
| uidmap                 | false   |
| unzip                  | true    |
| upx                    | false   |
| wget                   | true    |
| xorriso                | false   |
| xvfb                   | false   |
| zip                    | true    |
| zsync                  | false   |
| yarn                   | true    |
| docker                 | true    |
| aws-cli                | true    |

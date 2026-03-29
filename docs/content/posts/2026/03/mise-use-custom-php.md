---
title: 'カスタムビルドしたPHPをGitHub Releaseにアップロードしてmiseで使う'
date: '2026-03-29T23:20'
---

- [mise-en-place](https://mise.jdx.dev/)

mise(ミーズ)、プロジェクトディレクトリごとに別々の言語環境をセットアップするのに便利ですが
PHP環境をセットアップするのは次のような不便な点があります。

* `mise use php@xxx` コマンドをした時点でビルドする(数分かかる)
* `mise.toml` に [postinstall](https://mise.jdx.dev/hooks.html#preinstall-postinstall-hook)を設定すれば追加のPHP拡張インストールなどもできますが、同じPHPバージョンで異なる構成にする方法は不明

GitHub Release を使うことで、Configure option やPHP拡張をカスタマイズしたパッケージをアップロードし、
ネットワークが高速なら数秒でインストールできるPHPを用意できます。
プライベートリポジトリで社内向けにPHPバイナリを用意することもできそうです。

# PHPをビルド・パッケージ化してGitHub ReleaseにアップロードするGitHub Actions

以下のようなファイルをGitHubリポジトリに用意します。

```yml
# .github/workflows/build-php.yml
name: Build PHP

run-name: "Build PHP ${{ inputs.php_version }}"

on:
  workflow_dispatch:
    inputs:
      php_version:
        required: true
        default: "8.5.4"

permissions:
  contents: write

jobs:
  build:
    strategy:
      matrix:
        os: [ubuntu-24.04, macos-15]
    runs-on: ${{ matrix.os }}
    env:
      INSTALL_PATH: /opt/mise/data/installs/github-tenkoma-mise-php-build/custom-php-v${{ inputs.php_version }}

    steps:
      - name: export PATH
        run: echo "PATH=$INSTALL_PATH/bin:$PATH" >> "$GITHUB_ENV"

      - uses: actions/checkout@v6

      # PHP をビルドするときの --prefix パスは利用するときのパスと同一にしたほうがよいので
      # ビルド時に用意する。
      - name: Create install directories
        run: |
          sudo mkdir -p /opt/mise/data && sudo chown -R "$(id -u):$(id -g)" /opt/mise/data
          mkdir -p $(dirname "$INSTALL_PATH")

      # PHPソースコードをダウンロードし $INSTALL_PATH に展開する(vfox-phpがこのパスを前提にしている)
      - name: Download/Extract PHP Source
        run: |
          curl -Lo ${INSTALL_PATH}_source.tar.gz https://github.com/php/php-src/archive/php-${{ inputs.php_version }}.tar.gz
          cd $(dirname "$INSTALL_PATH")
          tar -zxf ${INSTALL_PATH}_source.tar.gz || exit 1
          mv php-src-php-${{ inputs.php_version }} "${INSTALL_PATH}"

      - name: Install build dependencies (Ubuntu)
        if: runner.os == 'Linux'
        run: |
          sudo apt-get update
          sudo apt-get install -y re2c libxml2-dev libsqlite3-dev \
            libcurl4-openssl-dev libonig-dev libreadline-dev libzip-dev \
            libpng-dev libgd-dev libpq-dev libicu-dev libgettextpo-dev

      - name: Install build dependencies (macOS)
        if: runner.os == 'macOS'
        run: |
          brew install autoconf re2c bison libpng gd icu4c libpq gettext libzip libiconv bzip2 webp

      - name: Checkout vfox-php
        run: git clone --branch v0.3.0 --depth 1 https://github.com/version-fox/vfox-php.git

      - name: Build PHP (Ubuntu)
        if: runner.os == 'Linux'
        env:
          CFLAGS: "-std=gnu17"
          PHP_CONFIGURE_OPTIONS: >-
            --with-openssl --with-curl --with-zlib --with-readline
            --with-gettext --with-webp
        run: |
          ./vfox-php/bin/install "$INSTALL_PATH"

      - name: Build PHP (macOS)
        if: runner.os == 'macOS'
        run: |
          export CFLAGS="-std=gnu17"
          export PHP_CONFIGURE_OPTIONS="\
            --with-openssl=$(brew --prefix openssl@3) \
            --with-zlib=$(brew --prefix zlib) \
            --with-readline=$(brew --prefix readline) \
            --with-libedit=$(brew --prefix libedit) \
            --with-bz2=$(brew --prefix bzip2) \
            --with-iconv=$(brew --prefix libiconv) \
            --with-gettext=$(brew --prefix gettext) \
            --with-icu-dir=$(brew --prefix icu4c) \
            --with-libxml=$(brew --prefix libxml2) \
            --with-libzip=$(brew --prefix libzip) \
            --with-webp=$(brew --prefix webp)"
          ./vfox-php/bin/install "$INSTALL_PATH"

      - name: Install pie
        run: |
          PHP_BIN_DIR=$(php -r 'echo PHP_BINDIR;')
          php -r "copy('https://github.com/php/pie/releases/latest/download/pie.phar', 'pie.phar');"
          mv pie.phar "${PHP_BIN_DIR}/pie"
          chmod +x "${PHP_BIN_DIR}/pie"
          pie --version

      - name: Install PHP extensions via pie
        run: |
          pie install apcu/apcu
          pie install phpredis/phpredis
          pie install xdebug/xdebug

      - name: Package
        run: |
          VERSION=${{ inputs.php_version }}
          OS=$(uname -s | tr '[:upper:]' '[:lower:]')
          ARCH=$(uname -m)
          tar -czf "custom-php-v${VERSION}-${OS}-${ARCH}.tar.gz" \
            -C "$INSTALL_PATH" .

      - name: Upload to Release
        env:
          GH_TOKEN: ${{ github.token }}
        run: |
          TAG="custom-php-v${{ inputs.php_version }}"
          # リリースが存在しなければ作成
          if ! gh release view "$TAG" > /dev/null 2>&1; then
            gh release create "$TAG" --title "$TAG" --notes "PHP ${{ inputs.php_version }} custom build"
          fi
          gh release upload "$TAG" custom-php-v*.tar.gz --clobber
```

`Actions > Build PHP` で使いたいPHPバージョンを入力して "Run workflow" を押します。

![](https://blog-attachments.tenkoma.dev/2026/03/mise-use-custom-php/01-workflow.png)

ビルド成功すると、GitHub Release にパッケージファイルが登録されています。

![](https://blog-attachments.tenkoma.dev/2026/03/mise-use-custom-php/02-github-release.png)

ここまでは mise と直接関係はありません。
PHPパッケージをアップロードするリポジトリを分けたり、タグのプレフィックスを使い分けることで同じPHPバージョンだけどビルドオプションの異なるPHPを用意できます。

# ビルドしたPHPバイナリをプロジェクトで使う。

miseドキュメントにかかれているセットアップ手順は省略しますが、
ここでビルドしたPHPを利用するためには、追加の準備が必要です。

1. `mise` がツールをダウンロード&インストールするディレクトリをつくる

```shell
sudo mkdir -p /opt/mise/data && sudo chown -R "$(id -u):$(id -g)" /opt/mise/data
```

PHPビルド時に指定された `--prefix={パス}` と同じディレクトリにインストールする必要があるので同じディレクトリを作ります。


2. `MISE_DATA_DIR` 環境変数を `~/.zshrc` に追記する

```
# mise
export MISE_DATA_DIR=/opt/mise/data
```

これで事前準備は終わりです。プロジェクトでPHPをインストールするときは以下の `mise.toml` を保存します。

```toml
[settings.github]
# PHPパッケージをダウンロードしたいGitHub Releaseがプライベートリポジトリの場合に必要
use_git_credentials = true

[tools]
# "github:{リポジトリ名}" = "{タグ}" 形式で
"github:tenkoma/mise-php-build" = "custom-php-v8.5"
```

`mise trust && mise install` すれば、プロジェクトディレクトリ以下にいるとき専用のPHPバージョンに切り替わります。

```
cd path/to/project_dir
mise trust
mise install
```

![](https://blog-attachments.tenkoma.dev/2026/03/mise-use-custom-php/03-mise-install.png)

これでセットアップ完了です。

# Plugins

Plugin runtime untuk menambah behavior pada OpenCode.

| Plugin | Kegunaan |
|---|---|
| [rtk.ts](./rtk.ts) | Mengoptimalkan command shell dengan RTK untuk menghemat token |
| [herdr-agent-state.js](./herdr-agent-state.js) | Mengirim status session agent ke Herdr |

`herdr-agent-state.js` dikelola otomatis oleh Herdr. Jangan edit file tersebut
secara manual karena dapat tertimpa saat integrasi diperbarui.

## RTK

RTK (Rust Token Killer) menyaring output command agar lebih ringkas sebelum
diterima coding agent.

### Install

macOS atau Linux dengan Homebrew:

```bash
brew install rtk-ai/tap/rtk
```

Alternatif installer:

```bash
curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh
```

Aktifkan integrasi OpenCode:

```bash
rtk init --global --opencode
```

Verifikasi:

```bash
rtk --version
rtk gain
```

Plugin [rtk.ts](./rtk.ts) membutuhkan command `rtk` di `PATH`. Restart
OpenCode setelah instalasi atau perubahan konfigurasi.

Dokumentasi: [RTK installation](https://github.com/rtk-ai/rtk/blob/develop/docs/guide/getting-started/installation.md)

## Herdr

Herdr menjaga terminal coding agent tetap berjalan dan melaporkan status session
ke Herdr.

### Install

macOS atau Linux:

```bash
curl -fsSL https://herdr.dev/install.sh | sh
```

Alternatif Homebrew:

```bash
brew install herdr
```

Verifikasi dan install integrasi OpenCode:

```bash
herdr --version
herdr integration install opencode
herdr integration status
```

Jalankan OpenCode dari dalam Herdr:

```bash
herdr
opencode
```

Plugin [herdr-agent-state.js](./herdr-agent-state.js) hanya aktif ketika
OpenCode berjalan di pane Herdr. Di luar Herdr, plugin tidak melakukan apa pun.

Dokumentasi: [Herdr install](https://herdr.dev/docs/install/) dan
[Herdr integrations](https://herdr.dev/docs/integrations/)

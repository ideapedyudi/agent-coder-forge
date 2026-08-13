# MongoDB MCP Server

MCP server lokal berbasis `stdio` yang memberi coding agent akses ke MongoDB.
Server menggunakan connection string dari environment variable
`MDB_MCP_CONNECTION_STRING`.

## Persyaratan

- Node.js 18 atau lebih baru
- MongoDB yang dapat diakses dari komputer ini
- Coding agent yang mendukung MCP melalui `stdio`

## Instalasi

Dari folder MCP ini:

```bash
npm install
npm run build
```

Server yang dijalankan oleh agent berada di:

```text
<MCP_ROOT>/dist/index.js
```

Ganti `<MCP_ROOT>` dengan path absolut folder ini. Contoh:

```text
/Users/macbook88/.config/opencode/mcps/mongodb/dist/index.js
```

## Connection string

Gunakan environment variable berikut pada konfigurasi MCP agent:

```text
MDB_MCP_CONNECTION_STRING=mongodb://localhost:27017
```

Contoh MongoDB Atlas:

```text
mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/?retryWrites=true&w=majority
```

Jangan commit username, password, API key, atau connection string ke repository.

## OpenCode

Tambahkan konfigurasi berikut ke `opencode.json` atau `opencode.jsonc`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "mongodb": {
      "type": "local",
      "command": [
        "node",
        "/absolute/path/to/mcps/mongodb/dist/index.js"
      ],
      "environment": {
        "MDB_MCP_CONNECTION_STRING": "mongodb://localhost:27017"
      },
      "enabled": true
    }
  }
}
```

Untuk konfigurasi global OpenCode, gunakan path absolut. Setelah mengubah
konfigurasi, restart OpenCode lalu cek:

```bash
opencode mcp list
```

Status server harus `connected`.

## Agent lain

Sebagian besar coding agent menggunakan format `mcpServers`. Contoh umum:

```json
{
  "mcpServers": {
    "mongodb": {
      "command": "node",
      "args": [
        "/absolute/path/to/mcps/mongodb/dist/index.js"
      ],
      "env": {
        "MDB_MCP_CONNECTION_STRING": "mongodb://localhost:27017"
      }
    }
  }
}
```

Format ini biasanya digunakan oleh Claude Desktop, Cursor, Windsurf, Cline,
Roo Code, dan client MCP lain yang menggunakan konfigurasi JSON.

Jika agent meminta konfigurasi satu server saja, gunakan nilai berikut:

```text
Transport: stdio
Command: node
Arguments: /absolute/path/to/mcps/mongodb/dist/index.js
Environment: MDB_MCP_CONNECTION_STRING=mongodb://localhost:27017
```

## Tools

### Database dan collection

- `list-databases`: daftar semua database
- `list-collections`: daftar collection dalam database
- `db-stats`: statistik database
- `collection-indexes`: daftar index collection
- `collection-schema`: infer schema dari sample dokumen

### Query

- `find`: query dokumen dengan filter, projection, sort, dan limit
- `aggregate`: menjalankan aggregation pipeline
- `count`: menghitung dokumen berdasarkan filter
- `explain`: melihat query execution plan

### Operasi tulis

- `insert-one`: memasukkan satu dokumen
- `update-many`: memperbarui dokumen yang cocok dengan filter
- `delete-many`: menghapus dokumen yang cocok dengan filter

Minta agent melakukan konfirmasi sebelum menggunakan `insert-one`,
`update-many`, atau `delete-many` pada database penting.

## Contoh prompt

```text
Gunakan MCP mongodb untuk daftar database yang tersedia.
```

```text
Gunakan MCP mongodb untuk mencari 10 dokumen terbaru dari
database app dan collection users, urutkan berdasarkan createdAt menurun.
```

```text
Gunakan MCP mongodb untuk memeriksa execution plan query ini dan
menyarankan index tanpa mengubah database.
```

## Troubleshooting

### Server tidak terhubung

Pastikan build sudah dilakukan dan file berikut ada:

```text
/absolute/path/to/mcps/mongodb/dist/index.js
```

Pastikan `command` dan `args` memakai path absolut yang benar, lalu restart
coding agent.

### MongoDB tidak dapat diakses

Uji connection string dengan MongoDB Compass atau MongoDB Shell. Untuk MongoDB
Atlas, pastikan IP komputer sudah diizinkan pada network access dan user
memiliki permission yang diperlukan.

### Server memakai database yang salah

Connection string menentukan server MongoDB, sedangkan nama database diberikan
sebagai parameter pada setiap tool. Gunakan nama database yang tepat pada prompt.

## Keamanan

- Jalankan server hanya sebagai proses lokal `stdio`.
- Gunakan user MongoDB dengan permission minimum yang diperlukan.
- Jangan menggunakan user admin untuk coding agent sehari-hari.
- Jangan menaruh connection string berisi password di file yang di-commit.
- Tinjau kembali operasi tulis dan hapus sebelum dijalankan.

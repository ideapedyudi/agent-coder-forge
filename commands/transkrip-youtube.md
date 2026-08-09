---
description: Fetch a YouTube video transcript with yt-dlp in a single shell pipeline (no files left behind) and produce a concise summary in Indonesian.
---

Fetch the transcript of a YouTube video and summarize it.

The user will provide a YouTube URL via `$ARGUMENTS` (e.g. `/transkrip-youtube https://youtu.be/...`).

Steps:

1. Validate that `$ARGUMENTS` looks like a YouTube URL (`youtube.com` or `youtu.be`). If missing or invalid, ask the user to provide one.
2. Load the `transkrip-youtube` skill and execute its one-shot pipeline in a **single bash call**. The transcript text comes back on stdout; the skill uses `mktemp -d` + `trap` cleanup so nothing is left in the user's working directory.
3. From the captured stdout, write a summary in Indonesian with this structure:
   - **Judul & Channel**
   - **Ringkasan Eksekutif** (3-5 kalimat)
   - **Poin-Poin Utama** (5-10 bullet)
   - **Insight / Takeaway** (1-3 kalimat)
   - **Timestamp Penting** (jika relevan)
4. Print the summary in chat. Do not create any files in the user's working directory.
5. If the pipeline prints `NO_SUBTITLES` or errors, report the exact message and suggest the user paste the transcript manually.

$ARGUMENTS

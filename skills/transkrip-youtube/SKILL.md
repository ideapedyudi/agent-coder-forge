---
name: transkrip-youtube
description: Use when the user invokes /transkrip-youtube or asks to summarize/transcribe a YouTube video. Uses yt-dlp to stream subtitles directly to stdout via a tempdir with trap-based cleanup — no files remain in the user's working directory.
---

# YouTube Transcript (yt-dlp, no leftover files)

Use this skill when the user invokes `/transkrip-youtube <url>` or asks for a transcript/summary of a YouTube video. The macOS host already has `yt-dlp` installed.

## Workflow

1. **Validate the URL.** It must match `youtube.com` or `youtu.be`. If not, ask the user to provide one.
2. **One-shot pipeline** in a single bash call: create a private `mktemp -d`, register a `trap` to wipe it on exit, run `yt-dlp` into that dir, strip the VTT to plain text on stdout, and let the trap clean up. No files survive in the user's cwd or in `/tmp`.

   ```bash
   WORKDIR=$(mktemp -d) && \
   trap 'rm -rf "$WORKDIR"' EXIT && \
   yt-dlp \
     --no-warnings --no-playlist --skip-download \
     --write-sub --write-auto-sub \
     --sub-lang "id,id.*,en,en.*,en-US,en-GB" \
     --sub-format "vtt" \
     -o "$WORKDIR/s.%(ext)s" \
     "$URL" 2>&1 | tail -n 20; \
   SUB=$(ls "$WORKDIR"/*.vtt 2>/dev/null | head -n 1); \
   if [ -z "$SUB" ]; then \
     yt-dlp \
       --no-warnings --no-playlist --skip-download \
       --write-auto-sub --sub-lang "id,en" --sub-format "vtt" \
       -o "$WORKDIR/s.%(ext)s" "$URL" >/dev/null 2>&1; \
     SUB=$(ls "$WORKDIR"/*.vtt 2>/dev/null | head -n 1); \
   fi; \
   if [ -z "$SUB" ]; then echo "NO_SUBTITLES"; exit 1; fi; \
   sed -E '
     /^WEBVTT/d
     /^NOTE /d
     /^[0-9]+$/d
     /-->/d
     s/<[^>]+>//g
     s/&amp;/\&/g; s/&#39;/'\''/g; s/&quot;/"/g
     /^[[:space:]]*$/d
   ' "$SUB"
   ```
3. **Capture the stdout** of that single bash call. That output IS the transcript. Do not run a separate `Read` tool — the text is already in the tool result.
4. **Produce a structured Indonesian summary** directly from the captured text:
   - **Judul & Channel** (parse from yt-dlp output printed in step 2; or ask the model to infer)
   - **Ringkasan Eksekutif** (3-5 kalimat)
   - **Poin-Poin Utama** (bulleted list, 5-10 item)
   - **Insight / Takeaway** (1-3 kalimat)
   - **Timestamp Penting** (jika ada marker waktu yang relevan dari isi)
5. **Print the summary in chat.** No files are created in the user's working directory.
6. If step 2 prints `NO_SUBTITLES`, tell the user, suggest pasting the transcript manually, or retrying after enabling captions in the browser.

## Failure Modes

- **No subtitles available** (member-only, age-gated, or no captions): output `NO_SUBTITLES`, tell the user, suggest pasting manually.
- **Network or 403 errors** from YouTube: try `yt-dlp -U` to update, or suggest `--cookies-from-browser chrome` (warn about cookie scope first).
- **Non-YouTube URL**: stop and ask for a valid YouTube link.
- **Transcript extremely long**: summarize in chunks; keep the first ~200 lines as a sample if the user wants the full text saved.

## Example Invocation

```
/transkrip-youtube https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

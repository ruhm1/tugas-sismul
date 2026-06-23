# Task: Debug dan Perbaiki Fitur AI Chatbot Gemini

## Konteks Project

Project ini adalah aplikasi restoran **GOURMET** dengan frontend React + Vite dan backend Express TypeScript. Fitur chatbot AI menggunakan Gemini API lewat package `@google/genai`.

Saat server dijalankan, backend berhasil running:

```txt
GOURMET server running at http://localhost:3000
```

Tetapi saat chatbot dipakai, muncul error:

```txt
AI Error: {"error":{"code":429,"message":"You exceeded your current quota, please check your plan and billing details...
Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests
limit: 0
model: gemini-2.0-flash
status":"RESOURCE_EXHAUSTED"
}}
- Falling back to knowledge base
```

Artinya server tidak crash, tetapi request ke Gemini gagal karena quota/rate limit/model/API key.

## File yang Perlu Dicek

Cek minimal file berikut:

```txt
src/server/routes/chatbot.ts
server.ts
.env
package.json
frontend component AISommelierBot
```

## Masalah yang Harus Dicek

### 1. Model Gemini masih hardcode

Di `chatbot.ts`, saat ini model dipakai langsung:

```ts
model: 'gemini-2.0-flash',
```

Tolong ubah agar model diambil dari `.env`, misalnya:

```ts
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
```

Lalu gunakan:

```ts
model: GEMINI_MODEL,
```

Tujuannya agar model bisa diganti tanpa edit source code.

---

### 2. Validasi API key Gemini

Saat ini ada kode seperti:

```ts
apiKey: process.env.GEMINI_API_KEY || 'MOCK_KEY',
```

Tolong perbaiki agar tidak memakai `MOCK_KEY` untuk request asli.

Contoh yang diinginkan:

```ts
function getGemini(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === 'isi_api_key_lu') {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }

  return aiClient;
}
```

Kalau API key kosong atau masih placeholder, chatbot harus langsung fallback ke knowledge base, bukan tetap mencoba request ke Gemini.

---

### 3. Cek konfigurasi `.env`

Pastikan `.env` project ini berisi minimal:

```env
PORT=3000
GEMINI_API_KEY=ISI_API_KEY_ASLI
GEMINI_MODEL=gemini-2.5-flash-lite
```

Catatan:

* Jangan gunakan `gemini-3.5-flash` kalau model itu tidak valid.
* Jangan hardcode model di source code.
* Setelah mengubah `.env`, server harus direstart.

---

### 4. Kurangi pemakaian token Gemini

Saat ini semua data dari Firestore `chatbot_knowledge` dikirim ke Gemini:

```ts
const knowledgeContext = knowledge.map((k: any) => `Q: ${k.question}\nA: ${k.answer}`).join('\n\n');
```

Ini bisa boros token dan mempercepat kena quota.

Tolong ubah agar hanya knowledge yang relevan dikirim ke Gemini.

Contoh pendekatan:

```ts
const lowerMessage = message.toLowerCase();

const relevantKnowledge = knowledge.filter((k: any) => {
  const q = k.question?.toLowerCase() || '';
  const keywords = q.split(' ').filter((w: string) => w.length > 3);

  return q && (
    lowerMessage.includes(q) ||
    keywords.some((w: string) => lowerMessage.includes(w))
  );
});

const selectedKnowledge = relevantKnowledge.length > 0
  ? relevantKnowledge
  : knowledge.slice(0, 5);

const knowledgeContext = selectedKnowledge
  .map((k: any) => `Q: ${k.question}\nA: ${k.answer}`)
  .join('\n\n');
```

---

### 5. Error handling Gemini

Kalau Gemini error karena quota, API key, atau network, chatbot jangan crash.

Tetap gunakan fallback logic dari knowledge base.

Tambahkan log yang lebih jelas:

```ts
console.error('Gemini error:', {
  message: err.message,
  status: err.status,
});
```

Response ke frontend tetap harus JSON seperti:

```json
{
  "text": "..."
}
```

Jangan mengirim stack trace ke frontend.

---

### 6. Cek endpoint frontend

Di React component, request dikirim ke:

```ts
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: rawVal, history: messages })
});
```

Pastikan route backend sudah benar:

```ts
app.use("/api/chat", chatbotRoutes);
```

Dan di `chatbot.ts`:

```ts
router.post('/', ...)
```

Berarti endpoint final benar:

```txt
POST /api/chat
```

---

### 7. Cek JSX React

Di component React, banyak menggunakan `class`, misalnya:

```tsx
<div class="fixed bottom-6 right-6 z-50 font-sans">
```

Kalau project ini React biasa, sebaiknya ubah semua `class` menjadi `className`.

Contoh:

```tsx
<div className="fixed bottom-6 right-6 z-50 font-sans">
```

Ini bukan penyebab error Gemini 429, tapi bisa menyebabkan warning/error TypeScript/React tergantung konfigurasi project.

---

## Target Perbaikan

Setelah diperbaiki, behavior yang diharapkan:

1. Server tetap running di `http://localhost:3000`.
2. Chatbot bisa menerima pesan dari frontend.
3. Kalau pertanyaan cocok dengan Firestore knowledge base, jawab dari knowledge base tanpa memanggil Gemini.
4. Kalau tidak cocok, backend mencoba memanggil Gemini dengan model dari `.env`.
5. Kalau Gemini quota/error, chatbot tetap menjawab fallback dari knowledge base.
6. Model Gemini tidak hardcode lagi.
7. API key placeholder tidak dipakai untuk request asli.
8. Response backend selalu JSON dan tidak membuat frontend error.

## Acceptance Criteria

Cek dengan request manual:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"halo"}'
```

Harus mengembalikan JSON:

```json
{
  "text": "..."
}
```

Lalu cek server log:

* Tidak boleh crash.
* Kalau Gemini gagal, harus muncul log fallback.
* Kalau API key valid dan quota tersedia, Gemini harus menjawab.
* Kalau API key kosong/placeholder, langsung fallback tanpa request ke Gemini.

## Catatan Penting

Error `429 RESOURCE_EXHAUSTED` biasanya bukan bug frontend. Itu biasanya karena:

* quota Gemini habis,
* model yang dipakai tidak punya free quota,
* project Google AI tidak aktif billing,
* API key memakai project yang salah,
* model hardcode ke model yang limit-nya 0.

Fokus utama perbaikan ada di `src/server/routes/chatbot.ts`.

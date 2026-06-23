# Task: Perbaiki Chatbot Firebase Knowledge Base dan Relevansi Jawaban

## Konteks Project

Project ini memiliki fitur chatbot AI untuk restoran **GOURMET**.

Backend menggunakan:

* Express + TypeScript
* Firebase / Firestore
* Gemini API lewat `@google/genai`

Route chatbot berada di:

```txt
src/server/routes/chatbot.ts
```

Frontend chatbot berada di component:

```txt
src/components/AISommelierBot.tsx
```

Endpoint chatbot:

```txt
POST /api/chat
```

Masalah Gemini quota sebelumnya sudah diperbaiki. Chatbot sekarang sudah bisa berjalan, tetapi ada masalah baru pada jawaban dari Firebase knowledge base.

## Masalah Saat Ini

Saat user bertanya:

```txt
ada menu apa saja?
```

Chatbot menjawab:

```txt
Absolutely. We take all allergies very seriously. Please inform us during reservation and our culinary team will prepare a safe, equally exquisite alternative menu. We are fully equipped to handle nut, gluten, dairy, and shellfish allergies.
```

Jawaban tersebut tidak sesuai karena:

1. User bertanya tentang daftar menu.
2. Bot malah menjawab tentang alergi.
3. Jawaban masih dalam Bahasa Inggris.
4. Jawaban tersebut berasal dari Firebase collection `chatbot_knowledge`, bukan dari Gemini.

Artinya flow chatbot kemungkinan seperti ini:

```txt
user message
→ matching ke chatbot_knowledge terlalu longgar
→ ketemu document alergi
→ return answer mentah dari Firebase
→ Gemini tidak dipanggil
```

## Tujuan Perbaikan

Perbaiki chatbot agar:

1. Pertanyaan tentang menu tidak mengambil jawaban alergi.
2. Matching knowledge base tidak terlalu longgar.
3. Jawaban dari Firebase knowledge base menggunakan Bahasa Indonesia.
4. Jika tidak ada match yang kuat, jangan return jawaban random dari Firebase.
5. Pertanyaan menu diarahkan ke database menu, bukan ke FAQ alergi.
6. Response tetap JSON dengan format aman.
7. Tambahkan debug `source` sementara untuk mengetahui asal jawaban.

## File yang Perlu Dicek

Cek minimal file berikut:

```txt
src/server/routes/chatbot.ts
src/server/routes/menu.ts
.env
.env.example
src/components/AISommelierBot.tsx
```

Fokus utama ada di:

```txt
src/server/routes/chatbot.ts
```

Cek juga `src/server/routes/menu.ts` untuk mengetahui:

* nama collection menu di Firestore,
* struktur field menu,
* field nama menu,
* field harga,
* field status aktif,
* field kategori.

## Masalah Teknis yang Kemungkinan Ada

Kemungkinan terdapat logic matching seperti ini:

```ts
const keywords = q?.split(' ').filter((w: string) => w.length > 3) || [];
return keywords.some((w: string) => message.toLowerCase().includes(w));
```

Logic ini terlalu longgar karena cukup 1 keyword cocok, maka knowledge base dianggap relevan.

Contoh masalah:

* User bertanya: `ada menu apa saja?`
* FAQ alergi mungkin punya kata `menu`
* Karena 1 kata cocok, bot mengambil jawaban alergi
* Akhirnya jawaban ngawur

## Perbaikan yang Diminta

### 1. Jangan pakai single keyword `.some()` sebagai final match

Jangan gunakan logic yang menganggap knowledge cocok hanya karena 1 kata muncul.

Contoh yang perlu dihindari:

```ts
keywords.some((w: string) => message.toLowerCase().includes(w))
```

Sebagai gantinya, gunakan scoring relevansi.

### 2. Buat helper tokenize

Tambahkan helper untuk memecah teks menjadi token penting.

Contoh:

```ts
const STOP_WORDS = new Set([
  'apa', 'ada', 'saja', 'aja', 'yang', 'dan', 'atau', 'untuk', 'dengan',
  'apakah', 'bisa', 'kami', 'anda', 'saya', 'aku', 'lu', 'gue',
  'menu', 'makanan', 'hidangan', 'restoran',
  'the', 'and', 'with', 'your', 'you', 'our', 'are', 'can', 'what'
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !STOP_WORDS.has(word));
}
```

Catatan:

* Kata umum seperti `menu`, `apa`, `ada`, `saja` jangan dijadikan dasar match final.
* Token penting seperti `gluten`, `scallop`, `crudo`, `allergy`, `reservasi`, `wine`, `wagyu`, `truffle` boleh dipakai.

### 3. Buat scoring knowledge base

Buat helper seperti:

```ts
function findBestKnowledgeMatch(message: string, knowledge: any[]) {
  const messageTokens = tokenize(message);

  if (messageTokens.length === 0) return null;

  let bestMatch: any = null;
  let bestScore = 0;

  for (const item of knowledge) {
    const question = item.question || '';
    const answer = item.answer || '';
    const keywords = Array.isArray(item.keywords) ? item.keywords.join(' ') : '';

    const sourceText = `${question} ${keywords}`;
    const knowledgeTokens = tokenize(sourceText);

    if (knowledgeTokens.length === 0) continue;

    const matchedCount = knowledgeTokens.filter((token: string) =>
      messageTokens.includes(token)
    ).length;

    const score = matchedCount / knowledgeTokens.length;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  if (bestScore >= 0.6) {
    return bestMatch;
  }

  return null;
}
```

Boleh sesuaikan threshold, tetapi jangan terlalu rendah. Target awal gunakan `0.6`.

### 4. Tambahkan intent khusus untuk pertanyaan menu

Sebelum matching ke `chatbot_knowledge`, cek apakah pertanyaan user adalah pertanyaan menu.

Contoh intent:

```ts
function isMenuQuestion(message: string): boolean {
  const text = message.toLowerCase();

  return [
    'menu',
    'makanan',
    'hidangan',
    'dish',
    'daftar menu',
    'list menu',
    'menu apa',
    'ada menu',
    'apa saja menunya',
    'apa aja menunya'
  ].some(keyword => text.includes(keyword));
}
```

Jika pertanyaan menu, ambil data dari database menu, bukan dari `chatbot_knowledge`.

Cek `src/server/routes/menu.ts` untuk mengetahui collection dan field yang benar.

Contoh logic umum:

```ts
if (isMenuQuestion(message)) {
  const menuSnap = await db.collection('menus')
    .where('isActive', '==', true)
    .get();

  const menus = menuSnap.docs.map(d => d.data());

  if (menus.length > 0) {
    const menuText = menus
      .slice(0, 10)
      .map((m: any) => {
        const name = m.name || m.title || '-';
        const price = m.price ? ` — Rp${Number(m.price).toLocaleString('id-ID')}` : '';
        return `- ${name}${price}`;
      })
      .join('\n');

    return res.json({
      text: `Berikut beberapa menu yang tersedia di GOURMET:\n${menuText}`,
      source: 'menu_database'
    });
  }

  return res.json({
    text: 'Mohon maaf, daftar menu belum tersedia saat ini. Silakan hubungi tim GOURMET untuk informasi menu terbaru.',
    source: 'menu_empty'
  });
}
```

Sesuaikan `collection` dan field berdasarkan project asli.

### 5. Jawaban knowledge base harus Bahasa Indonesia

Data di Firebase `chatbot_knowledge.answer` saat ini masih ada yang Bahasa Inggris.

Contoh data lama:

```txt
Absolutely. We take all allergies very seriously. Please inform us during reservation and our culinary team will prepare a safe, equally exquisite alternative menu. We are fully equipped to handle nut, gluten, dairy, and shellfish allergies.
```

Ubah menjadi Bahasa Indonesia:

```txt
Tentu. Kami menangani alergi dengan sangat serius. Mohon informasikan kebutuhan alergi atau pantangan makanan saat reservasi agar tim kuliner kami dapat menyiapkan menu alternatif yang aman, elegan, dan tetap sesuai standar GOURMET.
```

Untuk pertanyaan spesifik gluten/scallop, lebih baik:

```txt
Scallop crudo dapat disesuaikan untuk kebutuhan bebas gluten. Namun, mohon informasikan kebutuhan bebas gluten saat reservasi agar tim dapur dapat memastikan bahan dan proses penyajiannya aman dari risiko kontaminasi silang.
```

Jika project memiliki seed/admin CRUD knowledge base, pastikan isi knowledge base bisa diperbarui ke Bahasa Indonesia.

### 6. Jangan return raw knowledge base kalau relevansinya lemah

Jika tidak ada match yang kuat:

* jangan return jawaban random,
* jangan return jawaban alergi untuk pertanyaan menu,
* boleh call Gemini jika API key valid,
* jika Gemini gagal, return fallback default Bahasa Indonesia.

Fallback default yang disarankan:

```ts
return res.json({
  text: 'Mohon maaf, AI Sommelier sedang tidak dapat diakses. Untuk sementara, saya dapat membantu informasi dasar seputar menu, reservasi, dan alergi berdasarkan data GOURMET.',
  source: 'fallback_default'
});
```

### 7. Tambahkan field source sementara

Untuk debug, tambahkan field `source` di response chatbot.

Contoh:

```json
{
  "text": "...",
  "source": "menu_database"
}
```

Source yang diharapkan:

```txt
menu_database
menu_empty
knowledge_exact
knowledge_fallback
gemini
fallback_default
fallback_api_key_missing
fallback_gemini_error
cache
```

Field ini sementara untuk debugging. Jangan expose stack trace.

### 8. Gemini tetap harus dipaksa Bahasa Indonesia

Di `systemInstruction`, pastikan ada instruksi:

```txt
Anda adalah AI Sommelier dan Maître d' restoran GOURMET.

Aturan wajib:
- Selalu jawab dalam Bahasa Indonesia.
- Jangan menjawab dalam Bahasa Inggris.
- Jika knowledge base berbahasa Inggris, terjemahkan dan rapikan ke Bahasa Indonesia.
- Gaya bahasa elegan, ramah, singkat, sesuai restoran fine dining.
- Jangan mengarang fakta spesifik restoran yang tidak ada di data.
```

## Expected Behavior

### Test 1: Pertanyaan Menu

Request:

```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"ada menu apa saja?"}'
```

Expected:

* Tidak boleh menjawab alergi.
* Tidak boleh menjawab Bahasa Inggris.
* Jika menu ada di database, tampilkan daftar menu.
* Source ideal: `menu_database`.

Contoh response:

```json
{
  "text": "Berikut beberapa menu yang tersedia di GOURMET:\n- A5 Wagyu & Truffle\n- Scallop Crudo\n- Seasonal Tasting Menu",
  "source": "menu_database"
}
```

### Test 2: Pertanyaan Gluten

Request:

```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"Apakah scallop crudo sepenuhnya bebas gluten?"}'
```

Expected:

* Jawaban relevan tentang gluten/scallop.
* Bahasa Indonesia.
* Tidak menjawab daftar menu.
* Source bisa `knowledge_exact`, `knowledge_fallback`, atau `gemini`.

Contoh response:

```json
{
  "text": "Scallop crudo dapat disesuaikan untuk kebutuhan bebas gluten. Mohon informasikan kebutuhan tersebut saat reservasi agar tim dapur memastikan bahan dan proses penyajiannya aman dari risiko kontaminasi silang.",
  "source": "knowledge_fallback"
}
```

### Test 3: Pertanyaan Random

Request:

```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"xyzzy plugh qwerty"}'
```

Expected:

* Tidak mengambil jawaban alergi.
* Tidak mengambil jawaban menu.
* Jika Gemini aktif, boleh dijawab Gemini.
* Jika Gemini gagal, fallback default Bahasa Indonesia.

### Test 4: API Key Placeholder

Jalankan:

```bash
GEMINI_API_KEY=MOCK_KEY PORT=3001 npm run dev
```

Test:

```bash
curl -s -X POST http://localhost:3001/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"ada menu apa saja?"}'
```

Expected:

* Tidak crash.
* Tidak call Gemini.
* Tetap bisa jawab dari menu database jika tersedia.
* Jika tidak tersedia, fallback Bahasa Indonesia.

## Acceptance Criteria

Perbaikan dianggap selesai jika:

1. `npm run lint` berhasil.
2. `npm run dev` berhasil.
3. Endpoint `POST /api/chat` selalu return JSON.
4. Pertanyaan `"ada menu apa saja?"` tidak lagi menjawab tentang alergi.
5. Pertanyaan menu mengambil data dari menu database jika tersedia.
6. Jawaban dari Firebase knowledge base tidak lagi Bahasa Inggris.
7. Matching knowledge base tidak menggunakan single keyword match sebagai final decision.
8. Tidak ada stack trace dikirim ke frontend.
9. Source debug muncul di response untuk memudahkan pengecekan.
10. Tidak ada refactor besar di luar fitur chatbot.

## Catatan Penting

Jangan refactor besar-besaran.

Fokus hanya pada:

* `src/server/routes/chatbot.ts`
* matching knowledge base
* intent pertanyaan menu
* Bahasa Indonesia output
* fallback behavior
* debug source sementara

Jangan ubah fitur auth, reservation, gallery, admin, atau menu management kecuali perlu membaca struktur menu dari route/menu existing.

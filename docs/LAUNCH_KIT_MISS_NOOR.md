# Miss Noor — Launch & Use Kit

Everything needed to share **Miss Noor** on Facebook and for a parent or child to start using it.

## The link

**https://amina-nine-sepia.vercel.app**

## What it is (one line)

مس نور — رفيقة دراسية ذكية للصف الخامس الابتدائي (المنهج المصري، بالعربي والإنجليزي والفرنسي):
دروس، واجب، تدريب، وتقدّم — في مكان واحد هادي ومترابط.

Miss Noor — a smart Grade-5 study companion (Egyptian curriculum; Arabic, English and French):
lessons, homework, practice and progress in one calm, connected place.

## For Facebook — ready-to-paste post

**Arabic**

> 👩‍🏫 **مس نور — رفيقة ابنك الدراسية الذكية**
>
> مس نور بتساعد طفلك في الصف الخامس: شرح الدروس، الواجب، التدريب، ومتابعة التقدّم — كل ده في مكان واحد.
> 🗣️ بتتكلم عربي وإنجليزي وفرنسي · 📚 على المنهج المصري · 🎙️ بصوت حقيقي
>
> جرّبها من الموبايل: https://amina-nine-sepia.vercel.app
>
> (مفيش تسجيل دخول، ومفيش بيانات بتطلع من جهازك.)

**English**

> 👩‍🏫 **Meet Miss Noor — your child's smart study companion**
>
> Miss Noor helps your Grade-5 child with lessons, homework, practice and progress — all in one calm place.
> 🗣️ Speaks Arabic, English and French · 📚 Egyptian curriculum · 🎙️ Real voice
>
> Try it on your phone: https://amina-nine-sepia.vercel.app
>
> (No sign-up, and nothing leaves your device.)

## The link preview card

A pasted link now shows a **title, description and a 1200×630 image** automatically — the page carries
full Open Graph and Twitter tags plus `public/og.png`, served from an absolute URL (Facebook ignores
relative ones).

If the preview ever looks stale or empty, paste the link into Facebook's **Sharing Debugger** and press
**Scrape Again**:

<https://developers.facebook.com/tools/debug/>

## For parents and children — how to use

**بالعربي**

1. افتح الرابط **https://amina-nine-sepia.vercel.app** على الموبايل (Chrome أو Safari).
2. اختار اللغة: **العربية / English / Français**.
3. اكتب **اسم الطفل**، اختار **بنت** أو **ولد**، واختار **السن**، ثم اضغط **التالي**.
4. مس نور تعرض **كتب الصف الخامس** اللي عندها، اضغط **كمّل**.
5. جاوب **٣ أسئلة سريعة** من المنهج (لتحديد المستوى).
6. اختار **المواد المفضلة** و**طريقة التعلّم** و**مدة الجلسة**، ثم اضغط **يلا نبدأ**.
7. الاستخدام اليومي — أربع شاشات ثابتة في الشريط السفلي:
   - **الرئيسية**: خطة اليوم والخطوة اللي بعدها.
   - **الموجز**: الفيد (ريلز تعليمية قصيرة بصوت نور).
   - **المكتبة**: الدروس والمواد.
   - **نور**: اسأل مس نور أي سؤال، أو ابدأ درس كامل.
8. عايز تثبّتها كتطبيق؟ في **Safari**: زر المشاركة ← **إضافة إلى الشاشة الرئيسية**. في **Chrome**:
   القائمة ← **إضافة إلى الشاشة الرئيسية**.

**In English**

1. Open **https://amina-nine-sepia.vercel.app** on a phone (Chrome or Safari).
2. Choose the language: **العربية / English / Français**.
3. Type the **child's name**, pick **girl** or **boy**, pick the **age**, tap **Next**.
4. Miss Noor shows the **Grade-5 books** she already has — tap **Continue**.
5. Answer **3 quick curriculum questions** (to gauge level).
6. Pick **favourite subjects**, **learning style** and **session length**, then tap **Let's start**.
7. Daily use — four fixed tabs in the bottom bar:
   - **Home**: today's plan and the next step.
   - **Feed**: short educational reels narrated by Noor.
   - **Library**: lessons and materials.
   - **Noor**: ask Miss Noor anything, or start a full lesson.
8. To install it as an app — **Safari**: Share button → **Add to Home Screen**. **Chrome**: menu →
   **Add to Home Screen**.

## What works, and the limits

- **Live AI text is ON** — `GEMINI_API_KEY` is configured for production, so `/api/health` reports
  `hasApiKey:true` and the tutor routes answer live.
- **No account, no sign-up.** Everything (profile, progress, saved jobs) is stored **on the device**
  in the browser's IndexedDB. Nothing is uploaded. Clearing the browser data removes it, and a
  different phone starts fresh.
- **One child profile per browser.**
- **First load can take a few seconds** on a cold serverless start.
- **Free hosting** — Vercel Hobby; no credit card.
- The reel has no AI-generated photos or video yet (image models on the key are free-tier blocked);
  it uses authored diagrams, an animation and real narration audio.

## Proof for this deploy

| Check | Result |
|---|---|
| Merge commit | `64d58e77` (PR #95, squash) |
| Vercel production | `READY` for `64d58e77` |
| Public alias | `https://amina-nine-sepia.vercel.app` → `200` |
| Smoke test | `scripts/smoke.mjs` → **7 passed, 0 failed** |
| Onboarding drive (390×844, ar-EG) | reached the app shell (HOME/FEED/LIBRARY/NOUR), **0 console errors** |
| Share image | `/og.png` → `200 image/png`, **1200×630** |
| Facebook crawler view | `og:title`, `og:description`, `og:image`, `og:url`, `og:site_name` all present |

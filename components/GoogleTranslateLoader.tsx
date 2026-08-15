'use client';

import { useEffect } from 'react';

// Mounted once in app/[locale]/layout.tsx. Loads Google's "Website
// Translator" widget in the background so Header's language dropdown can
// drive it programmatically (see lib/googleTranslate.ts) — this is how
// Japanese/Hindi/Tamil/Telugu/Kannada/Malayalam/Bengali/Marathi get real
// translated content. next-intl's messages/ja/*.json exists but is only
// ever read for two strings (siteName/tagline) — no page actually calls
// useTranslations(), so the "real" /ja route left every page rendering
// plain English. Google Translate is what actually makes Japanese work, the
// same as the other six. English stays untranslated (it's the source).
export const GOOGLE_TRANSLATE_INCLUDED_LANGS = 'ja,hi,ta,te,kn,ml,bn,mr';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate?: { TranslateElement?: any } };
  }
}

export default function GoogleTranslateLoader() {
  useEffect(() => {
    if (document.getElementById('google-translate-script')) return;

    window.googleTranslateElementInit = () => {
      // eslint-disable-next-line new-cap
      new window.google!.translate!.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: GOOGLE_TRANSLATE_INCLUDED_LANGS,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Google's widget renders its own picker into this node — kept off-screen
  // rather than display:none, which stops some builds of the widget from
  // initializing at all.
  return (
    <div
      id="google_translate_element"
      aria-hidden
      style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}
    />
  );
}

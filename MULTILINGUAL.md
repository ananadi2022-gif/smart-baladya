# Multilingual Support (i18n)

Smart Baladiya now supports multiple languages: **English**, **French**, and **Arabic**.

## 📁 File Structure

```
client/src/
├── locales/
│   ├── en.json          # English translations
│   ├── fr.json          # French translations
│   └── ar.json          # Arabic translations
├── hooks/
│   └── use-translation.tsx  # Translation provider and hook
└── components/
    └── language-switcher.tsx  # Language selector component
```

## 🚀 How to Use Translations

### In Components

```tsx
import { useTranslation } from "@/hooks/use-translation";

export function MyComponent() {
  const { t, language, setLanguage } = useTranslation();

  return (
    <div>
      <h1>{t("auth.welcomeBack")}</h1>
      <button onClick={() => setLanguage("fr")}>Switch to French</button>
    </div>
  );
}
```

## 🌐 Accessing the Language Switcher

The language switcher is available in:
- **Login Page** (top-right corner)
- **Desktop Sidebar** (bottom section)
- **Mobile Header** (next to menu icon)

## 📝 Adding New Translations

1. Open one of the locale files:
   - `client/src/locales/en.json`
   - `client/src/locales/fr.json`
   - `client/src/locales/ar.json`

2. Add your new translation key:
```json
{
  "section": {
    "key": "Your translation text"
  }
}
```

3. Use in your component:
```tsx
const { t } = useTranslation();
<span>{t("section.key")}</span>
```

## 🎯 Translation Keys Structure

The translation keys follow this hierarchy:
- `common.*` - Shared translation keys
- `auth.*` - Authentication pages
- `admin.*` - Admin dashboard
- `citizen.*` - Citizen dashboard
- `landing.*` - Landing page

## 🌍 Supported Languages

| Language | Code | Direction |
|----------|------|-----------|
| English | `en` | LTR |
| Français | `fr` | LTR |
| العربية | `ar` | RTL |

The app automatically sets the HTML direction (`dir`) and language attributes based on the selected language.

## 💾 Language Persistence

The selected language is stored in browser localStorage with key `app_language` and persists across sessions.

## 🔄 How It Works

1. **TranslationProvider**: Wraps the entire app in `main.tsx`
2. **useTranslation Hook**: Provides `t()` function to access translations
3. **Language Storage**: Saves user's language preference
4. **RTL Support**: Automatically adjusts for Arabic language

## 🛠️ Current Translation Coverage

| Page | Translated ✅ |
|------|-----------------|
| Login/Auth | ✅ |
| Admin Dashboard | ✅ |
| User Management | ✅ |
| Navigation | ✅ |

---

**Note**: For RTL languages like Arabic, ensure all text-heavy components use the translation system to display content correctly.

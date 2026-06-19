# Forum Diskusi — React Web Developer Expert

Aplikasi Forum Diskusi berbasis React yang dibangun sebagai submission Dicoding kelas **Menjadi React Web Developer Expert**.

## 🚀 Live Demo

> URL Vercel akan ditambahkan setelah deployment

## 📦 Tech Stack

- **React 19** + **Vite** — Build tool & framework
- **Redux Toolkit** — State management
- **React Router v7** — Client-side routing
- **React Hot Toast** — Notifikasi
- **React Icons** — Icon library
- **Storybook** — Component development & documentation
- **Vitest** + **React Testing Library** — Unit & Integration testing
- **Cypress** — End-to-End testing
- **GitHub Actions** — CI/CD pipeline
- **Vercel** — Hosting & Continuous Deployment

## ✅ Fitur Utama

- 🔐 Autentikasi (Login & Register)
- 📝 Buat, lihat, dan komentari thread diskusi
- 👍 Upvote / Downvote thread & komentar
- 🏆 Halaman Leaderboard
- 🔖 Filter thread berdasarkan kategori
- 📊 CI/CD dengan GitHub Actions & Vercel

## 🧪 Menjalankan Tests

### Unit & Integration Tests
```bash
npm test
```

### End-to-End Tests (Cypress)
```bash
npm run e2e
```

### Storybook
```bash
npm run storybook
```

## 🛠 Menjalankan Aplikasi

```bash
# Install dependencies
npm install --legacy-peer-deps

# Development server
npm run dev

# Production build
npm run build
```

## 📁 Struktur Proyek

```
src/
├── api/          # API service layer
├── components/   # Reusable UI components + stories + tests
├── hooks/        # Custom React hooks
├── pages/        # Page-level components
└── store/        # Redux slices + thunks + tests
cypress/
└── e2e/          # End-to-End test scenarios
```

## 🔒 CI/CD

- **Continuous Integration**: GitHub Actions menjalankan ESLint, unit tests, dan Cypress E2E tests pada setiap push.
- **Continuous Deployment**: Vercel otomatis deploy ke production pada setiap merge ke branch `main`.
- **Branch Protection**: Branch `main` diproteksi — PR harus lolos semua CI checks sebelum bisa di-merge.

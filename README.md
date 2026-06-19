# Forum Diskusi — Aplikasi Diskusi Forum

[![CI — Forum Diskusi](https://github.com/Rian-Saputera/forum-diskusi/actions/workflows/ci.yml/badge.svg)](https://github.com/Rian-Saputera/forum-diskusi/actions/workflows/ci.yml)

Aplikasi forum diskusi berbasis React dengan fitur thread, komentar, voting, dan leaderboard.

🌐 **Live Demo**: https://forum-diskusi-gold.vercel.app

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| Frontend | React 19, React Router, Redux Toolkit |
| Build Tool | Vite |
| Unit Test | Vitest, React Testing Library |
| E2E Test | Cypress |
| CI/CD | GitHub Actions |
| Deployment | Vercel |

---

## 🚀 Cara Menjalankan

```bash
# Install dependencies
npm install --legacy-peer-deps

# Jalankan aplikasi (dev)
npm run dev

# Build produksi
npm run build

# Jalankan unit test
npm test

# Jalankan E2E test
npm run e2e
```

---

## 🧪 Testing

### Unit & Integration Test (Vitest)
- **57 test** di 6 file
- Mencakup: reducer, thunks, komponen React
- Jalankan: `npm test`

### E2E Test (Cypress)
- **4 skenario** login flow dengan `cy.intercept()` untuk mocking API
- Reliable di CI karena tidak bergantung pada server eksternal
- Jalankan: `npm run e2e`

---

## ⚙️ CI/CD Pipeline (GitHub Actions)

Pipeline berjalan otomatis pada setiap `push` dan `pull_request`:

1. **Unit & Integration Tests** — ESLint + Vitest (57 tests)
2. **E2E Tests (Cypress)** — Build + Preview server + Cypress headless

Branch `main` dilindungi dengan branch protection rules:
- Semua CI checks harus lolos sebelum merge
- Minimal 1 approving review diperlukan

---

## 📸 Screenshots Submission

Tersedia di folder `screenshots/`:
- `1_ci_check_error.png` — CI gagal (merah)
- `2_ci_check_pass.png` — CI berhasil (hijau, 57 unit tests + 4 E2E tests)
- `3_branch_protection.png` — Branch protection aktif di PR

---

## 🔗 Links

- **Repository**: https://github.com/Rian-Saputera/forum-diskusi
- **Live App**: https://forum-diskusi-gold.vercel.app
- **CI/CD Pipeline**: https://github.com/Rian-Saputera/forum-diskusi/actions
- **API**: https://forum-api.dicoding.dev/v1

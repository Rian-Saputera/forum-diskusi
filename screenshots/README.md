# Panduan Screenshot CI/CD

Folder ini digunakan untuk menyimpan screenshot bukti CI/CD sesuai ketentuan submission.

## Screenshot yang Diperlukan

### 1. `1_ci_check_error.png`
Tangkap layar dari GitHub Actions yang menunjukkan CI check GAGAL (merah).
- Cara mendapatkan: Push commit dengan test yang sengaja gagal ke branch baru, lalu buat PR ke master.

### 2. `2_ci_check_pass.png`
Tangkap layar dari GitHub Actions yang menunjukkan CI check LULUS (hijau).
- Cara mendapatkan: Setelah semua test lulus, CI akan otomatis hijau pada PR berikutnya.

### 3. `3_branch_protection.png`
Tangkap layar dari halaman PR di GitHub yang menunjukkan branch protection aktif.
- Cara mendapatkan: Aktifkan branch protection di Settings > Branches > Add rule (require status checks to pass).

## Langkah Setup CI/CD

### 1. Buat Repository GitHub
```bash
git init
git add .
git commit -m "feat: initial forum diskusi app with testing"
git remote add origin https://github.com/USERNAME/forum-diskusi.git
git push -u origin master
```

### 2. Deploy ke Vercel
- Buka https://vercel.com
- Klik "New Project" → Import dari GitHub
- Pilih repository `forum-diskusi`
- Vercel otomatis detect `vercel.json` yang sudah ada
- Klik Deploy

### 3. Aktifkan Branch Protection di GitHub
- Buka Settings → Branches → Add branch protection rule
- Branch name pattern: `master`
- Centang: "Require status checks to pass before merging"
- Pilih: `CI — Forum Diskusi / Unit & Integration Tests`
- Save changes

### 4. Cantumkan di Catatan Submission
```
URL Vercel: https://forum-diskusi-USERNAME.vercel.app
```

---
> **PENTING**: Ganti screenshot placeholder di folder ini dengan screenshot asli sebelum submit!

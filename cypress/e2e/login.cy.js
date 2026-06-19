/**
 * Skenario End-to-End: Alur Login Pengguna
 *
 * Skenario 1 - Login dengan kredensial yang salah:
 *   - Buka halaman /login
 *   - Isi email dan password yang salah
 *   - Klik tombol Masuk
 *   - Seharusnya menampilkan pesan error (toast)
 *   - Seharusnya tetap berada di halaman /login
 *
 * Skenario 2 - Login dengan kredensial yang benar:
 *   - Buka halaman /login
 *   - Isi email dan password yang valid
 *   - Klik tombol Masuk
 *   - Seharusnya diarahkan ke halaman beranda (/)
 *   - Seharusnya menampilkan nama user di navbar
 *
 * Skenario 3 - Redirect ke login jika belum login dan akses halaman protected:
 *   - Buka halaman /threads/new tanpa login
 *   - Seharusnya diarahkan ke halaman /login
 *
 * Skenario 4 - Halaman login menampilkan elemen yang dibutuhkan:
 *   - Input email tersedia
 *   - Input password tersedia
 *   - Tombol masuk tersedia
 *   - Link ke halaman register tersedia
 */

describe('Alur Login Pengguna', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('Skenario 1: login dengan kredensial salah harus menampilkan pesan error', () => {
    cy.visit('/login');
    cy.get('#input-email').type('salah@email.com');
    cy.get('#input-password').type('passwordsalah');
    cy.get('#btn-login').click();

    // Tunggu response API dan pastikan masih di halaman login
    cy.url().should('include', '/login');

    // Toast error harus muncul
    cy.get('.go3958317564', { timeout: 5000 }).should('exist');
  });

  it('Skenario 2: login dengan kredensial benar harus redirect ke beranda', () => {
    cy.visit('/login');

    cy.get('#input-email').type('dicoding@dicoding.com');
    cy.get('#input-password').type('dicodingg');
    cy.get('#btn-login').click();

    // Setelah login berhasil, harus redirect ke /
    cy.url({ timeout: 8000 }).should('eq', Cypress.config().baseUrl + '/');

    // Nama pengguna harus terlihat di navbar
    cy.get('.user-name', { timeout: 5000 }).should('be.visible');
  });

  it('Skenario 3: akses halaman protected tanpa login harus redirect ke /login', () => {
    cy.visit('/threads/new');
    cy.url().should('include', '/login');
  });

  it('Skenario 4: halaman login harus menampilkan semua elemen yang dibutuhkan', () => {
    cy.visit('/login');

    cy.get('#input-email').should('be.visible');
    cy.get('#input-password').should('be.visible');
    cy.get('#btn-login').should('be.visible').and('contain.text', 'Masuk');
    cy.contains('Daftar sekarang').should('have.attr', 'href', '/register');
  });
});

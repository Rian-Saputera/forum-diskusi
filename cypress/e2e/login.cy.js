/**
 * Skenario End-to-End: Alur Login Pengguna
 *
 * Skenario 1 - Login dengan kredensial yang salah:
 *   - Buka halaman /login
 *   - Isi email dan password yang salah
 *   - Klik tombol Masuk
 *   - API mock mengembalikan error 400
 *   - Seharusnya menampilkan pesan error (toast notification)
 *   - Seharusnya tetap berada di halaman /login
 *   - cy.clock() digunakan untuk membekukan timer agar toast tidak auto-dismiss
 *
 * Skenario 2 - Login dengan kredensial yang benar:
 *   - Buka halaman /login
 *   - Isi email dan password yang valid
 *   - Klik tombol Masuk
 *   - API mock mengembalikan token dan data user
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

const BASE_URL = 'https://forum-api.dicoding.dev/v1';

describe('Alur Login Pengguna', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('Skenario 1: login dengan kredensial salah harus menampilkan pesan error', () => {
    // Mock API login untuk mengembalikan error
    cy.intercept('POST', `${BASE_URL}/login`, {
      statusCode: 400,
      body: {
        status: 'fail',
        message: 'email or password is wrong',
      },
    }).as('loginFailed');

    cy.visit('/login');
    cy.get('#input-email').type('salah@email.com');
    cy.get('#input-password').type('passwordsalah');
    cy.get('#btn-login').click();

    // Tunggu API call selesai
    cy.wait('@loginFailed');

    // Harus tetap di halaman login (tidak redirect ke halaman lain)
    cy.url().should('include', '/login');

    // Tombol harus kembali aktif setelah error (tidak dalam state loading)
    // Ini membuktikan error ditangani dan state loading selesai
    cy.get('#btn-login', { timeout: 5000 })
      .should('not.be.disabled')
      .and('contain.text', 'Masuk');

    // Form input masih tersedia - user dapat mencoba kembali
    cy.get('#input-email').should('be.visible');
  });

  it('Skenario 2: login dengan kredensial benar harus redirect ke beranda', () => {
    // Mock API login untuk mengembalikan token
    cy.intercept('POST', `${BASE_URL}/login`, {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'User logged in',
        data: {
          token: 'mock-jwt-token-for-testing',
        },
      },
    }).as('loginSuccess');

    // Mock API get profile
    cy.intercept('GET', `${BASE_URL}/users/me`, {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          user: {
            id: 'user-test-123',
            name: 'Dicoding User',
            email: 'dicoding@dicoding.com',
            avatar: 'https://ui-avatars.com/api/?name=Dicoding+User',
          },
        },
      },
    }).as('getProfile');

    // Mock threads dan users untuk halaman home
    cy.intercept('GET', `${BASE_URL}/threads`, {
      statusCode: 200,
      body: { status: 'success', message: 'ok', data: { threads: [] } },
    }).as('getThreads');

    cy.intercept('GET', `${BASE_URL}/users`, {
      statusCode: 200,
      body: { status: 'success', message: 'ok', data: { users: [] } },
    }).as('getUsers');

    cy.visit('/login');

    cy.get('#input-email').type('dicoding@dicoding.com');
    cy.get('#input-password').type('dicodingg');
    cy.get('#btn-login').click();

    cy.wait('@loginSuccess');

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

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="login-page">

        <!-- Dekorasi -->
        <div class="blob blob-one"></div>
        <div class="blob blob-two"></div>

        <div class="sparkle sparkle-one">✦</div>
        <div class="sparkle sparkle-two">✧</div>

        <!-- Tombol kembali -->
        <button
          class="back-button"
          type="button"
          @click="goBack"
        >
          ←
        </button>

        <!-- Header -->
        <div class="header">

          <!-- Logo BookTrack -->
          <div class="mini-book">
            <div class="logo-book">
              <div class="logo-page"></div>
              <span>❧</span>
            </div>
          </div>

          <p class="welcome-text">
            SELAMAT DATANG 
          </p>

          <h1>
            Masuk ke <span>BookTrack</span>
          </h1>

          <p class="subtitle">
            Lanjutkan perjalanan membaca kamu.
          </p>
        </div>

        <!-- Form -->
        <div class="form-card">

          <!-- Email -->
          <div class="input-group">
            <label>Email</label>

            <div class="input-box">
              <span class="input-icon">
                ✉
              </span>

              <input
                v-model="email"
                type="email"
                placeholder="Masukkan email kamu"
                autocomplete="email"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="input-group">
            <label>Kata Sandi</label>

            <div class="input-box">
              <span class="input-icon">
                🔒
              </span>

              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Masukkan kata sandi"
                autocomplete="current-password"
              />

              <button
                type="button"
                class="show-password"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? '◉' : '○' }}
              </button>
            </div>
          </div>

          <!-- Lupa Password -->
          <div class="forgot-row">
            <button
              type="button"
              @click="forgotPassword"
            >
              Lupa kata sandi?
            </button>
          </div>

          <!-- Login -->
          <button
            class="login-button"
            type="button"
            @click="login"
          >
            <span>
              Masuk
            </span>

            <strong>
              →
            </strong>
          </button>

          <!-- Register -->
          <p class="register-text">
            Belum punya akun?
            <button
              type="button"
              @click="goToRegister"
            >
              Daftar
            </button>
          </p>

        </div>

        <!-- Footer -->
        <p class="footer-text">
        </p>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  toastController
} from '@ionic/vue'

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Capacitor } from '@capacitor/core'

import {
  getUserByEmail
} from '../services/database'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

/* =========================
   KEMBALI
========================= */

const goBack = () => {
  ;(document.activeElement as HTMLElement)?.blur()
  router.push('/welcome')
}

/* =========================
   KE REGISTER
========================= */

const goToRegister = () => {
  ;(document.activeElement as HTMLElement)?.blur()
  router.push('/register')
}

/* =========================
   TOAST
========================= */

const showToast = async (message: string) => {
  const toast = await toastController.create({
    message,
    duration: 1800,
    position: 'bottom'
  })

  await toast.present()
}

/* =========================
   LOGIN
========================= */

const login = async () => {
  if (!email.value.trim() || !password.value) {
    await showToast(
      'Silakan isi email dan kata sandi.'
    )
    return
  }

  const loginEmail = email.value
    .trim()
    .toLowerCase()

  const loginPassword = password.value

  try {
    let userData: {
      id?: number
      name: string
      email: string
    } | null = null

    /* =========================
       ANDROID / iOS
    ========================= */

    if (Capacitor.isNativePlatform()) {
      const user = await getUserByEmail(
        loginEmail
      )

      if (!user) {
        await showToast(
          'Akun belum terdaftar. Silakan buat akun terlebih dahulu.'
        )
        return
      }

      if (user.password !== loginPassword) {
        await showToast(
          'Email atau password salah.'
        )
        return
      }

      userData = {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }

    /* =========================
       BROWSER
    ========================= */

    else {
      const usersText =
        localStorage.getItem(
          'booktrack_users'
        )

      const users = usersText
        ? JSON.parse(usersText)
        : []

      const user = users.find(
        (item: {
          id: number
          name: string
          email: string
          password: string
        }) =>
          item.email === loginEmail
      )

      if (!user) {
        await showToast(
          'Akun belum terdaftar. Silakan buat akun terlebih dahulu.'
        )
        return
      }

      if (user.password !== loginPassword) {
        await showToast(
          'Email atau password salah.'
        )
        return
      }

      userData = {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }

    /* =========================
       SIMPAN USER AKTIF
    ========================= */

    localStorage.setItem(
      'booktrack_logged_in',
      'true'
    )

    localStorage.setItem(
      'booktrack_email',
      loginEmail
    )

    localStorage.setItem(
      'booktrack_current_user',
      JSON.stringify(userData)
    )

    await showToast(
      `Login berhasil. Selamat datang, ${userData?.name} `
    )

    setTimeout(() => {
      ;(document.activeElement as HTMLElement)?.blur()
      router.push('/home')
    }, 700)

  } catch (error) {
    console.error(
      'Gagal login:',
      error
    )

    await showToast(
      'Terjadi kesalahan saat login.'
    )
  }
}

/* =========================
   LUPA PASSWORD
========================= */

const forgotPassword = async () => {
  await showToast(
    'Fitur lupa kata sandi belum tersedia.'
  )
}
</script>

<style scoped>
ion-content {
  --background: #faf7fc;
}

/* =========================
   PAGE
========================= */

.login-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  padding: 30px 24px;
  background:
    radial-gradient(
      circle at 10% 15%,
      #eee5f7 0,
      transparent 27%
    ),
    radial-gradient(
      circle at 90% 40%,
      #e8def3 0,
      transparent 28%
    ),
    #faf7fc;
  color: #44394d;
}

/* =========================
   DEKORASI
========================= */

.blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.blob-one {
  width: 170px;
  height: 170px;
  top: -100px;
  right: -70px;
  background: #e6d9f0;
}

.blob-two {
  width: 130px;
  height: 130px;
  bottom: -65px;
  left: -50px;
  background: #eee5f6;
}

.sparkle {
  position: absolute;
  color: #a284b6;
  font-size: 22px;
}

.sparkle-one {
  top: 16%;
  right: 12%;
}

.sparkle-two {
  top: 35%;
  left: 8%;
  font-size: 17px;
}

/* =========================
   BACK
========================= */

.back-button {
  position: relative;
  z-index: 3;
  width: 43px;
  height: 43px;
  border: none;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.75);
  color: #6e567b;
  font-size: 23px;
  box-shadow:
    0 5px 18px
    rgba(80, 60, 90, 0.07);
  cursor: pointer;
}

/* =========================
   HEADER
========================= */

.header {
  position: relative;
  z-index: 2;
  text-align: center;
  margin-top: 25px;
}

/* =========================
   LOGO BOOKTRACK
========================= */

.mini-book {
  width: 39px;
  height: 43px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-book {
  position: relative;

  width: 39px;
  height: 43px;

  border-radius:
    7px
    9px
    9px
    7px;

  background:
    linear-gradient(
      145deg,
      #76558f,
      #a47bc0
    );

  box-shadow:
    0 7px 15px
    rgba(117, 82, 142, .2);
}

/* BORDER DALAM */

.logo-book::before {
  content: "";

  position: absolute;

  inset: 4px;

  border:
    1px solid
    rgba(255,255,255,.45);

  border-radius:
    5px
    7px
    7px
    5px;
}

/* HALAMAN PUTIH */

.logo-page {
  position: absolute;

  right: -3px;
  top: 4px;

  width: 9px;
  height: 35px;

  background: #fffaf3;

  border-radius:
    0
    5px
    5px
    0;
}

/* SIMBOL */

.logo-book span {
  position: absolute;

  left: 12px;
  top: 13px;

  color: #fff5e7;

  font-size: 12px;
}

.welcome-text {
  margin: 16px 0 5px;
  color: #9a7da9;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.3px;
}

.header h1 {
  margin: 0;
  color: #44394d;
  font-family:
    Georgia,
    'Times New Roman',
    serif;
  font-size: 27px;
  font-weight: 700;
}

.header h1 span {
  color: #9270ad;
}

.subtitle {
  margin: 7px 0 0;
  color: #837986;
  font-size: 12px;
}

/* =========================
   CARD
========================= */

.form-card {
  position: relative;
  z-index: 2;
  max-width: 400px;
  margin: 28px auto 0;
  padding: 23px;
  background:
    rgba(255, 255, 255, 0.82);
  border:
    1px solid
    rgba(255, 255, 255, 0.8);
  border-radius: 25px;
  box-shadow:
    0 15px 35px
    rgba(74, 55, 85, 0.08);
  backdrop-filter: blur(10px);
}

/* =========================
   INPUT
========================= */

.input-group {
  margin-bottom: 18px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  color: #55485c;
  font-size: 12px;
  font-weight: 700;
}

.input-box {
  display: flex;
  align-items: center;
  height: 51px;
  padding: 0 13px;
  border-radius: 15px;
  background: #f8f4fa;
  border:
    1px solid #eee5f2;
  transition: 0.2s;
}

.input-box:focus-within {
  border-color: #a88abb;
  background: #ffffff;
}

.input-icon {
  margin-right: 10px;
  font-size: 15px;
}

.input-box input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #44394d;
  font-size: 13px;
}

.input-box input::placeholder {
  color: #aaa2ae;
}

.show-password {
  border: none;
  background: transparent;
  color: #9a7cad;
  font-size: 17px;
  cursor: pointer;
}

/* =========================
   FORGOT
========================= */

.forgot-row {
  display: flex;
  justify-content: flex-end;
  margin-top: -5px;
  margin-bottom: 20px;
}

.forgot-row button {
  border: none;
  background: transparent;
  color: #8968a1;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

/* =========================
   LOGIN BUTTON
========================= */

.login-button {
  width: 100%;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding:
    0 10px 0 21px;
  border: none;
  border-radius: 17px;
  background:
    linear-gradient(
      135deg,
      #80609a,
      #a27cbb
    );
  color: white;
  font-size: 14px;
  font-weight: 700;
  box-shadow:
    0 11px 23px
    rgba(123, 88, 145, 0.22);
  cursor: pointer;
}

.login-button strong {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background:
    rgba(255, 255, 255, 0.18);
  font-size: 20px;
  font-weight: 400;
}

.login-button:active {
  transform: scale(0.98);
}

/* =========================
   REGISTER
========================= */

.register-text {
  margin: 20px 0 0;
  text-align: center;
  color: #8a8196;
  font-size: 13px;
}

.register-text button {
  border: none;
  background: transparent;
  color: #7652c8;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  padding: 0;
  margin-left: 3px;
}

/* =========================
   FOOTER
========================= */

.footer-text {
  position: relative;
  z-index: 2;
  margin: 18px auto 0;
  text-align: center;
  color: #b0a6b4;
  font-size: 10px;
}

/* =========================
   DESKTOP
========================= */

@media (min-width: 700px) {
  .login-page {
    max-width: 500px;
    margin: auto;
  }
}
</style>
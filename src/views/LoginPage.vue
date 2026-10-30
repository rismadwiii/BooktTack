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

          <!-- LOGO BUKU -->
          <div class="login-logo">
            <div class="logo-book">
              <div class="logo-page"></div>
              <span>❧</span>
            </div>
          </div>

          <p class="welcome-text">
            SELAMAT DATANG KEMBALI
          </p>

          <h1>
            Masuk ke <span>BookTrack</span>
          </h1>

          <p class="subtitle">
            Lanjutkan perjalanan membaca kamu bersama BookTrack.
          </p>

        </div>

        <!-- Login Card -->
        <div class="login-card">

          <!-- Email -->
          <div class="input-group">
            <label>Email</label>

            <div class="input-box">
              <span class="input-icon">✉</span>

              <input
                v-model="email"
                type="email"
                placeholder="Masukkan email"
                autocomplete="email"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="input-group">
            <label>Password</label>

            <div class="input-box">
              <span class="input-icon">🔒</span>

              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Masukkan password"
                autocomplete="current-password"
              />

              <button
                class="show-password"
                type="button"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Sembunyikan' : 'Lihat' }}
              </button>
            </div>
          </div>

          <!-- Error -->
          <p
            v-if="errorMessage"
            class="error-message"
          >
            {{ errorMessage }}
          </p>

          <!-- Tombol Login -->
          <button
            class="login-button"
            type="button"
            @click="login"
          >
            <span>Masuk ke BookTrack</span>
            <span class="login-arrow">→</span>
          </button>

          <!-- Info Akun -->
          <div class="account-info">

            <p class="info-title">
              Akun demo
            </p>

            <p>
              Email:
              <strong>booktrack@gmail.com</strong>
            </p>

            <p>
              Password:
              <strong>123456</strong>
            </p>

          </div>

        </div>

        <!-- Footer -->
        <p class="footer-text">
          Temukan cerita, catat perjalanan bacamu. 
        </p>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { ref } from 'vue'

import {
  IonPage,
  IonContent
} from '@ionic/vue'

import {
  useRouter
} from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')

const showPassword = ref(false)

const errorMessage = ref('')

/* =========================
   KEMBALI
========================= */

const goBack = () => {
  router.push('/welcome')
}

/* =========================
   LOGIN
========================= */

const login = () => {

  errorMessage.value = ''

  const emailBenar =
    'booktrack@gmail.com'

  const passwordBenar =
    '123456'

  if (
    !email.value.trim() ||
    !password.value.trim()
  ) {
    errorMessage.value =
      'Email dan password wajib diisi.'

    return
  }

  if (
    email.value.trim().toLowerCase() !==
      emailBenar ||
    password.value !== passwordBenar
  ) {
    errorMessage.value =
      'Email atau password salah.'

    return
  }

  localStorage.setItem(
    'booktrack_logged_in',
    'true'
  )

  localStorage.setItem(
    'booktrack_email',
    emailBenar
  )

  router.push('/home')
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

  padding: 30px 24px 25px;

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

  pointer-events: none;
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
   BACK BUTTON
========================= */

.back-button {
  position: relative;

  z-index: 3;

  width: 43px;
  height: 43px;

  border: none;

  border-radius: 14px;

  background:
    rgba(255,255,255,0.78);

  color: #6e567b;

  font-size: 23px;

  box-shadow:
    0 5px 18px
    rgba(80,60,90,0.07);

  cursor: pointer;

  -webkit-tap-highlight-color: transparent;
}

/* =========================
   HEADER
========================= */

.header {
  position: relative;

  z-index: 2;

  text-align: center;

  margin-top: 22px;
}

/* =========================
   LOGO BUKU
   SAMA DENGAN
   BOOKTRACKLOGO.VUE
========================= */

.login-logo {
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

/* =========================
   WELCOME TEXT
========================= */

.welcome-text {
  margin: 14px 0 5px;

  color: #9a7da9;

  font-size: 10px;

  font-weight: 800;

  letter-spacing: 1.5px;
}

/* =========================
   TITLE
========================= */

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

/* =========================
   SUBTITLE
========================= */

.subtitle {
  max-width: 310px;

  margin: 8px auto 0;

  color: #837986;

  font-size: 12px;

  line-height: 1.6;
}

/* =========================
   LOGIN CARD
========================= */

.login-card {
  position: relative;

  z-index: 2;

  max-width: 400px;

  margin: 25px auto 0;

  padding: 23px;

  background:
    rgba(255,255,255,0.86);

  border:
    1px solid
    rgba(255,255,255,0.9);

  border-radius: 25px;

  box-shadow:
    0 15px 35px
    rgba(74,55,85,0.08);

  backdrop-filter: blur(10px);
}

/* =========================
   INPUT
========================= */

.input-group {
  margin-bottom: 17px;
}

.input-group label {
  display: block;

  margin: 0 0 7px 3px;

  color: #65566c;

  font-size: 11px;

  font-weight: 700;
}

.input-box {
  width: 100%;
  min-height: 52px;

  display: flex;

  align-items: center;

  padding: 0 12px;

  border:
    1px solid #eee7f0;

  border-radius: 15px;

  background: #ffffff;

  box-sizing: border-box;

  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.input-box:focus-within {
  border-color: #a27cbb;

  box-shadow:
    0 0 0 3px
    rgba(162,124,187,0.10);
}

.input-icon {
  width: 31px;
  height: 31px;

  display: flex;

  align-items: center;
  justify-content: center;

  margin-right: 9px;

  border-radius: 10px;

  background: #f5eff8;

  font-size: 14px;
}

.input-box input {
  flex: 1;

  min-width: 0;

  height: 48px;

  border: none;

  outline: none;

  background: transparent;

  color: #4d4351;

  font-family: inherit;

  font-size: 13px;
}

.input-box input::placeholder {
  color: #b0a6b4;
}

.show-password {
  border: none;

  background: transparent;

  padding: 5px;

  color: #85639b;

  font-size: 9px;

  font-weight: 700;

  cursor: pointer;
}

/* =========================
   ERROR
========================= */

.error-message {
  margin: -3px 2px 14px;

  color: #b45f72;

  font-size: 11px;

  line-height: 1.4;
}

/* =========================
   LOGIN BUTTON
========================= */

.login-button {
  width: 100%;
  height: 54px;

  display: flex;

  align-items: center;

  padding: 0 14px;

  border: none;

  border-radius: 17px;

  background:
    linear-gradient(
      135deg,
      #80609a,
      #a27cbb
    );

  color: #ffffff;

  box-shadow:
    0 11px 23px
    rgba(123,88,145,0.22);

  font-size: 14px;

  font-weight: 700;

  cursor: pointer;

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.login-button:active {
  transform: scale(0.98);
}

.login-button:hover {
  box-shadow:
    0 14px 27px
    rgba(123,88,145,0.27);
}

.login-button span:first-child {
  flex: 1;

  text-align: center;
}

.login-arrow {
  width: 33px;
  height: 33px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 11px;

  background:
    rgba(255,255,255,0.18);

  font-size: 19px;
}

/* =========================
   ACCOUNT INFO
========================= */

.account-info {
  margin-top: 18px;

  padding: 12px 14px;

  border-radius: 14px;

  background: #f8f3fa;

  color: #938899;

  font-size: 9px;

  line-height: 1.5;

  text-align: center;
}

.account-info p {
  margin: 2px 0;
}

.account-info .info-title {
  margin-bottom: 5px;

  color: #80609a;

  font-size: 10px;

  font-weight: 800;
}

.account-info strong {
  color: #695473;

  font-weight: 700;
}

/* =========================
   FOOTER
========================= */

.footer-text {
  position: relative;

  z-index: 2;

  max-width: 300px;

  margin: 17px auto 0;

  text-align: center;

  color: #b0a6b4;

  font-size: 10px;

  line-height: 1.5;
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
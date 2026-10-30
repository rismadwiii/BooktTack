<template>
  <ion-page>
    <ion-content :fullscreen="true" class="register-page">
      <div class="register-container">

        <div class="register-header">
          <button class="back-button" @click="goToLogin">
            ←
          </button>

          <div class="logo-wrapper">
            <BookTrackLogo />
          </div>

          <h1>Buat Akun</h1>
          <p>Daftar untuk mulai menggunakan BookTrack</p>
        </div>

        <div class="register-card">

          <!-- Nama -->
          <div class="input-group">
            <label>Nama</label>
            <div class="input-wrapper">
              <input
                v-model="name"
                type="text"
                placeholder="Masukkan nama kamu"
                autocomplete="name"
              />
            </div>
          </div>

          <!-- Email -->
          <div class="input-group">
            <label>Email</label>
            <div class="input-wrapper">
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
            <div class="input-wrapper">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Minimal 6 karakter"
                autocomplete="new-password"
              />

              <button
                type="button"
                class="password-button"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Sembunyikan' : 'Lihat' }}
              </button>
            </div>
          </div>

          <!-- Konfirmasi Password -->
          <div class="input-group">
            <label>Konfirmasi Password</label>
            <div class="input-wrapper">
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Masukkan ulang password"
                autocomplete="new-password"
              />

              <button
                type="button"
                class="password-button"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                {{ showConfirmPassword ? 'Sembunyikan' : 'Lihat' }}
              </button>
            </div>
          </div>

          <button
            class="register-button"
            :disabled="isLoading"
            @click="register"
          >
            {{ isLoading ? 'Mendaftarkan...' : 'Daftar' }}
          </button>

          <p class="login-text">
            Sudah punya akun?
            <button @click="goToLogin">
              Login
            </button>
          </p>

        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonPage, IonContent, toastController } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { Capacitor } from '@capacitor/core'

import BookTrackLogo from '../components/BookTrackLogo.vue'
import { saveUser, getUserByEmail } from '../services/database'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)

const showToast = async (message: string) => {
  const toast = await toastController.create({
    message,
    duration: 2200,
    position: 'top'
  })

  await toast.present()
}

const goToLogin = () => {
  ;(document.activeElement as HTMLElement)?.blur()
  router.push('/login')
}

const register = async () => {
  const cleanName = name.value.trim()
  const cleanEmail = email.value.trim().toLowerCase()
  const cleanPassword = password.value

  if (!cleanName || !cleanEmail || !cleanPassword || !confirmPassword.value) {
    await showToast('Semua data harus diisi.')
    return
  }

  if (!cleanEmail.includes('@')) {
    await showToast('Masukkan email yang valid.')
    return
  }

  if (cleanPassword.length < 6) {
    await showToast('Password minimal 6 karakter.')
    return
  }

  if (cleanPassword !== confirmPassword.value) {
    await showToast('Konfirmasi password tidak sesuai.')
    return
  }

  isLoading.value = true

  try {
    /*
     * ============================
     * ANDROID / iOS
     * ============================
     */
    if (Capacitor.isNativePlatform()) {
      const existingUser = await getUserByEmail(cleanEmail)

      if (existingUser) {
        await showToast('Email sudah terdaftar. Silakan login.')
        return
      }

      await saveUser(
        cleanName,
        cleanEmail,
        cleanPassword
      )
    }

    /*
     * ============================
     * BROWSER
     * ============================
     *
     * Karena SQLite native belum aktif
     * di browser, akun sementara disimpan
     * di localStorage agar bisa dites.
     */
    else {
      const existingUsersText =
        localStorage.getItem('booktrack_users')

      const existingUsers = existingUsersText
        ? JSON.parse(existingUsersText)
        : []

      const emailExists = existingUsers.some(
        (user: { email: string }) =>
          user.email === cleanEmail
      )

      if (emailExists) {
        await showToast('Email sudah terdaftar. Silakan login.')
        return
      }

      existingUsers.push({
        id: Date.now(),
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword
      })

      localStorage.setItem(
        'booktrack_users',
        JSON.stringify(existingUsers)
      )
    }

    await showToast('Akun berhasil dibuat. Silakan login.')

    setTimeout(() => {
      router.push('/login')
    }, 800)

  } catch (error) {
    console.error('Gagal membuat akun:', error)
    await showToast('Gagal membuat akun. Silakan coba lagi.')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-page {
  --background: #f8f5ff;
}

.register-container {
  min-height: 100%;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 28px 22px 40px;
  box-sizing: border-box;
}

.register-header {
  position: relative;
  text-align: center;
  padding-top: 8px;
  margin-bottom: 28px;
}

.back-button {
  position: absolute;
  left: 0;
  top: 4px;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 14px;
  background: #ffffff;
  color: #6846b8;
  font-size: 24px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 5px 18px rgba(83, 58, 140, 0.08);
}

.logo-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.register-header h1 {
  margin: 0;
  color: #342354;
  font-size: 28px;
  font-weight: 800;
}

.register-header p {
  margin: 8px 0 0;
  color: #817694;
  font-size: 14px;
}

.register-card {
  background: #ffffff;
  border-radius: 26px;
  padding: 24px 20px;
  box-shadow: 0 12px 35px rgba(86, 60, 145, 0.09);
}

.input-group {
  margin-bottom: 18px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  color: #44345e;
  font-size: 14px;
  font-weight: 700;
}

.input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 52px;
  background: #f8f6fc;
  border: 1px solid #eee8f8;
  border-radius: 15px;
  overflow: hidden;
  box-sizing: border-box;
}

.input-wrapper:focus-within {
  border-color: #9b7bd6;
  box-shadow: 0 0 0 3px rgba(155, 123, 214, 0.12);
}

.input-wrapper input {
  flex: 1;
  width: 100%;
  height: 52px;
  padding: 0 14px;
  border: none;
  outline: none;
  background: transparent;
  color: #35264d;
  font-size: 14px;
}

.input-wrapper input::placeholder {
  color: #aaa1b8;
}

.password-button {
  flex-shrink: 0;
  padding: 0 13px;
  border: none;
  background: transparent;
  color: #7655bc;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.register-button {
  width: 100%;
  height: 52px;
  margin-top: 8px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #7652c8, #9470dc);
  color: white;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(118, 82, 200, 0.22);
}

.register-button:disabled {
  opacity: 0.6;
}

.login-text {
  margin: 20px 0 0;
  text-align: center;
  color: #8a8196;
  font-size: 13px;
}

.login-text button {
  border: none;
  background: transparent;
  color: #7652c8;
  font-weight: 800;
  cursor: pointer;
  padding: 0;
  margin-left: 3px;
}
</style>
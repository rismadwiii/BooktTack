<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="welcome-page">

        <!-- LOGO + NAMA -->
        <div class="welcome-brand">

          <div class="welcome-logo">
            <BookTrackLogo />
          </div>

          <h1>BookTrack</h1>
        </div>
        <p class="tagline">
          Temukan cerita, catat perjalanan bacamu. 
        </p>

        <button
          class="start-button"
          @click="goToLogin"
        >
          Mulai Sekarang
          <span>→</span>
        </button>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import {
  IonPage,
  IonContent
} from '@ionic/vue'

import {
  useRouter
} from 'vue-router'

import BookTrackLogo from '../components/BookTrackLogo.vue'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}

</script>

<style scoped>

ion-content {
  --background: #faf7fc;
}

.welcome-page {
  min-height: 100vh;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 30px;

  text-align: center;

  background:
    radial-gradient(
      circle at 20% 20%,
      #eee4f6,
      transparent 30%
    ),
    radial-gradient(
      circle at 90% 80%,
      #f1e3ec,
      transparent 30%
    ),
    #faf7fc;
}

/* =========================
   LOGO + NAMA
   ========================= */

.welcome-brand {
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-bottom: 4px;
}

/* Logo menggunakan logo yang sama
   dengan Home */
.welcome-logo {
  width: 45px;
  height: 45px;

  display: flex;
  align-items: center;
  justify-content: flex-start;

  overflow: hidden;
}

.welcome-logo :deep(*) {
  flex-shrink: 0;
}

/* Nama aplikasi */
.welcome-brand h1 {
  margin: 10px 0 0;

  font-family: Georgia, serif;

  font-size: 27px;
  font-weight: 700;

  color: #493c52;

  line-height: 1;
}

/* =========================
   TAGLINE
   ========================= */

.tagline {
  max-width: 280px;

  margin: 0 0 30px;

  color: #897d8e;

  font-size: 14px;

  line-height: 1.6;
}

/* =========================
   BUTTON
   ========================= */

.start-button {
  width: 230px;
  height: 54px;

  border: none;

  border-radius: 17px;

  background:
    linear-gradient(
      135deg,
      #80609a,
      #a47cbb
    );

  color: white;

  font-size: 14px;

  font-weight: 700;

  box-shadow:
    0 10px 25px
    rgba(120, 85, 140, 0.22);

  cursor: pointer;
}

.start-button span {
  margin-left: 10px;

  font-size: 18px;
}

.start-button:active {
  transform: scale(0.98);
}

</style>
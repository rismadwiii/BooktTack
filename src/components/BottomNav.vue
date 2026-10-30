<template>
  <nav class="bottom-nav">
    <button
      class="nav-item"
      :class="{ active: route.path === '/home' }"
      type="button"
      @click="goTo('/home')"
    >
      <span class="nav-icon">⌂</span>
      <small>Home</small>
    </button>

    <button
      class="nav-item"
      :class="{ active: route.path === '/search' }"
      type="button"
      @click="goTo('/search')"
    >
      <span class="nav-icon">⌕</span>
      <small>Cari</small>
    </button>

    <button
      class="nav-item"
      :class="{
        active:
          route.path === '/my-books' ||
          route.path === '/progress'
      }"
      type="button"
      @click="goTo('/my-books')"
    >
      <span class="nav-icon">
        <ion-icon :icon="bookOutline" />
      </span>
      <small>Buku</small>
    </button>

    <button
      class="nav-item"
      :class="{ active: route.path === '/wishlist' }"
      type="button"
      @click="goTo('/wishlist')"
    >
      <span class="nav-icon">♡</span>
      <small>Wishlist</small>
    </button>

    <button
      class="nav-item"
      :class="{ active: route.path === '/profile' }"
      type="button"
      @click="goTo('/profile')"
    >
      <span class="nav-icon">♙</span>
      <small>Profil</small>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { bookOutline } from 'ionicons/icons'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const goTo = (path: string) => {
  if (route.path !== path) {
    router.push(path)
  }
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  z-index: 1000;

  left: 50%;
  bottom: 0;
  transform: translateX(-50%);

  width: 100%;
  max-width: 500px;

  height: calc(68px + env(safe-area-inset-bottom));

  border-radius: 24px 24px 0 0;
  border: 1px solid #eee6f0;
  border-bottom: none;

  background: rgba(255, 255, 255, 0.97);

  box-shadow:
    0 -6px 25px rgba(60, 45, 70, 0.10);

  display: flex;
  justify-content: space-around;
  align-items: center;

  box-sizing: border-box;

  padding: 0 0 env(safe-area-inset-bottom);

  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}

.nav-item {
  width: 20%;
  height: 68px;

  padding: 7px 0 3px;

  border: 0;
  outline: none;

  background: transparent;

  color: #aaa2ad;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 3px;

  font-family: inherit;

  -webkit-tap-highlight-color: transparent;
}

.nav-icon {
  width: 30px;
  height: 30px;

  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;
  line-height: 1;
}

.nav-icon ion-icon {
  font-size: 21px;
}

.nav-item small {
  font-size: 8px;
  font-weight: 600;
  line-height: 1;
}

.nav-item.active {
  color: #76558f;
}

.nav-item.active .nav-icon {
  background: #eee5f4;
}

.nav-item:active {
  transform: scale(0.96);
}
</style>
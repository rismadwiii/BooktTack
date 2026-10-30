<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="page">

        <!-- Header -->
        <header class="header">
          <BookTrackLogo />

          <button
            class="profile-button"
            type="button"
            @click="goToProfile"
            aria-label="Buka profil"
          >
            <span>{{ userInitial }}</span>
          </button>
        </header>

        <!-- Greeting -->
        <section class="greeting">
          <p class="eyebrow">SELAMAT MEMBACA ✦</p>

          <h1>
            Temukan cerita<br />
            untuk harimu.
          </h1>

          <p class="subtitle">
            Pilih buku yang ingin kamu baca dan nikmati perjalananmu.
          </p>
        </section>

        <!-- Search -->
        <button
          class="search-box"
          type="button"
          @click="goToSearch"
        >
          <span class="search-icon">⌕</span>
          <span>Cari buku, penulis, atau genre...</span>
        </button>

        <!-- Hero -->
        <section class="hero-card">
          <div class="hero-content">
            <span class="hero-label">PILIHAN UNTUKMU</span>

            <h2>
              Temukan buku<br />
              favoritmu
            </h2>

            <p>
              Jelajahi berbagai cerita dan temukan bacaan yang sesuai
              dengan mood kamu hari ini.
            </p>

            <button
              class="hero-button"
              type="button"
              @click="goToSearch"
            >
              Jelajahi Buku
              <span>→</span>
            </button>
          </div>

          <div class="hero-decoration">
            <div class="book-shape">
              <div class="book-page"></div>
            </div>

            <span class="sparkle one">✦</span>
            <span class="sparkle two">✧</span>
            <span class="sparkle three">·</span>
          </div>
        </section>

        <!-- Continue Reading -->
        <section class="section">
          <div class="section-header">
            <div>
              <p class="section-label">LANJUT MEMBACA</p>
              <h2>Perjalanan bacamu</h2>
            </div>

            <button
              type="button"
              class="see-all"
              @click="goToProgress"
            >
              Lihat semua
            </button>
          </div>

          <div
            v-if="continueBook"
            class="continue-card"
            @click="goToReader(continueBook)"
          >
            <div class="mini-cover">
              <img
                v-if="continueBook.thumbnail"
                :src="continueBook.thumbnail"
                :alt="continueBook.title"
              />

              <div
                v-else
                class="cover-decoration"
              >
                ❧
              </div>
            </div>

            <div class="continue-info">
              <span class="continue-category">
                SEDANG DIBACA
              </span>

              <h3>
                {{ continueBook.title }}
              </h3>

              <p>
                {{ continueBook.currentPage || 0 }}
                dari
                {{ continueBook.pages || '?' }}
                halaman
              </p>

              <div class="progress-row">
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{
                      width: `${getProgressPercent(continueBook.progress)}%`
                    }"
                  ></div>
                </div>

                <span>
                  {{ getProgressPercent(continueBook.progress) }}%
                </span>
              </div>
            </div>
          </div>

          <div
            v-else
            class="continue-card empty-continue"
            @click="goToSearch"
          >
            <div class="mini-cover">
              <div class="cover-decoration">
                ❧
              </div>
            </div>

            <div class="continue-info">
              <span class="continue-category">
                MULAI MEMBACA
              </span>

              <h3>
                Belum ada buku
              </h3>

              <p>
                Cari buku dan mulai perjalanan membacamu.
              </p>
            </div>
          </div>
        </section>

        <!-- Recommendations -->
        <section class="section">
          <div class="section-header">
            <div>
              <p class="section-label">REKOMENDASI BUKU</p>
              <h2>Mungkin kamu suka</h2>
            </div>

            <button
              type="button"
              class="see-all"
              @click="goToSearch"
            >
              Lihat semua
            </button>
          </div>

          <div
            v-if="loadingRecommendations"
            class="loading-state"
          >
            <div class="loading-spinner"></div>
            <p>Mencari rekomendasi buku...</p>
          </div>

          <div
            v-else-if="recommendations.length"
            class="book-grid"
          >
            <button
              v-for="book in recommendations"
              :key="book.id"
              class="book-card"
              type="button"
              @click="openBook(book)"
            >
              <div class="book-cover">
                <img
                  v-if="book.thumbnail"
                  :src="book.thumbnail"
                  :alt="book.title"
                />

                <div
                  v-else
                  class="no-cover"
                >
                  <span>📖</span>
                </div>
              </div>

              <div class="book-info">
                <h3>{{ book.title }}</h3>

                <p>
                  {{ book.authors.join(', ') }}
                </p>

                <div class="rating">
                  <span>★</span>

                  <span>
                    {{
                      book.rating > 0
                        ? book.rating.toFixed(1)
                        : '—'
                    }}
                  </span>
                </div>
              </div>
            </button>
          </div>

          <div
            v-else
            class="empty-state"
          >
            <span>📚</span>

            <p>
              Rekomendasi buku belum tersedia.
            </p>

            <button
              type="button"
              @click="goToSearch"
            >
              Cari Buku
            </button>
          </div>
        </section>

        <!-- Mood -->
        <section class="section mood-section">
          <div class="section-header">
            <div>
              <p class="section-label">
                MOOD MEMBACA HARI INI
              </p>

              <h2>
                Hari ini kamu ingin...
              </h2>
            </div>
          </div>

          <div class="mood-grid">
            <button
              type="button"
              class="mood-card lavender"
              @click="searchByMood('romance')"
            >
              <span>♡</span>
              <strong>Jatuh cinta</strong>
              <small>Romantis & hangat</small>
            </button>

            <button
              type="button"
              class="mood-card peach"
              @click="searchByMood('fantasy')"
            >
              <span>✦</span>
              <strong>Berkhayal</strong>
              <small>Fantasy & magical</small>
            </button>

            <button
              type="button"
              class="mood-card sage"
              @click="searchByMood('motivasi')"
            >
              <span>☀</span>
              <strong>Semangat</strong>
              <small>Inspiratif & motivasi</small>
            </button>

            <button
              type="button"
              class="mood-card rose"
              @click="searchByMood('novel')"
            >
              <span>☁</span>
              <strong>Santai</strong>
              <small>Ringan & menyenangkan</small>
            </button>
          </div>
        </section>

      </div>

      <BottomNav />

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  onIonViewWillEnter
} from '@ionic/vue'

import {
  onMounted,
  ref,
  computed
} from 'vue'

import { useRouter } from 'vue-router'

import BookTrackLogo from '../components/BookTrackLogo.vue'
import BottomNav from '../components/BottomNav.vue'

import {
  searchBooks,
  type Book
} from '../services/bookApi'

import {
  getCollection,
  getAllReadingProgress
} from '../services/database'

const router = useRouter()

/* =========================
   USER PROFILE
========================= */

const currentUser = computed(() => {
  try {
    const userText = localStorage.getItem(
      'booktrack_current_user'
    )

    if (!userText) {
      return null
    }

    return JSON.parse(userText)
  } catch (error) {
    console.error(
      'Gagal membaca data profil:',
      error
    )

    return null
  }
})

const userInitial = computed(() => {
  const name = currentUser.value?.name?.trim()

  return name
    ? name.charAt(0).toUpperCase()
    : 'U'
})

/* =========================
   RECOMMENDATIONS
========================= */

const recommendations = ref<Book[]>([])
const loadingRecommendations = ref(false)

/* =========================
   CONTINUE READING
========================= */

const continueBook = ref<any>(null)

/* =========================
   FORMAT PROGRESS
========================= */

const getProgressPercent = (value: any): number => {
  const numberValue = Number(value)

  if (!Number.isFinite(numberValue)) {
    return 0
  }

  return Math.min(
    100,
    Math.max(
      0,
      Math.round(numberValue)
    )
  )
}

const getCurrentUserId = (): number | null => {
  const user = currentUser.value

  if (!user?.id) {
    return null
  }

  const userId = Number(user.id)

  return Number.isFinite(userId)
    ? userId
    : null
}

/* =========================
   LOAD CONTINUE BOOK
========================= */

const loadContinueBook = async () => {
  continueBook.value = null

  const userId = getCurrentUserId()

  if (!userId) {
    loadContinueBookFromLocalStorage()
    return
  }

  try {
    const progressList =
      await getAllReadingProgress(userId)

    const collection =
      await getCollection(userId)

    if (
      Array.isArray(progressList) &&
      progressList.length > 0 &&
      Array.isArray(collection) &&
      collection.length > 0
    ) {
      const readingBooks =
        collection.filter(
          (book: any) =>
            book.status === 'reading'
        )

      if (readingBooks.length > 0) {
        const sortedProgress =
          [...progressList].sort(
            (a: any, b: any) => {
              const timeA =
                new Date(
                  a.last_read_at || 0
                ).getTime()

              const timeB =
                new Date(
                  b.last_read_at || 0
                ).getTime()

              return timeB - timeA
            }
          )

        for (
          const progress
          of sortedProgress
        ) {
          const matchedBook =
            readingBooks.find(
              (book: any) =>
                String(book.id) ===
                String(progress.book_id)
            )

          if (matchedBook) {
            continueBook.value = {
              ...matchedBook,

              currentPage:
                Number(
                  progress.current_page || 0
                ),

              progress:
                getProgressPercent(
                  progress.progress
                ),

              last_read_at:
                progress.last_read_at || null
            }

            return
          }
        }
      }
    }

    if (
      Array.isArray(collection) &&
      collection.length > 0
    ) {
      const readingBook =
        collection.find(
          (book: any) =>
            book.status === 'reading'
        )

      if (readingBook) {
        continueBook.value = {
          ...readingBook,

          currentPage:
            Number(
              readingBook.currentPage || 0
            ),

          progress:
            getProgressPercent(
              readingBook.progress
            )
        }

        return
      }
    }

    continueBook.value = null

  } catch (error) {
    console.error(
      'Gagal mengambil buku terakhir dibaca dari SQLite:',
      error
    )

    loadContinueBookFromLocalStorage()
  }
}

/* =========================
   LOCAL STORAGE FALLBACK
========================= */

const loadContinueBookFromLocalStorage = () => {
  const savedCollection =
    localStorage.getItem(
      'booktrack_collection'
    )

  if (!savedCollection) {
    continueBook.value = null
    return
  }

  try {
    const collection =
      JSON.parse(savedCollection)

    if (!Array.isArray(collection)) {
      continueBook.value = null
      return
    }

    const readingBooks =
      collection.filter(
        (book: any) =>
          book.status === 'reading'
      )

    if (readingBooks.length > 0) {
      const sortedBooks =
        [...readingBooks].sort(
          (a: any, b: any) => {
            const dateA =
              new Date(
                a.lastReadAt ||
                a.last_read_at ||
                0
              ).getTime()

            const dateB =
              new Date(
                b.lastReadAt ||
                b.last_read_at ||
                0
              ).getTime()

            return dateB - dateA
          }
        )

      continueBook.value =
        sortedBooks[0]
    } else {
      continueBook.value = null
    }

  } catch (error) {
    console.error(
      'Gagal membaca koleksi:',
      error
    )

    continueBook.value = null
  }
}

/* =========================
   RECOMMENDATIONS
========================= */

const loadRecommendations = async () => {
  loadingRecommendations.value = true

  try {
    const books =
      await searchBooks('novel')

    recommendations.value =
      books.slice(0, 6)

  } catch (error) {
    console.error(
      'Gagal mengambil rekomendasi:',
      error
    )

    recommendations.value = []

  } finally {
    loadingRecommendations.value = false
  }
}

/* =========================
   NAVIGATION
========================= */

const openBook = (book: Book) => {
  router.push(
    `/book/${encodeURIComponent(book.id)}`
  )
}

const goToSearch = () => {
  router.push('/search')
}

const goToProfile = () => {
  router.push('/profile')
}

const goToProgress = () => {
  router.push('/progress')
}

const goToReader = (book: any) => {
  if (!book?.id) return

  router.push(
    `/reader/${encodeURIComponent(
      String(book.id)
    )}`
  )
}

const searchByMood = (mood: string) => {
  router.push({
    path: '/search',
    query: {
      q: mood
    }
  })
}

/* =========================
   REFRESH HOME
========================= */

const refreshHome = async () => {
  await loadContinueBook()
}

/* =========================
   INITIAL LOAD
========================= */

onMounted(async () => {
  await loadContinueBook()
  await loadRecommendations()
})

/* =========================
   HOME ENTER
========================= */

onIonViewWillEnter(async () => {
  await refreshHome()
})
</script>

<style scoped>
.page {
  width: 100%;
  max-width: 500px;
  min-height: 100%;
  margin: 0 auto;

  padding:
    calc(42px + env(safe-area-inset-top))
    18px
    calc(110px + env(safe-area-inset-bottom));

  box-sizing: border-box;

  background: #fcf9f7;
  color: #39313d;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.profile-button {
  width: 42px;
  height: 42px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  border: none;
  border-radius: 50%;

  background:
    linear-gradient(
      145deg,
      #806093,
      #a982ba
    );

  color: white;

  font-family: Georgia, serif;

  font-size: 18px;
  font-weight: 700;

  box-shadow:
    0 9px 20px
    rgba(
      110,
      75,
      130,
      0.18
    );

  cursor: pointer;

  -webkit-tap-highlight-color: transparent;
}

.profile-button:active {
  transform: scale(0.96);
}

.greeting {
  margin-bottom: 20px;
}

.eyebrow,
.section-label {
  margin: 0 0 7px;

  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.6px;

  color: #a07db6;
}

.greeting h1 {
  margin: 0;

  color: #46344f;

  font-family: Georgia, serif;
  font-size: 31px;
  line-height: 1.15;
  font-weight: 700;
}

.subtitle {
  margin: 11px 0 0;

  max-width: 330px;

  color: #99919c;

  font-size: 13px;
  line-height: 1.6;
}

.search-box {
  width: 100%;
  height: 51px;

  margin-bottom: 20px;
  padding: 0 16px;

  border: 1px solid #eee6f0;
  border-radius: 17px;

  background: #fff;
  color: #a39ba5;

  display: flex;
  align-items: center;
  gap: 11px;

  text-align: left;
  font-size: 12px;

  box-shadow:
    0 5px 18px
    rgba(70, 50, 80, 0.04);
}

.search-icon {
  font-size: 25px;
  color: #76558f;
  line-height: 1;
}

.hero-card {
  position: relative;

  min-height: 218px;

  overflow: hidden;

  padding: 24px;

  box-sizing: border-box;

  border-radius: 27px;

  background:
    linear-gradient(
      135deg,
      #eee4f4 0%,
      #e3d3eb 100%
    );

  box-shadow:
    0 10px 28px
    rgba(90, 60, 105, 0.10);
}

.hero-content {
  position: relative;
  z-index: 2;

  width: 68%;
}

.hero-label {
  display: inline-block;

  margin-bottom: 8px;

  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.3px;

  color: #89639d;
}

.hero-content h2 {
  margin: 0;

  color: #503c5b;

  font-family: Georgia, serif;
  font-size: 25px;
  line-height: 1.15;
}

.hero-content p {
  margin: 9px 0 14px;

  color: #7f7185;

  font-size: 10px;
  line-height: 1.5;
}

.hero-button {
  padding: 9px 14px;

  border: 0;
  border-radius: 12px;

  background: #76558f;
  color: #fff;

  font-size: 10px;
  font-weight: 600;

  box-shadow:
    0 5px 14px
    rgba(88, 60, 105, 0.18);
}

.hero-button span {
  margin-left: 5px;
}

.hero-decoration {
  position: absolute;

  right: -5px;
  top: 0;

  width: 38%;
  height: 100%;
}

.book-shape {
  position: absolute;

  right: 24px;
  top: 43px;

  width: 83px;
  height: 111px;

  border-radius: 9px 13px 13px 9px;

  background:
    linear-gradient(
      145deg,
      #76558f,
      #a57cbd
    );

  transform: rotate(7deg);

  box-shadow:
    9px 13px 22px
    rgba(78, 54, 92, 0.17);
}

.book-shape::before {
  content: "";

  position: absolute;

  inset: 7px;

  border:
    1px solid
    rgba(255, 255, 255, 0.38);

  border-radius:
    6px 9px 9px 6px;
}

.book-page {
  position: absolute;

  right: -5px;
  top: 6px;

  width: 14px;
  height: 98px;

  border-radius:
    0 7px 7px 0;

  background: #fff9f1;
}

.book-page::after {
  content: "❧";

  position: absolute;

  top: 35px;
  left: -45px;

  color: #f7e9db;

  font-size: 20px;
}

.sparkle {
  position: absolute;

  color: #fff;
  opacity: 0.8;
}

.sparkle.one {
  top: 27px;
  right: 78px;

  font-size: 14px;
}

.sparkle.two {
  top: 73px;
  right: 8px;

  font-size: 12px;
}

.sparkle.three {
  bottom: 35px;
  right: 98px;

  font-size: 20px;
}

.section {
  margin-top: 31px;
}

.section-header {
  display: flex;

  justify-content: space-between;
  align-items: flex-end;

  margin-bottom: 15px;
}

.section-header h2 {
  margin: 0;

  color: #493951;

  font-family: Georgia, serif;
  font-size: 20px;
}

.see-all {
  padding: 0;

  border: 0;

  background: transparent;
  color: #87649a;

  font-size: 10px;
  font-weight: 600;
}

.continue-card {
  display: flex;

  gap: 14px;

  padding: 14px;

  border:
    1px solid
    #eee5ef;

  border-radius: 20px;

  background: #fff;

  box-shadow:
    0 6px 20px
    rgba(70, 50, 80, 0.05);

  cursor: pointer;
}

.mini-cover {
  position: relative;

  flex-shrink: 0;

  width: 72px;
  height: 96px;

  overflow: hidden;

  border-radius:
    8px 11px 11px 8px;

  background:
    linear-gradient(
      145deg,
      #b991c8,
      #8c6ba3
    );

  box-shadow:
    5px 7px 13px
    rgba(75, 53, 90, 0.14);
}

.mini-cover img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
}

.mini-cover::after {
  content: "";

  position: absolute;

  inset: 6px;

  border:
    1px solid
    rgba(255, 255, 255, 0.4);

  border-radius:
    5px 8px 8px 5px;

  pointer-events: none;
}

.cover-decoration {
  position: absolute;
  z-index: 2;

  left: 25px;
  top: 34px;

  color: #fff7ee;

  font-size: 19px;
}

.continue-info {
  min-width: 0;

  flex: 1;

  padding-top: 2px;
}

.continue-category {
  color: #a07eaf;

  font-size: 8px;
  font-weight: 700;
  letter-spacing: 1px;
}

.continue-info h3 {
  margin: 6px 0 5px;

  color: #4b3a52;

  font-size: 14px;
  line-height: 1.3;
}

.continue-info p {
  margin: 0 0 13px;

  color: #a29aa5;

  font-size: 10px;
  line-height: 1.4;
}

.progress-row {
  display: flex;

  align-items: center;

  gap: 8px;
}

.progress-bar {
  flex: 1;

  height: 5px;

  overflow: hidden;

  border-radius: 20px;

  background: #eee7f0;
}

.progress-fill {
  height: 100%;

  border-radius: inherit;

  background: #8d6aa5;
}

.progress-row > span {
  color: #806190;

  font-size: 9px;
  font-weight: 700;
}

.book-grid {
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 14px 11px;
}

.book-card {
  min-width: 0;

  padding: 0;

  border: 0;

  background: transparent;

  text-align: left;
}

.book-cover {
  position: relative;

  width: 100%;
  height: 158px;

  overflow: hidden;

  border-radius:
    10px 13px 13px 10px;

  background: #eee7ef;

  box-shadow:
    4px 7px 15px
    rgba(70, 50, 80, 0.09);
}

.book-cover img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
}

.no-cover {
  width: 100%;
  height: 100%;

  display: flex;

  align-items: center;
  justify-content: center;

  background:
    linear-gradient(
      145deg,
      #e5d7eb,
      #cdb8d8
    );
}

.no-cover span {
  font-size: 26px;
}

.book-info {
  padding: 8px 2px 0;
}

.book-info h3 {
  display: -webkit-box;

  overflow: hidden;

  margin: 0 0 4px;

  color: #4b3b52;

  font-size: 11px;
  font-weight: 700;
  line-height: 1.35;

  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.book-info p {
  overflow: hidden;

  margin: 0 0 5px;

  color: #9b939f;

  font-size: 9px;

  white-space: nowrap;
  text-overflow: ellipsis;
}

.rating {
  display: flex;

  align-items: center;

  gap: 3px;

  color: #9b7b35;

  font-size: 9px;
}

.rating span:first-child {
  font-size: 10px;
}

.loading-state {
  min-height: 180px;

  display: flex;

  flex-direction: column;

  justify-content: center;
  align-items: center;

  gap: 10px;

  color: #a49ba7;

  font-size: 11px;
}

.loading-spinner {
  width: 25px;
  height: 25px;

  border:
    3px solid
    #eadff0;

  border-top-color: #86639c;

  border-radius: 50%;

  animation:
    spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  padding: 30px 15px;

  border:
    1px dashed
    #e3d8e6;

  border-radius: 18px;

  background: #fff;

  text-align: center;
}

.empty-state span {
  display: block;

  margin-bottom: 7px;

  font-size: 25px;
}

.empty-state p {
  margin: 0 0 12px;

  color: #9e96a1;

  font-size: 11px;
}

.empty-state button {
  padding: 9px 15px;

  border: 0;
  border-radius: 11px;

  background: #76558f;
  color: white;

  font-size: 10px;
}

.mood-grid {
  display: grid;

  grid-template-columns:
    repeat(2, 1fr);

  gap: 10px;
}

.mood-card {
  min-height: 105px;

  padding: 15px;

  border: 0;
  border-radius: 18px;

  text-align: left;

  display: flex;

  flex-direction: column;

  align-items: flex-start;
  justify-content: center;
}

.mood-card span {
  margin-bottom: 7px;

  font-size: 18px;
}

.mood-card strong {
  margin-bottom: 3px;

  color: #514052;

  font-size: 12px;
}

.mood-card small {
  color: #8f8592;

  font-size: 9px;
}

.mood-card.lavender {
  background: #eee5f4;
}

.mood-card.peach {
  background: #f8e8df;
}

.mood-card.sage {
  background: #e6eee5;
}

.mood-card.rose {
  background: #f2e2e8;
}

@media (max-width: 360px) {
  .page {
    padding-left: 14px;
    padding-right: 14px;
  }

  .greeting h1 {
    font-size: 28px;
  }

  .hero-card {
    padding: 20px;
  }

  .hero-content {
    width: 72%;
  }

  .hero-content h2 {
    font-size: 22px;
  }

  .book-cover {
    height: 145px;
  }
}
</style>
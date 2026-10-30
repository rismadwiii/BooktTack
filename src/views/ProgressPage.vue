<template>
  <ion-page>
    <ion-content :fullscreen="true">

      <div class="page">

        <!-- HEADER -->
        <div class="header">
          <BookTrackLogo />

          <button class="icon-button" @click="goToWishlist">
            <ion-icon :icon="heartOutline"></ion-icon>
          </button>
        </div>


        <!-- INTRO -->
        <section class="intro">
          <span class="label">PROGRESS MEMBACA</span>

          <h1>
            Lihat sejauh mana<br />
            kamu sudah membaca.
          </h1>

          <p>
            Setiap halaman yang kamu baca adalah sebuah langkah.
          </p>
        </section>


        <!-- OVERALL PROGRESS -->
        <section class="overall-card">

          <div class="overall-top">

            <div>
              <span>PROGRESS KESELURUHAN</span>

              <h2>{{ overallProgress }}%</h2>
            </div>

            <div class="circle">
              <ion-icon :icon="bookOutline"></ion-icon>
            </div>

          </div>


          <div class="progress-track">
            <div
              class="progress-fill"
              :style="{ width: overallProgress + '%' }"
            ></div>
          </div>


          <p>
            {{ progressMessage }}
          </p>

        </section>


        <!-- STATISTIK -->
        <div class="stats">

          <button
            class="stat-card"
            @click="goToMyBooks"
          >
            <ion-icon :icon="bookOutline"></ion-icon>

            <strong>{{ readingCount }}</strong>

            <span>Sedang Dibaca</span>
          </button>


          <button
            class="stat-card"
            @click="goToMyBooks"
          >
            <span class="check-icon">✓</span>

            <strong>{{ finishedCount }}</strong>

            <span>Buku Selesai</span>
          </button>


          <button
            class="stat-card"
            @click="goToWishlist"
          >
            <ion-icon :icon="heartOutline"></ion-icon>

            <strong>{{ wishlistCount }}</strong>

            <span>Wishlist</span>
          </button>

        </div>


        <!-- SEDANG DIBACA -->
        <section class="section">

          <div class="section-header">

            <h2>
              <ion-icon :icon="bookOutline"></ion-icon>
              Sedang Dibaca
            </h2>

            <button @click="goToMyBooks">
              Lihat semua
            </button>

          </div>


          <!-- ADA BUKU -->
          <div
            v-if="readingBooks.length > 0"
            class="book-list"
          >

            <div
              v-for="book in readingBooks"
              :key="book.id"
              class="book-card"
            >

              <!-- COVER -->
              <button
                class="cover-button"
                @click="openBook(book.id)"
              >

                <img
                  v-if="book.thumbnail"
                  :src="book.thumbnail"
                  :alt="book.title"
                  class="cover"
                />

                <div
                  v-else
                  class="cover cover-empty"
                >
                  <ion-icon :icon="bookOutline"></ion-icon>
                </div>

              </button>


              <!-- INFO -->
              <div class="book-info">

                <span class="category">
                  {{ getCategory(book) }}
                </span>

                <h3>
                  {{ book.title }}
                </h3>

                <p class="author">
                  {{ getAuthor(book) }}
                </p>


                <div class="page-row">

                  <span>
                    {{ book.currentPage || 0 }}
                    /
                    {{ book.pages || '?' }}
                    halaman
                  </span>

                  <strong>
                    {{ Number(book.progress || 0) }}%
                  </strong>

                </div>


                <div class="small-progress">

                  <div
                    class="small-progress-fill"
                    :style="{
                      width: Number(book.progress || 0) + '%'
                    }"
                  ></div>

                </div>


                <button
                  class="continue-button"
                  @click="openBook(book.id)"
                >
                  Lanjut Membaca
                  <span>→</span>
                </button>

              </div>

            </div>

          </div>


          <!-- KOSONG -->
          <div
            v-else
            class="empty-card"
          >

            <div class="empty-icon">
              <ion-icon :icon="bookOutline"></ion-icon>
            </div>

            <h3>
              Belum ada buku yang sedang dibaca
            </h3>

            <p>
              Cari buku dan tambahkan ke Buku Saya
              untuk mulai mencatat progress membaca.
            </p>

            <button
              class="search-button"
              @click="goToSearch"
            >
              Cari Buku
            </button>

          </div>

        </section>


        <!-- TARGET -->
        <section class="target-card">

          <div class="target-icon">
            <ion-icon :icon="sparklesOutline"></ion-icon>
          </div>

          <div class="target-content">

            <span>TARGET MEMBACA</span>

            <h3>
              {{ finishedCount }}
              dari
              {{ weeklyTarget }}
              buku
            </h3>

            <div class="target-track">

              <div
                class="target-fill"
                :style="{
                  width: targetProgress + '%'
                }"
              ></div>

            </div>

            <p>
              {{ targetMessage }}
            </p>

          </div>

        </section>


        <div class="bottom-space"></div>

      </div>


      <!-- BOTTOM NAV -->
      <nav class="bottom-nav">

        <button
          class="nav-item"
          @click="goToHome"
        >
          <ion-icon :icon="homeOutline"></ion-icon>
          <span>Home</span>
        </button>


        <button
          class="nav-item"
          @click="goToSearch"
        >
          <ion-icon :icon="searchOutline"></ion-icon>
          <span>Cari</span>
        </button>


        <button
          class="nav-item active"
          @click="goToMyBooks"
        >
          <ion-icon :icon="bookOutline"></ion-icon>
          <span>Buku</span>
        </button>


        <button
          class="nav-item"
          @click="goToWishlist"
        >
          <ion-icon :icon="heartOutline"></ion-icon>
          <span>Wishlist</span>
        </button>


        <button
          class="nav-item"
          @click="goToProfile"
        >
          <ion-icon :icon="personOutline"></ion-icon>
          <span>Profil</span>
        </button>

      </nav>

    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">

import {
  IonPage,
  IonContent,
  IonIcon,
  onIonViewWillEnter
} from '@ionic/vue'

import {
  ref,
  computed
} from 'vue'

import {
  useRouter
} from 'vue-router'

import {
  bookOutline,
  homeOutline,
  searchOutline,
  heartOutline,
  personOutline,
  sparklesOutline
} from 'ionicons/icons'

import BookTrackLogo
  from '../components/BookTrackLogo.vue'

import type {
  Book
} from '../services/bookApi'

import {
  getCollection,
  getReadingProgress,
  getWishlist
} from '../services/database'


/* =========================
   ROUTER
========================= */

const router = useRouter()


/* =========================
   TYPE
========================= */

interface CollectionBook extends Book {
  status: 'reading' | 'finished'
  progress: number
  currentPage: number
}


/* =========================
   DATA
========================= */

const collection =
  ref<CollectionBook[]>([])

const wishlist =
  ref<any[]>([])

const weeklyTarget = 5


/* =========================
   CURRENT USER
========================= */

const getCurrentUserId = (): number | null => {

  try {

    const saved =
      localStorage.getItem(
        'booktrack_current_user'
      )

    if (!saved) {
      return null
    }

    const user = JSON.parse(saved)

    const userId =
      Number(user?.id)

    if (!userId || userId <= 0) {
      return null
    }

    return userId

  } catch (error) {

    console.error(
      'Gagal membaca user:',
      error
    )

    return null

  }

}


/* =========================
   LOCAL STORAGE FALLBACK
========================= */

const loadLocalCollection = (): CollectionBook[] => {

  try {

    const data =
      localStorage.getItem(
        'booktrack_collection'
      )

    const parsed =
      data
        ? JSON.parse(data)
        : []

    return Array.isArray(parsed)
      ? parsed
      : []

  } catch (error) {

    console.error(
      'Gagal membaca collection lokal:',
      error
    )

    return []

  }

}


const loadLocalWishlist = (): any[] => {

  try {

    const data =
      localStorage.getItem(
        'booktrack_wishlist'
      )

    const parsed =
      data
        ? JSON.parse(data)
        : []

    return Array.isArray(parsed)
      ? parsed
      : []

  } catch (error) {

    console.error(
      'Gagal membaca wishlist lokal:',
      error
    )

    return []

  }

}


/* =========================
   LOAD COLLECTION
========================= */

const loadCollection = async () => {

  const userId =
    getCurrentUserId()

  /*
   * PRIORITAS SQLITE
   */

  if (userId) {

    try {

      const saved =
        await getCollection(userId)

      if (Array.isArray(saved)) {

        const books =
          await Promise.all(
            saved.map(
              async (item: any) => {

                let progressData: any = null

                try {

                  progressData =
                    await getReadingProgress(
                      userId,
                      String(item.id)
                    )

                } catch {
                  progressData = null
                }

                const pages =
                  Number(
                    item.pages || 0
                  )

                let currentPage =
                  Number(
                    progressData?.current_page ??
                    item.currentPage ??
                    0
                  )

                let progress =
                  Number(
                    progressData?.progress ??
                    item.progress ??
                    0
                  )

                if (
                  !Number.isFinite(
                    currentPage
                  )
                ) {
                  currentPage = 0
                }

                if (
                  !Number.isFinite(
                    progress
                  )
                ) {
                  progress = 0
                }

                if (pages > 0) {

                  currentPage =
                    Math.max(
                      0,
                      Math.min(
                        currentPage,
                        pages
                      )
                    )

                }

                progress =
                  Math.max(
                    0,
                    Math.min(
                      progress,
                      100
                    )
                  )

                return {
                  ...item,

                  id:
                    String(item.id),

                  authors:
                    Array.isArray(item.authors)
                      ? item.authors
                      : item.authors
                        ? String(item.authors)
                            .split(',')
                            .map(
                              (author: string) =>
                                author.trim()
                            )
                        : [],

                  categories:
                    Array.isArray(item.categories)
                      ? item.categories
                      : item.categories
                        ? String(item.categories)
                            .split(',')
                            .map(
                              (category: string) =>
                                category.trim()
                            )
                        : [],

                  pages:
                    pages || undefined,

                  status:
                    item.status === 'finished'
                      ? 'finished'
                      : 'reading',

                  progress,

                  currentPage

                } as CollectionBook

              }
            )
          )

        collection.value = books

        return

      }

    } catch (error) {

      console.error(
        'Gagal memuat collection dari SQLite:',
        error
      )

    }

  }


  /*
   * FALLBACK LOCAL STORAGE
   */

  collection.value =
    loadLocalCollection()

}


/* =========================
   LOAD WISHLIST
========================= */

const loadWishlist = async () => {

  const userId =
    getCurrentUserId()

  /*
   * PRIORITAS SQLITE
   */

  if (userId) {

    try {

      const saved =
        await getWishlist(userId)

      if (Array.isArray(saved)) {

        wishlist.value =
          saved

        return

      }

    } catch (error) {

      console.error(
        'Gagal memuat wishlist dari SQLite:',
        error
      )

    }

  }


  /*
   * FALLBACK LOCAL STORAGE
   */

  wishlist.value =
    loadLocalWishlist()

}


/* =========================
   COMPUTED
========================= */

const readingBooks =
  computed(() => {

    return collection.value.filter(
      book =>
        book.status === 'reading'
    )

  })


const finishedBooks =
  computed(() => {

    return collection.value.filter(
      book =>
        book.status === 'finished'
    )

  })


const readingCount =
  computed(() =>
    readingBooks.value.length
  )


const finishedCount =
  computed(() =>
    finishedBooks.value.length
  )


const wishlistCount =
  computed(() =>
    wishlist.value.length
  )


/* =========================
   OVERALL PROGRESS
========================= */

const overallProgress =
  computed(() => {

    if (
      collection.value.length === 0
    ) {
      return 0
    }

    const total =
      collection.value.reduce(
        (
          sum,
          book
        ) => {

          return (
            sum +
            Number(
              book.progress || 0
            )
          )

        },
        0
      )

    return Math.round(
      total /
      collection.value.length
    )

  })


/* =========================
   PROGRESS MESSAGE
========================= */

const progressMessage =
  computed(() => {

    if (
      collection.value.length === 0
    ) {
      return 'Yuk mulai perjalanan membaca kamu ✨'
    }

    if (
      overallProgress.value >= 100
    ) {
      return 'Semua buku sudah selesai. Keren! ✨'
    }

    return 'Terus lanjutkan membaca, kamu sudah semakin jauh ✨'

  })


/* =========================
   TARGET PROGRESS
========================= */

const targetProgress =
  computed(() => {

    if (
      weeklyTarget <= 0
    ) {
      return 0
    }

    return Math.min(
      100,
      Math.round(
        (
          finishedCount.value /
          weeklyTarget
        ) * 100
      )
    )

  })


const targetMessage =
  computed(() => {

    if (
      finishedCount.value >=
      weeklyTarget
    ) {
      return 'Target membaca kamu sudah tercapai! ✨'
    }

    const remaining =
      weeklyTarget -
      finishedCount.value

    return `Tinggal ${remaining} buku lagi untuk mencapai targetmu.`

  })


/* =========================
   AUTHOR
========================= */

const getAuthor = (
  book: Book
) => {

  if (
    book.authors &&
    book.authors.length > 0
  ) {
    return book.authors.join(', ')
  }

  return 'Penulis tidak diketahui'

}


/* =========================
   CATEGORY
========================= */

const getCategory = (
  book: Book
) => {

  if (
    book.categories &&
    book.categories.length > 0
  ) {

    return book.categories[0]
      .split(' / ')[0]
      .toUpperCase()

  }

  return 'UMUM'

}


/* =========================
   OPEN BOOK
========================= */

const openBook = (
  id: string
) => {

  router.push(
    `/book/${encodeURIComponent(id)}`
  )

}


/* =========================
   NAVIGATION
========================= */

const goToHome = () => {
  router.push('/home')
}


const goToSearch = () => {
  router.push('/search')
}


const goToMyBooks = () => {
  router.push('/my-books')
}


const goToWishlist = () => {
  router.push('/wishlist')
}


const goToProfile = () => {
  router.push('/profile')
}


/* =========================
   REFRESH
========================= */

const refreshData = async () => {

  await loadCollection()

  await loadWishlist()

}


/* =========================
   LIFECYCLE
========================= */

onIonViewWillEnter(() => {

  refreshData()

})

</script>


<style scoped>

* {
  box-sizing: border-box;
}


/* =========================
   PAGE
========================= */

.page {

  width: 100%;
  max-width: 500px;
  min-height: 100%;

  margin: 0 auto;

  padding:
    calc(42px + env(safe-area-inset-top))
    18px
    calc(125px + env(safe-area-inset-bottom));

  background: #fcf9f7;
  color: #39313d;

}


/* =========================
   HEADER
========================= */

.header {

  display: flex;
  align-items: center;
  justify-content: space-between;

}


.icon-button {

  width: 42px;
  height: 42px;

  border: none;
  border-radius: 14px;

  background: white;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #806093;

  font-size: 22px;

  box-shadow:
    0 5px 18px
    rgba(70, 50, 80, .08);

}


.icon-button ion-icon {
  font-size: 21px;
}


/* =========================
   INTRO
========================= */

.intro {
  margin-top: 30px;
}


.label {

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 1.5px;

  color: #9a72aa;

}


.intro h1 {

  margin: 8px 0;

  font-family: Georgia, serif;

  font-size: 27px;

  line-height: 1.15;

  color: #493b4f;

}


.intro p {

  margin: 0;

  font-size: 13px;

  line-height: 1.5;

  color: #968c99;

}


/* =========================
   OVERALL
========================= */

.overall-card {

  margin-top: 22px;

  padding: 20px;

  border-radius: 24px;

  background:
    linear-gradient(
      145deg,
      #eee5f4,
      #f6edf5
    );

}


.overall-top {

  display: flex;

  align-items: center;

  justify-content: space-between;

}


.overall-top span {

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 1px;

  color: #9874a8;

}


.overall-top h2 {

  margin: 5px 0 0;

  font-family: Georgia, serif;

  font-size: 32px;

  color: #684d77;

}


.circle {

  width: 65px;
  height: 65px;

  border-radius: 50%;

  background: white;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #806093;

}


.circle ion-icon {
  font-size: 28px;
}


.progress-track {

  height: 8px;

  margin-top: 17px;

  border-radius: 10px;

  overflow: hidden;

  background: #ddd2e2;

}


.progress-fill {

  height: 100%;

  border-radius: 10px;

  background:
    linear-gradient(
      90deg,
      #806093,
      #a47dbc
    );

  transition:
    width .3s ease;

}


.overall-card p {

  margin:
    10px
    0
    0;

  font-size: 10px;

  color: #8f8394;

}


/* =========================
   STATS
========================= */

.stats {

  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 8px;

  margin-top: 13px;

}


.stat-card {

  min-width: 0;

  padding: 14px 5px;

  border:
    1px solid
    #eee7ef;

  border-radius: 18px;

  background: white;

  text-align: center;

  cursor: pointer;

  box-shadow:
    0 5px 18px
    rgba(70, 50, 80, .05);

}


.stat-card ion-icon {

  display: block;

  margin: auto;

  font-size: 18px;

  color: #9670a6;

}


.stat-card strong {

  display: block;

  margin-top: 5px;

  font-size: 20px;

  color: #59455f;

}


.stat-card span {

  display: block;

  margin-top: 3px;

  font-size: 8px;

  color: #9d939f;

}


.check-icon {

  height: 18px;

  font-size: 18px !important;

  color: #9670a6 !important;

}


/* =========================
   SECTION
========================= */

.section {
  margin-top: 28px;
}


.section-header {

  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 12px;

}


.section-header h2 {

  margin: 0;

  display: flex;

  align-items: center;

  gap: 6px;

  font-size: 17px;

  color: #514255;

}


.section-header h2 ion-icon {

  font-size: 19px;

  color: #806093;

}


.section-header button {

  border: none;

  background: transparent;

  color: #9572a2;

  font-size: 9px;

  font-weight: 600;

}


/* =========================
   BOOK CARD
========================= */

.book-card {

  display: flex;

  gap: 13px;

  padding: 13px;

  margin-bottom: 10px;

  border-radius: 20px;

  background: white;

  box-shadow:
    0 7px 24px
    rgba(70, 50, 80, .07);

}


.cover-button {

  flex-shrink: 0;

  width: 78px;
  height: 108px;

  padding: 0;

  border: none;

  background: transparent;

  cursor: pointer;

}


.cover {

  width: 78px;
  height: 108px;

  display: block;

  object-fit: cover;

  border-radius: 11px;

  background: #eee5f4;

}


.cover-empty {

  display: flex;

  align-items: center;
  justify-content: center;

  color: #806093;

}


.cover-empty ion-icon {
  font-size: 28px;
}


.book-info {

  min-width: 0;

  flex: 1;

}


.category {

  display: block;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 8px;

  font-weight: 700;

  letter-spacing: 1px;

  color: #a277b3;

}


.book-info h3 {

  margin:
    5px
    0
    2px;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 16px;

  color: #514255;

}


.author {

  margin: 0;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 10px;

  color: #a39aa5;

}


.page-row {

  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-top: 13px;

  font-size: 8px;

  color: #918693;

}


.page-row strong {
  color: #806093;
}


.small-progress {

  height: 5px;

  margin-top: 6px;

  border-radius: 10px;

  overflow: hidden;

  background: #eee9ef;

}


.small-progress-fill {

  height: 100%;

  border-radius: 10px;

  background: #9b7aad;

}


.continue-button {

  width: 100%;

  margin-top: 10px;

  padding: 8px;

  border: none;

  border-radius: 10px;

  background: #eee5f4;

  color: #745381;

  font-size: 9px;

  font-weight: 700;

  cursor: pointer;

}


.continue-button span {
  margin-left: 3px;
}


/* =========================
   EMPTY
========================= */

.empty-card {

  padding: 25px 18px;

  border-radius: 21px;

  background: white;

  text-align: center;

  box-shadow:
    0 7px 22px
    rgba(70, 50, 80, .06);

}


.empty-icon {

  width: 52px;
  height: 52px;

  margin:
    0
    auto
    10px;

  border-radius: 17px;

  display: flex;

  align-items: center;
  justify-content: center;

  background: #eee5f4;

  color: #806093;

}


.empty-icon ion-icon {
  font-size: 27px;
}


.empty-card h3 {

  margin: 0;

  font-size: 15px;

  color: #514255;

}


.empty-card p {

  max-width: 260px;

  margin:
    8px
    auto
    15px;

  font-size: 10px;

  line-height: 1.5;

  color: #9b919d;

}


.search-button {

  padding:
    9px
    18px;

  border: none;

  border-radius: 11px;

  background: #806093;

  color: white;

  font-size: 9px;

  font-weight: 700;

  cursor: pointer;

}


/* =========================
   TARGET
========================= */

.target-card {

  display: flex;

  align-items: flex-start;

  gap: 12px;

  margin-top: 18px;

  padding: 16px;

  border-radius: 21px;

  background: #f1ebe4;

}


.target-icon {

  width: 42px;
  height: 42px;

  flex-shrink: 0;

  border-radius: 14px;

  display: flex;

  align-items: center;
  justify-content: center;

  background: white;

  color: #a17b8c;

}


.target-icon ion-icon {
  font-size: 20px;
}


.target-content {
  flex: 1;
}


.target-content > span {

  font-size: 8px;

  font-weight: 700;

  letter-spacing: 1px;

  color: #9a7d68;

}


.target-content h3 {

  margin:
    4px
    0
    8px;

  font-size: 14px;

  color: #594d52;

}


.target-track {

  height: 5px;

  border-radius: 10px;

  overflow: hidden;

  background: #dfd4cb;

}


.target-fill {

  height: 100%;

  border-radius: 10px;

  background: #a98976;

}


.target-content p {

  margin:
    8px
    0
    0;

  font-size: 9px;

  line-height: 1.4;

  color: #93878b;

}


/* =========================
   BOTTOM
========================= */

.bottom-space {
  height: 90px;
}


/* =========================
   BOTTOM NAV
========================= */

.bottom-nav {

  position: fixed;

  z-index: 1000;

  left: 50%;

  bottom: 0;

  transform:
    translateX(-50%);

  width: 100%;

  max-width: 500px;

  height: calc(68px + env(safe-area-inset-bottom));

  border-radius:
    24px
    24px
    0
    0;

  background:
    rgba(
      255,
      255,
      255,
      .97
    );

  border:
    1px solid
    #eee6f0;

  border-bottom: none;

  box-shadow:
    0 -6px 25px
    rgba(60, 45, 70, .10);

  display: flex;

  justify-content:
    space-around;

  align-items: center;

  padding:
    0
    0
    env(safe-area-inset-bottom);

  box-sizing: border-box;

  backdrop-filter:
    blur(15px);

  -webkit-backdrop-filter:
    blur(15px);

}


.nav-item {

  width: 20%;
  height: 68px;

  border: none;

  background: transparent;

  color: #aaa1ae;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 3px;

  cursor: pointer;

}


.nav-item ion-icon {
  font-size: 21px;
}


.nav-item span {

  font-size: 8px;

  font-weight: 600;

}


.nav-item.active {

  color: #825e9d;

}


@media (min-width: 501px) {

  .bottom-nav {

    border:
      1px solid
      #eee6f0;

    border-bottom: none;

  }

}

</style>
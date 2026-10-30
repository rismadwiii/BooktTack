<template>
  <ion-page>
    <ion-content :fullscreen="true">

      <div class="page">

        <!-- HEADER -->
        <div class="header">
          <div>
            <div class="brand">
              <BookTrackLogo />
              <span></span>
            </div>

            <p>
            
            </p>
          </div>
        </div>

        <!-- INTRO -->
        <section class="intro">

          <span class="eyebrow">
            CARI BUKU
          </span>

          <h1>
            Mau membaca apa<br />
            hari ini?
          </h1>

          <p>
            Cari buku favoritmu atau pilih genre
            yang kamu suka.
          </p>

        </section>

        <!-- SEARCH -->
        <div class="search-box">

          <span>
            ⌕
          </span>

          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari judul atau penulis..."
            @keyup.enter="search"
          />

          <button
            type="button"
            @click="search"
          >
            Cari
          </button>

        </div>

        <!-- GENRE -->
        <section class="genre-section">

          <div class="genre-header">

            <h2>
              Pilih Genre
            </h2>

            <span>
              Jelajahi
            </span>

          </div>

          <div class="genre-list">

            <button
              v-for="genre in genres"
              :key="genre"
              class="genre-chip"
              :class="{
                active: selectedGenre === genre
              }"
              type="button"
              @click="searchByGenre(genre)"
            >
              {{ genre }}
            </button>

          </div>

        </section>

        <!-- LOADING -->
        <div
          v-if="loading"
          class="message"
        >

          <div class="loading-icon">
            📚
          </div>

          <span>
            Sedang mencari buku...
          </span>

        </div>

        <!-- ERROR -->
        <div
          v-if="errorMessage"
          class="message error"
        >
          {{ errorMessage }}
        </div>

        <!-- RESULT -->
        <section
          v-if="books.length"
          class="section"
        >

          <div class="section-title">

            <div>

              <span class="result-label">
                {{
                  selectedGenre
                    ? 'GENRE TERPILIH'
                    : 'HASIL PENCARIAN'
                }}
              </span>

              <h2>
                {{
                  selectedGenre ||
                  'Buku yang ditemukan'
                }}
              </h2>

            </div>

            <span>
              {{ books.length }} buku
            </span>

          </div>

          <div class="book-grid">

            <button
              v-for="book in books"
              :key="book.id"
              class="book-card"
              type="button"
              @click="openBook(book.id)"
            >

              <div class="cover-wrapper">

                <img
                  v-if="book.thumbnail"
                  :src="book.thumbnail"
                  :alt="book.title"
                  class="book-cover"
                  @error="handleImageError"
                />

                <div
                  v-else
                  class="no-cover"
                >
                  📖
                </div>

                <!-- RATING -->
                <span
                  v-if="book.rating"
                  class="rating-badge"
                >
                  ★
                  {{ book.rating.toFixed(1) }}
                </span>

              </div>

              <!-- ACCESS BADGE -->
              <div
                v-if="book.readable"
                class="reading-badge available"
              >
                📖 Bisa Dibaca
              </div>

              <div
                v-else-if="book.previewAvailable"
                class="reading-badge preview"
              >
                👀 Preview
              </div>

              <div
                v-else
                class="reading-badge unavailable"
              >
                🔒 Info Buku
              </div>

              <!-- BOOK INFO -->
              <div class="book-info">

                <span class="genre">
                  {{
                    book.categories[0] ||
                    'Umum'
                  }}
                </span>

                <h3>
                  {{ book.title }}
                </h3>

                <p>
                  {{
                    book.authors.join(', ')
                  }}
                </p>

                <small>
                  {{
                    book.firstPublishYear ||
                    'Tahun tidak tersedia'
                  }}
                </small>

              </div>

            </button>

          </div>

        </section>

        <!-- EMPTY -->
        <div
          v-if="
            !loading &&
            !errorMessage &&
            books.length === 0 &&
            searchQuery
          "
          class="empty"
        >

          <div>
            🔎
          </div>

          <h3>
            Belum ada hasil
          </h3>

          <p>
            Coba gunakan kata kunci atau genre
            yang berbeda.
          </p>

        </div>

        <!-- EXTRA SPACE -->
        <div class="bottom-space"></div>

      </div>

      <!-- SHARED BOTTOM NAVIGATION -->
      <BottomNav />

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import BottomNav from '../components/BottomNav.vue'

import {
  IonPage,
  IonContent
} from '@ionic/vue'

import {
  ref
} from 'vue'

import {
  useRouter
} from 'vue-router'

import BookTrackLogo from '../components/BookTrackLogo.vue'

import {
  searchBooks,
  type Book
} from '../services/bookApi'


const router = useRouter()

const searchQuery = ref('')

const books = ref<Book[]>([])

const loading = ref(false)

const errorMessage = ref('')

const selectedGenre = ref('')


/* =====================================================
   GENRE
===================================================== */

const genres = [
  'Romansa',
  'Fiksi',
  'Remaja',
  'Misteri',
  'Horor',
  'Fantasi',
  'Self Growth',
  'Pendidikan'
]


/* =====================================================
   SEARCH
===================================================== */

const search = async () => {

  const query =
    searchQuery.value.trim()

  if (!query) {

    books.value = []

    selectedGenre.value = ''

    return
  }

  selectedGenre.value = ''

  await performSearch(query)
}


/* =====================================================
   GENRE SEARCH
===================================================== */

const searchByGenre = async (
  genre: string
) => {

  selectedGenre.value = genre

  searchQuery.value = genre

  await performSearch(genre)
}


/* =====================================================
   PERFORM SEARCH
===================================================== */

const performSearch = async (
  query: string
) => {

  loading.value = true

  errorMessage.value = ''

  try {

    books.value =
      await searchBooks(query)

    if (
      books.value.length === 0
    ) {

      errorMessage.value =
        'Buku tidak ditemukan. Coba kata kunci atau genre lain.'
    }

  } catch (error) {

    console.error(
      'BOOK API ERROR:',
      error
    )

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Terjadi kesalahan saat mengambil data buku.'

    books.value = []

  } finally {

    loading.value = false

  }
}


/* =====================================================
   OPEN DETAIL
===================================================== */

const openBook = (
  id: string
) => {

  router.push(
    `/book/${encodeURIComponent(id)}`
  )
}


/* =====================================================
   IMAGE
===================================================== */

const handleImageError = (
  event: Event
) => {

  const image =
    event.target as HTMLImageElement

  image.style.display = 'none'
}

</script>


<style scoped>

* {
  box-sizing: border-box;
}


/* =====================================================
   PAGE
===================================================== */

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


/* =====================================================
   HEADER
===================================================== */

.header {
  display: flex;

  align-items: center;
}

.brand {
  display: flex;

  align-items: center;

  gap: 8px;

  font-size: 18px;

  font-weight: 700;

  color: #5f496d;
}

.header p {
  margin:
    3px 0
    0
    38px;

  font-size: 11px;

  color: #aaa0ad;
}


/* =====================================================
   INTRO
===================================================== */

.intro {
  margin-top: 38px;
}

.eyebrow {
  font-size: 10px;

  font-weight: 700;

  letter-spacing: 1.5px;

  color: #a67bb8;
}

.intro h1 {
  margin:
    8px 0;

  font-size: 27px;

  line-height: 1.15;

  color: #493b4f;
}

.intro p {
  margin: 0;

  font-size: 13px;

  color: #968c99;
}


/* =====================================================
   SEARCH
===================================================== */

.search-box {
  margin-top: 22px;

  height: 50px;

  display: flex;

  align-items: center;

  gap: 8px;

  padding:
    0
    8px
    0
    14px;

  border:
    1px solid
    #e9dfee;

  border-radius: 16px;

  background: white;

  box-shadow:
    0 5px 18px
    rgba(70, 50, 80, 0.05);
}

.search-box > span {
  font-size: 21px;

  color: #a083ae;
}

.search-box input {
  flex: 1;

  min-width: 0;

  border: none;

  outline: none;

  background: transparent;

  font-size: 11px;

  color: #514255;
}

.search-box input::placeholder {
  color: #aaa0ad;
}

.search-box button {
  height: 36px;

  padding:
    0
    13px;

  border: none;

  border-radius: 11px;

  background: #806093;

  color: white;

  font-size: 10px;

  font-weight: 700;
}


/* =====================================================
   GENRE
===================================================== */

.genre-section {
  margin-top: 25px;
}

.genre-header {
  display: flex;

  align-items: center;

  justify-content: space-between;
}

.genre-header h2 {
  margin: 0;

  font-size: 15px;

  color: #514255;
}

.genre-header span {
  font-size: 9px;

  color: #a39aa5;
}

.genre-list {
  display: flex;

  gap: 8px;

  overflow-x: auto;

  margin-top: 11px;

  padding-bottom: 5px;

  scrollbar-width: none;
}

.genre-list::-webkit-scrollbar {
  display: none;
}

.genre-chip {
  flex: 0 0 auto;

  border:
    1px solid
    #eadff0;

  background: white;

  color: #806093;

  padding:
    9px
    13px;

  border-radius: 13px;

  font-size: 10px;

  font-weight: 600;

  white-space: nowrap;
}

.genre-chip.active {
  background: #806093;

  border-color: #806093;

  color: white;
}


/* =====================================================
   MESSAGE
===================================================== */

.message {
  margin-top: 20px;

  padding: 15px;

  border-radius: 15px;

  background: #eee5f4;

  text-align: center;

  color: #745381;

  font-size: 11px;
}

.message.error {
  background: #f8e9ed;

  color: #a06f82;
}

.loading-icon {
  margin-bottom: 5px;

  font-size: 20px;
}


/* =====================================================
   SECTION
===================================================== */

.section {
  margin-top: 28px;
}

.section-title {
  display: flex;

  justify-content: space-between;

  align-items: flex-end;

  margin-bottom: 14px;
}

.result-label {
  font-size: 8px;

  font-weight: 700;

  letter-spacing: 1.2px;

  color: #a67bb8;
}

.section-title h2 {
  margin:
    3px 0
    0;

  font-size: 17px;

  color: #514255;
}

.section-title > span {
  font-size: 9px;

  color: #9b919d;
}


/* =====================================================
   BOOK GRID
===================================================== */

.book-grid {
  display: grid;

  grid-template-columns:
    repeat(
      2,
      1fr
    );

  gap: 13px;
}

.book-card {
  width: 100%;

  min-width: 0;

  padding: 10px;

  border: none;

  border-radius: 18px;

  background: white;

  box-shadow:
    0 7px 22px
    rgba(70, 50, 80, 0.07);

  text-align: left;
}

.cover-wrapper {
  position: relative;

  width: 100%;
}

.book-cover {
  width: 100%;

  height: 190px;

  display: block;

  object-fit: cover;

  border-radius: 12px;

  background: #eee5f4;
}

.no-cover {
  width: 100%;

  height: 190px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 12px;

  background: #eee5f4;

  font-size: 35px;
}

.rating-badge {
  position: absolute;

  right: 7px;

  bottom: 7px;

  padding:
    5px
    7px;

  border-radius: 9px;

  background:
    rgba(
      255,
      255,
      255,
      .94
    );

  color: #806093;

  font-size: 8px;

  font-weight: 700;
}


/* =====================================================
   ACCESS
===================================================== */

.reading-badge {
  display: inline-block;

  margin-top: 8px;

  padding:
    5px
    7px;

  border-radius: 8px;

  font-size: 7px;

  font-weight: 700;
}

.reading-badge.available {
  background: #e7f3e9;

  color: #66856e;
}

.reading-badge.preview {
  background: #f6eedf;

  color: #9b7b48;
}

.reading-badge.unavailable {
  background: #f1edf1;

  color: #8f8791;
}


/* =====================================================
   BOOK INFO
===================================================== */

.book-info {
  padding:
    8px
    2px;
}

.genre {
  display: block;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 7px;

  font-weight: 700;

  letter-spacing: 1px;

  color: #a67bb8;
}

.book-info h3 {
  display: -webkit-box;

  -webkit-line-clamp: 2;

  -webkit-box-orient: vertical;

  overflow: hidden;

  margin:
    5px
    0
    4px;

  font-size: 13px;

  line-height: 1.35;

  color: #514255;
}

.book-info p {
  display: -webkit-box;

  -webkit-line-clamp: 1;

  -webkit-box-orient: vertical;

  overflow: hidden;

  margin: 0;

  font-size: 9px;

  color: #9b919d;
}

.book-info small {
  display: block;

  margin-top: 6px;

  font-size: 8px;

  color: #aaa0ad;
}


/* =====================================================
   EMPTY
===================================================== */

.empty {
  margin-top: 50px;

  text-align: center;

  color: #9b919d;
}

.empty > div {
  font-size: 40px;
}

.empty h3 {
  margin:
    10px
    0
    5px;

  color: #65536d;

  font-size: 15px;
}

.empty p {
  margin: 0;

  font-size: 10px;
}


/* =====================================================
   BOTTOM SPACE
===================================================== */

.bottom-space {
  height: 30px;
}


/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 360px) {

  .page {
    padding-left: 14px;

    padding-right: 14px;

    padding-top:
      calc(
        42px +
        env(safe-area-inset-top)
      );
  }

  .intro h1 {
    font-size: 25px;
  }

  .book-cover {
    height: 175px;
  }

  .no-cover {
    height: 175px;
  }
}

</style>
<template>
  <ion-page>

    <ion-content :fullscreen="true">

      <div class="reader-page">

        <!-- HEADER -->
        <div class="reader-header">

          <button
            class="back-button"
            @click="goBack"
          >
            ‹
          </button>

          <div class="reader-title">

            <strong>
              {{ book?.title || 'Membaca' }}
            </strong>

            <span>
              {{
                book?.readable
                  ? 'Buku tersedia'
                  : 'Preview tersedia'
              }}
            </span>

          </div>

        </div>

        <!-- LOADING -->
        <div
          v-if="loading"
          class="loading-box"
        >

          <div class="loading-icon">
            📖
          </div>

          <p>
            Menyiapkan buku...
          </p>

        </div>

        <!-- ERROR -->
        <div
          v-else-if="errorMessage"
          class="error-box"
        >

          <div class="error-icon">
            📕
          </div>

          <h3>
            Buku tidak dapat dibuka
          </h3>

          <p>
            {{ errorMessage }}
          </p>

          <button
            v-if="book?.readUrl"
            class="external-button"
            @click="openBook"
          >
            {{
              book?.readable
                ? '📖 Buka Buku'
                : '👀 Lihat Preview'
            }}
          </button>

        </div>

        <!-- CONTENT -->
        <template
          v-else-if="book"
        >

          <!-- BOOK ACCESS CARD -->
          <div class="book-access-card">

            <div class="book-cover-wrapper">

              <img
                v-if="book.thumbnail"
                :src="book.thumbnail"
                :alt="book.title"
                class="book-cover"
              />

              <div
                v-else
                class="no-cover"
              >
                📖
              </div>

            </div>

            <div class="book-access-info">

              <span
                class="access-badge"
                :class="{
                  full: book.readable,
                  preview: !book.readable
                }"
              >
                {{
                  book.readable
                    ? '📖 BISA DIBACA'
                    : '👀 PREVIEW'
                }}
              </span>

              <h2>
                {{ book.title }}
              </h2>

              <p>
                {{ book.authors.join(', ') }}
              </p>

              <button
                v-if="book.readUrl"
                class="open-book-button"
                @click="openBook"
              >
                {{
                  book.readable
                    ? 'Buka Buku'
                    : 'Lihat Preview'
                }}
              </button>

            </div>

          </div>

          <!-- INFORMATION -->
          <div class="notice-card">

            <div class="notice-icon">
              ℹ️
            </div>

            <div>

              <strong>
                {{
                  book.readable
                    ? 'Buku tersedia untuk dibaca'
                    : 'Hanya preview yang tersedia'
                }}
              </strong>

              <p>
                {{
                  book.readable
                    ? 'Buku dibuka melalui halaman resmi Google Books. Setelah selesai membaca, kembali ke BookTrack untuk mencatat progress.'
                    : 'Google Books hanya menyediakan sebagian isi buku ini. Kamu tetap bisa melihat preview yang tersedia.'
                }}
              </p>

            </div>

          </div>

          <!-- PROGRESS -->
          <div class="progress-card">

            <div class="progress-header">

              <div>

                <span>
                  PROGRESS MEMBACA
                </span>

                <h3>
                  {{ progress }}%
                </h3>

              </div>

              <div class="page-number">

                Halaman

                <strong>
                  {{ currentPage }}
                </strong>

                <span
                  v-if="book.pages"
                >
                  / {{ book.pages }}
                </span>

              </div>

            </div>

            <div class="progress-track">

              <div
                class="progress-fill"
                :style="{
                  width: `${progress}%`
                }"
              ></div>

            </div>

            <!-- INPUT -->
            <div class="page-input">

              <label>
                Halaman terakhir
              </label>

              <div class="input-row">

                <input
                  v-model.number="currentPage"
                  type="number"
                  min="0"
                  :max="
                    book.pages ||
                    undefined
                  "
                  @change="saveProgress"
                />

                <button
                  @click="saveProgress"
                >
                  Simpan
                </button>

              </div>

            </div>

            <p class="progress-note">

              Catat halaman terakhir yang kamu
              baca agar progress tetap tersimpan
              di BookTrack.

            </p>

          </div>

          <!-- QUICK PROGRESS -->
          <div class="quick-progress">

            <p>
              Atur progress dengan cepat
            </p>

            <div class="quick-buttons">

              <button
                @click="setProgress(25)"
              >
                25%
              </button>

              <button
                @click="setProgress(50)"
              >
                50%
              </button>

              <button
                @click="setProgress(75)"
              >
                75%
              </button>

              <button
                @click="setProgress(100)"
              >
                100%
              </button>

            </div>

          </div>

          <!-- BOOK INFO -->
          <div class="book-info">

            <div>

              <h3>
                {{ book.title }}
              </h3>

              <p>
                {{ book.authors.join(', ') }}
              </p>

              <span>
                {{ book.readStatus }}
              </span>

            </div>

          </div>

        </template>

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
  computed,
  onMounted,
  onBeforeUnmount,
  ref
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

import {
  getBookById,
  type Book
} from '../services/bookApi'

import {
  getReadingProgress,
  saveReadingProgress
} from '../services/database'


const route =
  useRoute()

const router =
  useRouter()

const book =
  ref<Book | null>(null)

const loading =
  ref(true)

const errorMessage =
  ref('')

const currentPage =
  ref(0)


/* =====================================================
   GET CURRENT USER
===================================================== */

const getCurrentUserId = (): number | null => {

  try {

    const saved =
      localStorage.getItem(
        'booktrack_current_user'
      )

    if (!saved) {
      return null
    }

    const user =
      JSON.parse(saved)

    const userId =
      Number(user?.id)

    if (
      !userId ||
      userId <= 0
    ) {
      return null
    }

    return userId

  } catch (error) {

    console.error(
      'Gagal mengambil user:',
      error
    )

    return null
  }
}


/* =====================================================
   PROGRESS
===================================================== */

const progress =
  computed(() => {

    if (
      !book.value?.pages ||
      book.value.pages <= 0
    ) {
      return 0
    }

    const value =
      (
        currentPage.value /
        book.value.pages
      ) * 100

    return Math.min(
      100,
      Math.max(
        0,
        Math.round(value)
      )
    )
  })


/* =====================================================
   LOAD BOOK
===================================================== */

const loadBook =
  async () => {

    const id =
      decodeURIComponent(
        String(route.params.id)
      )

    try {

      book.value =
        await getBookById(id)

      /*
       * Kalau buku tidak ditemukan.
       */
      if (!book.value) {

        errorMessage.value =
          'Buku tidak ditemukan.'

        return
      }

      /*
       * Kalau tidak ada akses sama sekali,
       * jangan tampilkan Reader.
       */
      if (
        !book.value.readable &&
        !book.value.previewAvailable
      ) {

        errorMessage.value =
          'Buku ini tidak memiliki akses baca atau preview.'

        return
      }

      await loadSavedProgress()

    } catch (error) {

      console.error(
        'READER ERROR:',
        error
      )

      errorMessage.value =
        error instanceof Error
          ? error.message
          : 'Gagal membuka buku.'

    } finally {

      loading.value = false

    }
  }


/* =====================================================
   LOAD PROGRESS
===================================================== */

const loadSavedProgress =
  async () => {

    if (!book.value) {
      return
    }

    const userId =
      getCurrentUserId()

    /*
     * PRIORITAS UTAMA:
     * SQLITE
     */
    if (userId) {

      try {

        const saved =
          await getReadingProgress(
            userId,
            book.value.id
          )

        if (saved) {

          currentPage.value =
            Number(
              saved.current_page
            ) || 0

          return
        }

      } catch (error) {

        console.error(
          'Gagal mengambil progress SQLite:',
          error
        )
      }
    }


    /*
     * FALLBACK BROWSER
     */
    const key =
      `booktrack_progress_${book.value.id}`

    const saved =
      localStorage.getItem(key)

    if (saved !== null) {

      currentPage.value =
        Number(saved) || 0

      return
    }


    /*
     * FALLBACK DARI COLLECTION
     */
    try {

      const collection =
        JSON.parse(
          localStorage.getItem(
            'booktrack_collection'
          ) || '[]'
        )

      const item =
        collection.find(
          (item: any) =>
            String(item.id) ===
            String(book.value?.id)
        )

      if (item) {

        currentPage.value =
          Number(
            item.currentPage || 0
          )
      }

    } catch (error) {

      console.error(
        'Gagal membaca collection:',
        error
      )
    }
  }


/* =====================================================
   SAVE PROGRESS
===================================================== */

const saveProgress =
  async () => {

    if (!book.value) {
      return
    }

    let page =
      Number(
        currentPage.value
      ) || 0


    /*
     * Jangan kurang dari 0
     */
    if (page < 0) {
      page = 0
    }


    /*
     * Jangan melebihi jumlah halaman
     */
    if (
      book.value.pages &&
      page > book.value.pages
    ) {

      page =
        book.value.pages
    }


    currentPage.value =
      page


    const userId =
      getCurrentUserId()


    /*
     * =========================================
     * ANDROID / IOS
     * SQLITE
     * =========================================
     */

    if (userId) {

      try {

        await saveReadingProgress(
          userId,
          book.value.id,
          page,
          Number(
            book.value.pages || 0
          )
        )

        console.log(
          'Progress berhasil disimpan ke SQLite:',
          {
            userId,
            bookId:
              book.value.id,
            currentPage:
              page,
            totalPages:
              book.value.pages,
            progress:
              progress.value
          }
        )

        return

      } catch (error) {

        console.error(
          'Gagal menyimpan progress SQLite:',
          error
        )
      }
    }


    /*
     * =========================================
     * BROWSER FALLBACK
     * =========================================
     */

    const key =
      `booktrack_progress_${book.value.id}`

    localStorage.setItem(
      key,
      String(page)
    )


    /*
     * Update collection browser
     */
    try {

      const collection =
        JSON.parse(
          localStorage.getItem(
            'booktrack_collection'
          ) || '[]'
        )

      const index =
        collection.findIndex(
          (item: any) =>
            String(item.id) ===
            String(book.value?.id)
        )

      const data = {

        ...book.value,

        status:
          progress.value >= 100
            ? 'finished'
            : 'reading',

        currentPage:
          page,

        progress:
          progress.value,

        /*
         * Menyimpan waktu terakhir
         * buku dibaca pada browser.
         */
        lastReadAt:
          new Date().toISOString()
      }


      if (index === -1) {

        collection.push(
          data
        )

      } else {

        collection[index] = {

          ...collection[index],

          ...data

        }
      }


      localStorage.setItem(
        'booktrack_collection',
        JSON.stringify(
          collection
        )
      )

    } catch (error) {

      console.error(
        'Gagal menyimpan collection browser:',
        error
      )
    }
  }


/* =====================================================
   QUICK PROGRESS
===================================================== */

const setProgress =
  async (
    percentage: number
  ) => {

    if (
      !book.value?.pages
    ) {
      return
    }

    currentPage.value =
      Math.round(
        (
          percentage /
          100
        ) *
        book.value.pages
      )

    await saveProgress()
  }


/* =====================================================
   OPEN GOOGLE BOOKS
===================================================== */

const openBook =
  () => {

    if (
      !book.value?.readUrl
    ) {
      return
    }

    /*
     * Buka halaman resmi Google Books.
     *
     * Jangan iframe.
     * Ini lebih aman untuk browser
     * dan Android.
     */
    window.open(
      book.value.readUrl,
      '_blank',
      'noopener,noreferrer'
    )
  }


/* =====================================================
   BACK
===================================================== */

const goBack =
  async () => {

    await saveProgress()

    router.back()
  }


/* =====================================================
   LIFECYCLE
===================================================== */

onMounted(async () => {

  /*
   * Tunggu buku selesai dimuat terlebih dahulu.
   */
  await loadBook()

  /*
   * Setelah Reader berhasil dibuka,
   * langsung simpan progress.
   *
   * Ini penting supaya:
   * - status buku menjadi reading
   * - last_read_at diperbarui
   * - Home mengetahui buku terakhir dibaca
   *
   * Walaupun halaman masih 0,
   * buku tetap tercatat sebagai
   * buku yang sedang dibaca.
   */
  if (book.value) {
    await saveProgress()
  }
})


onBeforeUnmount(() => {

  /*
   * Simpan kembali progress ketika
   * meninggalkan Reader.
   */
  saveProgress()
})

</script>


<style scoped>

* {
  box-sizing: border-box;
}

.reader-page {
  width: 100%;
  max-width: 520px;

  min-height: 100vh;

  margin: 0 auto;

  padding-bottom: 35px;

  background: #fcf9f7;

  color: #39313d;
}

/* HEADER */

.reader-header {
  position: sticky;

  top: 0;

  z-index: 20;

  display: flex;

  align-items: center;

  gap: 12px;

  padding:
    12px
    16px;

  background:
    rgba(
      255,
      255,
      255,
      0.96
    );

  border-bottom:
    1px solid
    #eee6f0;

  backdrop-filter:
    blur(15px);
}

.back-button {
  width: 38px;
  height: 38px;

  border: none;

  border-radius: 13px;

  background: #eee5f4;

  color: #765486;

  font-size: 28px;

  line-height: 1;
}

.reader-title {
  min-width: 0;

  display: flex;

  flex-direction: column;
}

.reader-title strong {
  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 14px;

  color: #514255;
}

.reader-title span {
  margin-top: 2px;

  font-size: 9px;

  color: #9a8d9e;
}

/* LOADING */

.loading-box {
  min-height: 60vh;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  color: #806093;
}

.loading-icon {
  font-size: 42px;
}

.loading-box p {
  font-size: 12px;
}

/* ERROR */

.error-box {
  margin: 30px 18px;

  padding: 28px 20px;

  border-radius: 22px;

  background: white;

  text-align: center;

  box-shadow:
    0 8px 25px
    rgba(70, 50, 80, 0.07);
}

.error-icon {
  font-size: 45px;
}

.error-box h3 {
  margin:
    12px 0
    7px;

  color: #514255;

  font-size: 17px;
}

.error-box p {
  margin: 0;

  color: #918793;

  font-size: 11px;

  line-height: 1.6;
}

/* BOOK ACCESS */

.book-access-card {
  margin: 18px;

  padding: 18px;

  display: flex;

  gap: 15px;

  border-radius: 22px;

  background: white;

  box-shadow:
    0 8px 25px
    rgba(70, 50, 80, 0.07);
}

.book-cover-wrapper {
  flex: 0 0 105px;

  width: 105px;
  height: 150px;
}

.book-cover {
  width: 100%;
  height: 100%;

  object-fit: cover;

  border-radius: 12px;
}

.no-cover {
  width: 100%;
  height: 100%;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 12px;

  background: #eee5f4;

  font-size: 35px;
}

.book-access-info {
  min-width: 0;

  display: flex;

  flex-direction: column;

  align-items: flex-start;
}

.access-badge {
  padding:
    5px
    8px;

  border-radius: 8px;

  font-size: 8px;

  font-weight: 700;
}

.access-badge.full {
  background: #e7f3e9;
  color: #66856e;
}

.access-badge.preview {
  background: #f6eedf;
  color: #9b7b48;
}

.book-access-info h2 {
  margin:
    9px 0
    4px;

  font-size: 15px;

  line-height: 1.25;

  color: #514255;
}

.book-access-info p {
  margin: 0;

  font-size: 10px;

  color: #968b99;
}

.open-book-button {
  margin-top: auto;

  min-height: 38px;

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

/* NOTICE */

.notice-card {
  margin:
    0
    18px
    15px;

  padding: 15px;

  display: flex;

  gap: 12px;

  border-radius: 17px;

  background: #f4edf7;
}

.notice-icon {
  font-size: 18px;
}

.notice-card strong {
  display: block;

  margin-bottom: 4px;

  font-size: 11px;

  color: #5c4a64;
}

.notice-card p {
  margin: 0;

  font-size: 10px;

  line-height: 1.6;

  color: #8d8191;
}

/* PROGRESS */

.progress-card {
  margin:
    0
    16px;

  padding: 18px;

  border-radius: 20px;

  background: white;

  box-shadow:
    0 7px 22px
    rgba(70, 50, 80, 0.06);
}

.progress-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;
}

.progress-header span {
  font-size: 8px;

  letter-spacing: 1px;

  color: #a078b9;

  font-weight: 700;
}

.progress-header h3 {
  margin:
    4px 0
    0;

  font-size: 24px;

  color: #5d4767;
}

.page-number {
  color: #918793;

  font-size: 10px;

  text-align: right;
}

.page-number strong {
  color: #685273;

  font-size: 13px;
}

.progress-track {
  width: 100%;

  height: 8px;

  margin-top: 15px;

  border-radius: 10px;

  background: #eee8f1;

  overflow: hidden;
}

.progress-fill {
  height: 100%;

  border-radius: 10px;

  background: #9872b2;

  transition:
    width .25s ease;
}

/* INPUT */

.page-input {
  margin-top: 20px;
}

.page-input label {
  display: block;

  margin-bottom: 8px;

  font-size: 10px;

  color: #8e8391;
}

.input-row {
  display: flex;

  gap: 8px;
}

.input-row input {
  flex: 1;

  height: 42px;

  min-width: 0;

  padding:
    0
    12px;

  border:
    1px solid
    #e7deeb;

  border-radius: 12px;

  background: #fcf9fd;

  color: #514255;

  font-size: 12px;

  outline: none;
}

.input-row button {
  width: 75px;

  border: none;

  border-radius: 12px;

  background: #806093;

  color: white;

  font-size: 10px;

  font-weight: 700;
}

.progress-note {
  margin:
    12px
    0
    0;

  font-size: 9px;

  line-height: 1.6;

  color: #9a909d;
}

/* QUICK PROGRESS */

.quick-progress {
  margin:
    15px
    16px
    0;

  padding: 16px;

  border-radius: 18px;

  background: #f4edf7;
}

.quick-progress p {
  margin:
    0
    0
    10px;

  font-size: 10px;

  color: #77647f;
}

.quick-buttons {
  display: grid;

  grid-template-columns:
    repeat(
      4,
      1fr
    );

  gap: 7px;
}

.quick-buttons button {
  height: 34px;

  border:
    1px solid
    #e3d6e8;

  border-radius: 10px;

  background: white;

  color: #806093;

  font-size: 9px;

  font-weight: 700;
}

/* BOOK INFO */

.book-info {
  margin:
    15px
    16px
    0;

  padding: 16px;

  border-radius: 18px;

  background: white;

  box-shadow:
    0 6px 18px
    rgba(70, 50, 80, 0.05);
}

.book-info h3 {
  margin: 0;

  font-size: 14px;

  color: #514255;
}

.book-info p {
  margin:
    4px 0
    8px;

  font-size: 10px;

  color: #968b99;
}

.book-info span {
  font-size: 9px;

  color: #806093;
}

</style>
<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="page">

        <!-- HEADER -->
        <div class="header">
          <BookTrackLogo />

          <button
            class="header-btn"
            @click="goToWishlist"
          >
            ♡
          </button>
        </div>

        <!-- INTRO -->
        <section class="intro">
          <span class="eyebrow">BUKU SAYA</span>

          <h1>
            Bacaan yang sedang<br />
            menemani kamu.
          </h1>

          <p>
            Atur dan lanjutkan perjalanan membaca kamu.
          </p>
        </section>

        <!-- SUMMARY -->
        <div class="summary-card">
          <div class="summary-item">
            <strong>{{ readingBooks.length }}</strong>
            <span>Sedang Dibaca</span>
          </div>

          <div class="divider"></div>

          <div class="summary-item">
            <strong>{{ finishedBooks.length }}</strong>
            <span>Selesai</span>
          </div>
        </div>

        <!-- EMPTY STATE -->
        <div
          v-if="collection.length === 0"
          class="empty-card"
        >
          <div class="empty-icon">📚</div>

          <h3>Belum ada koleksi</h3>

          <p>
            Tambahkan buku dari halaman Detail Buku
            untuk mulai membuat koleksi.
          </p>

          <button
            class="search-button"
            @click="goToSearch"
          >
            Cari Buku
          </button>
        </div>

        <!-- SEDANG DIBACA -->
        <section
          v-if="readingBooks.length > 0"
          class="section"
        >
          <div class="section-title">
            <h2>📖 Sedang Dibaca</h2>

            <span>
              {{ readingBooks.length }} buku
            </span>
          </div>

          <div
            v-for="book in readingBooks"
            :key="book.id"
            class="book-card"
          >
            <!-- COVER -->
            <div
              class="cover-wrapper"
              @click="openBook(book.id)"
            >
              <img
                v-if="book.thumbnail"
                :src="book.thumbnail"
                :alt="book.title"
                class="book-cover"
                @error="handleImageError"
              />

              <div
                v-else
                class="book-cover fallback-cover"
              >
                <span>📖</span>
              </div>
            </div>

            <!-- INFO -->
            <div class="book-info">

              <span class="genre">
                {{ getGenre(book) }}
              </span>

              <h3 @click="openBook(book.id)">
                {{ book.title }}
              </h3>

              <p>
                {{ book.authors.join(', ') }}
              </p>

              <!-- PROGRESS -->
              <div class="progress-row">
                <span>
                  {{ book.progress || 0 }}%
                </span>

                <span>
                  {{ book.currentPage || 0 }}
                  /
                  {{ book.pages || '?' }}
                  halaman
                </span>
              </div>

              <div class="progress">
                <div
                  class="progress-fill"
                  :style="{
                    width: `${book.progress || 0}%`
                  }"
                ></div>
              </div>

              <!-- ACTION -->
              <div class="card-actions">
                <button
                  class="status-button"
                  @click="markAsFinished(book.id)"
                >
                  ✓ Selesai
                </button>

                <button
                  class="delete-button"
                  @click="deleteBook(book.id)"
                >
                  🗑
                </button>
              </div>

            </div>
          </div>
        </section>

        <!-- SELESAI -->
        <section
          v-if="finishedBooks.length > 0"
          class="section"
        >
          <div class="section-title">
            <h2>✓ Selesai</h2>

            <span>
              {{ finishedBooks.length }} buku
            </span>
          </div>

          <div
            v-for="book in finishedBooks"
            :key="book.id"
            class="finished-card"
          >
            <!-- COVER -->
            <div
              class="small-cover-wrapper"
              @click="openBook(book.id)"
            >
              <img
                v-if="book.thumbnail"
                :src="book.thumbnail"
                :alt="book.title"
                class="small-cover"
                @error="handleImageError"
              />

              <div
                v-else
                class="small-cover fallback-small"
              >
                📖
              </div>
            </div>

            <!-- INFO -->
            <div
              class="finished-info"
              @click="openBook(book.id)"
            >
              <span class="genre">
                {{ getGenre(book) }}
              </span>

              <h3>
                {{ book.title }}
              </h3>

              <p>
                Sudah selesai dibaca ✨
              </p>
            </div>

            <!-- BACA LAGI -->
            <button
              class="check"
              @click="markAsReading(book.id)"
              title="Baca lagi"
            >
              ✓
            </button>

            <!-- HAPUS -->
            <button
              class="delete-small"
              @click="deleteBook(book.id)"
              title="Hapus"
            >
              ×
            </button>
          </div>
        </section>

        <!-- ADD COLLECTION -->
        <div class="add-card">

          <div class="add-icon">
            ＋
          </div>

          <div>
            <span>KOLEKSI</span>

            <h3>
              Ingin menambahkan buku?
            </h3>

            <p>
              Cari buku dan tambahkan dari halaman detail.
            </p>
          </div>

          <button
            class="add-arrow"
            @click="goToSearch"
          >
            ›
          </button>

        </div>

        <!-- WISHLIST -->
        <div
          class="wishlist-card"
          @click="goToWishlist"
        >

          <div class="heart">
            ♡
          </div>

          <div>
            <span>WISHLIST</span>

            <h3>
              Masih banyak buku yang ingin dibaca?
            </h3>

            <p>
              Lihat daftar buku yang kamu simpan.
            </p>
          </div>

          <div class="arrow">
            ›
          </div>

        </div>

        <!-- SPACE FOR BOTTOM NAV -->
        <div class="bottom-space"></div>

      </div>

      <!-- SHARED BOTTOM NAV -->
      <BottomNav />

      <!-- DELETE CONFIRMATION -->
      <div
        v-if="showDeleteDialog"
        class="dialog-overlay"
        @click.self="cancelDelete"
      >
        <div class="delete-dialog">

          <div class="dialog-icon">
            🗑
          </div>

          <h3>
            Hapus Buku?
          </h3>

          <p>
            Apakah kamu yakin ingin menghapus
            buku ini dari koleksi?
          </p>

          <div class="dialog-actions">

            <button
              type="button"
              class="dialog-cancel"
              @click="cancelDelete"
            >
              Batal
            </button>

            <button
              type="button"
              class="dialog-delete"
              @click="confirmDelete"
            >
              Hapus
            </button>

          </div>

        </div>
      </div>

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
  computed,
  ref
} from 'vue'

import {
  useRouter
} from 'vue-router'

import BookTrackLogo from '../components/BookTrackLogo.vue'
import BottomNav from '../components/BottomNav.vue'

import type {
  Book
} from '../services/bookApi'

import {
  getCollection,
  updateBookStatus,
  removeFromCollection,
  getReadingProgress,
  saveReadingProgress
} from '../services/database'


/* =========================
   TYPE
========================= */

interface CollectionBook extends Book {
  status: 'reading' | 'finished'
  progress: number
  currentPage: number
}


/* =========================
   ROUTER
========================= */

const router = useRouter()


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
   COLLECTION
========================= */

const collection =
  ref<CollectionBook[]>([])


/* =========================
   DELETE DIALOG
========================= */

const showDeleteDialog =
  ref(false)

const selectedBookId =
  ref<string | null>(null)


/* =========================
   LOCAL STORAGE FALLBACK
========================= */

const loadLocalCollection = (): CollectionBook[] => {

  try {

    const saved =
      JSON.parse(
        localStorage.getItem(
          'booktrack_collection'
        ) || '[]'
      )

    return Array.isArray(saved)
      ? saved
      : []

  } catch (error) {

    console.error(
      'Gagal membaca koleksi lokal:',
      error
    )

    return []

  }

}


const saveLocalCollection = (
  data: CollectionBook[]
) => {

  localStorage.setItem(
    'booktrack_collection',
    JSON.stringify(data)
  )

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

                let progress =
                  Number(
                    progressData?.progress ??
                    item.progress ??
                    0
                  )

                let currentPage =
                  Number(
                    progressData?.current_page ??
                    item.currentPage ??
                    0
                  )

                if (
                  !Number.isFinite(progress)
                ) {
                  progress = 0
                }

                if (
                  !Number.isFinite(currentPage)
                ) {
                  currentPage = 0
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
                  id: String(item.id),
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
        'Gagal memuat koleksi dari SQLite:',
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
   SAVE LOCAL FALLBACK
========================= */

const saveCollection = () => {

  saveLocalCollection(
    collection.value
  )

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


/* =========================
   GENRE
========================= */

const getGenre = (
  book: Book
) => {

  if (
    book.categories &&
    book.categories.length > 0
  ) {

    return book.categories[0]
      .toString()
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
   FINISH BOOK
========================= */

const markAsFinished = async (
  id: string
) => {

  const book =
    collection.value.find(
      item => item.id === id
    )

  if (!book) return

  const userId =
    getCurrentUserId()

  if (userId) {

    try {

      await updateBookStatus(
        userId,
        id,
        'finished'
      )

      /*
       * Simpan progress menjadi 100%.
       */
      if (book.pages) {

        try {

          await saveReadingProgress(
            userId,
            id,
            book.pages,
            book.pages
          )

        } catch (error) {

          console.error(
            'Gagal menyimpan progress selesai:',
            error
          )

        }

      }

      await loadCollection()

      return

    } catch (error) {

      console.error(
        'Gagal mengubah status buku:',
        error
      )

    }

  }


  /*
   * FALLBACK LOCAL STORAGE
   */

  book.status = 'finished'
  book.progress = 100

  if (book.pages) {
    book.currentPage =
      book.pages
  }

  saveCollection()

}


/* =========================
   BACK TO READING
========================= */

const markAsReading = async (
  id: string
) => {

  const book =
    collection.value.find(
      item => item.id === id
    )

  if (!book) return

  const userId =
    getCurrentUserId()

  if (userId) {

    try {

      await updateBookStatus(
        userId,
        id,
        'reading'
      )

      await loadCollection()

      return

    } catch (error) {

      console.error(
        'Gagal mengubah status buku:',
        error
      )

    }

  }


  /*
   * FALLBACK LOCAL STORAGE
   */

  book.status = 'reading'

  if (book.progress >= 100) {

    book.progress = 0
    book.currentPage = 0

  }

  saveCollection()

}


/* =========================
   DELETE
========================= */

const deleteBook = (
  id: string
) => {

  selectedBookId.value = id

  showDeleteDialog.value = true

}


const cancelDelete = () => {

  showDeleteDialog.value = false

  selectedBookId.value = null

}


const confirmDelete = async () => {

  if (!selectedBookId.value) {
    return
  }

  const id =
    selectedBookId.value

  const userId =
    getCurrentUserId()

  if (userId) {

    try {

      await removeFromCollection(
        userId,
        id
      )

      collection.value =
        collection.value.filter(
          book =>
            book.id !== id
        )

      showDeleteDialog.value = false
      selectedBookId.value = null

      return

    } catch (error) {

      console.error(
        'Gagal menghapus buku dari SQLite:',
        error
      )

    }

  }


  /*
   * FALLBACK LOCAL STORAGE
   */

  collection.value =
    collection.value.filter(
      book =>
        book.id !== id
    )

  saveCollection()

  showDeleteDialog.value = false

  selectedBookId.value = null

}


/* =========================
   IMAGE ERROR
========================= */

const handleImageError = (
  event: Event
) => {

  const image =
    event.target as HTMLImageElement

  image.style.display = 'none'

}


/* =========================
   NAVIGATION
========================= */

const goToSearch = () =>
  router.push('/search')


const goToWishlist = () =>
  router.push('/wishlist')


/* =========================
   INIT / REFRESH
========================= */

onIonViewWillEnter(() => {

  loadCollection()

})

</script>


<style scoped>

ion-content {
  --background: #fcf9f7;
}

.page {
  width: 100%;
  max-width: 500px;
  min-height: 100%;
  margin: 0 auto;
  padding:
    calc(42px + env(safe-area-inset-top))
    18px
    calc(125px + env(safe-area-inset-bottom));
  box-sizing: border-box;
  background: #fcf9f7;
  color: #39313d;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-btn {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 14px;
  background: white;
  color: #8a659b;
  font-size: 24px;
  box-shadow:
    0 5px 18px
    rgba(70, 50, 80, 0.08);
}

.intro {
  margin-top: 34px;
}

.eyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #a67bb8;
}

.intro h1 {
  margin: 8px 0;
  font-size: 27px;
  line-height: 1.15;
  color: #493b4f;
}

.intro p {
  margin: 0;
  font-size: 13px;
  color: #968c99;
}

.summary-card {
  margin-top: 22px;
  padding: 18px;
  border-radius: 22px;
  background: #eee5f4;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.summary-item strong {
  font-size: 24px;
  color: #725482;
}

.summary-item span {
  font-size: 10px;
  color: #887b90;
}

.divider {
  width: 1px;
  height: 38px;
  background: #d8c9df;
}

.section {
  margin-top: 30px;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.section-title h2 {
  margin: 0;
  font-size: 17px;
  color: #514255;
}

.section-title span {
  font-size: 10px;
  color: #a59ba7;
}

.empty-card {
  margin-top: 25px;
  padding: 28px 20px;
  border-radius: 24px;
  background: white;
  text-align: center;
  box-shadow:
    0 7px 24px
    rgba(70, 50, 80, 0.06);
}

.empty-icon {
  width: 58px;
  height: 58px;
  margin: 0 auto 12px;
  border-radius: 20px;
  background: #eee5f4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.empty-card h3 {
  margin: 0;
  font-size: 17px;
  color: #514255;
}

.empty-card p {
  margin:
    8px auto
    16px;
  max-width: 260px;
  font-size: 11px;
  line-height: 1.5;
  color: #99909d;
}

.search-button {
  border: none;
  padding:
    11px
    20px;
  border-radius: 14px;
  background: #806093;
  color: white;
  font-size: 11px;
  font-weight: 700;
}

.book-card {
  display: flex;
  gap: 15px;
  padding: 13px;
  margin-bottom: 12px;
  border-radius: 20px;
  background: white;
  box-shadow:
    0 7px 24px
    rgba(70, 50, 80, 0.07);
}

.cover-wrapper {
  flex-shrink: 0;
}

.book-cover {
  width: 82px;
  height: 112px;
  display: block;
  object-fit: cover;
  border-radius: 12px;
  background: #eee5f4;
}

.fallback-cover {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #806093;
  font-size: 25px;
}

.book-info {
  flex: 1;
  min-width: 0;
  padding-top: 4px;
}

.genre {
  display: inline-block;
  max-width: 100%;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #a277b3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-info h3,
.finished-card h3 {
  margin:
    5px 0
    2px;
  font-size: 16px;
  color: #514255;
  cursor: pointer;
}

.book-info p,
.finished-card p {
  margin: 0;
  font-size: 11px;
  color: #a39aa5;
}

.progress-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 17px;
  font-size: 9px;
  color: #918693;
}

.progress-row span:first-child {
  color: #806093;
  font-weight: 700;
}

.progress {
  height: 5px;
  margin-top: 7px;
  border-radius: 10px;
  background: #eee9ef;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
  background: #9b7aad;
  transition:
    width 0.3s ease;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 12px;
}

.status-button {
  border: none;
  border-radius: 10px;
  padding:
    7px
    10px;
  background: #e8f0e3;
  color: #687a5e;
  font-size: 9px;
  font-weight: 700;
}

.delete-button {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 9px;
  background: #f8eeee;
  color: #b27d7d;
  font-size: 12px;
}

.finished-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 19px;
  background: white;
  box-shadow:
    0 7px 24px
    rgba(70, 50, 80, 0.06);
}

.small-cover-wrapper {
  flex-shrink: 0;
}

.small-cover {
  width: 58px;
  height: 76px;
  display: block;
  object-fit: cover;
  border-radius: 10px;
  background: #eee5f4;
}

.fallback-small {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #806093;
}

.finished-info {
  flex: 1;
  min-width: 0;
}

.finished-card h3 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.check {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border: none;
  border-radius: 50%;
  background: #e6eee1;
  color: #718266;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
}

.delete-small {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  border: none;
  border-radius: 50%;
  background: #f8eeee;
  color: #b27d7d;
  font-size: 17px;
}

.add-card {
  margin-top: 25px;
  padding: 17px;
  border-radius: 22px;
  background: #f4efe8;
  display: flex;
  align-items: center;
  gap: 13px;
}

.add-icon {
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  border-radius: 15px;
  background: white;
  color: #8c6b9c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 23px;
}

.add-card > div:nth-child(2) {
  flex: 1;
}

.add-card span,
.wishlist-card span {
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 1px;
}

.add-card span {
  color: #9a7d68;
}

.add-card h3 {
  margin:
    4px 0;
  font-size: 13px;
  color: #5d4e48;
}

.add-card p {
  margin: 0;
  font-size: 10px;
  color: #9d918b;
}

.add-arrow {
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  color: #9a82a2;
  font-size: 25px;
}

.wishlist-card {
  margin-top: 15px;
  padding: 17px;
  border-radius: 22px;
  background: #f2eaf5;
  display: flex;
  align-items: center;
  gap: 13px;
}

.heart {
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  border-radius: 15px;
  background: white;
  color: #9b719f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
}

.wishlist-card > div:nth-child(2) {
  flex: 1;
}

.wishlist-card span {
  color: #9b719f;
}

.wishlist-card h3 {
  margin:
    4px 0;
  font-size: 13px;
  color: #5c4b61;
}

.wishlist-card p {
  margin: 0;
  font-size: 10px;
  color: #9b909d;
}

.arrow {
  font-size: 25px;
  color: #9a82a2;
}

.bottom-space {
  height: 30px;
}

.dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  background:
    rgba(45, 35, 50, 0.38);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

.delete-dialog {
  width: 100%;
  max-width: 320px;
  padding:
    24px
    22px
    20px;
  box-sizing: border-box;
  border-radius: 24px;
  background: #ffffff;
  text-align: center;
  box-shadow:
    0 18px 50px
    rgba(45, 30, 55, 0.22);
  animation:
    dialogIn
    0.2s
    ease-out;
}

.dialog-icon {
  width: 52px;
  height: 52px;
  margin:
    0
    auto
    13px;
  border-radius: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8eeee;
  color: #b27d7d;
  font-size: 23px;
}

.delete-dialog h3 {
  margin: 0;
  color: #514255;
  font-family: Georgia, serif;
  font-size: 19px;
}

.delete-dialog p {
  margin:
    9px
    auto
    20px;
  max-width: 250px;
  color: #958c99;
  font-size: 11px;
  line-height: 1.55;
}

.dialog-actions {
  display: flex;
  gap: 9px;
}

.dialog-actions button {
  flex: 1;
  height: 40px;
  border: none;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
}

.dialog-cancel {
  background: #f1edf2;
  color: #756b79;
}

.dialog-delete {
  background: #806093;
  color: white;
  box-shadow:
    0 5px 14px
    rgba(110, 75, 130, 0.18);
}

.dialog-actions button:active {
  transform: scale(0.97);
}

@keyframes dialogIn {
  from {
    opacity: 0;
    transform:
      scale(0.94);
  }

  to {
    opacity: 1;
    transform:
      scale(1);
  }
}

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

  .book-card {
    gap: 10px;
    padding: 10px;
  }

  .book-cover {
    width: 72px;
    height: 100px;
  }

  .intro h1 {
    font-size: 24px;
  }

}

</style>
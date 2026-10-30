<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="page">

        <!-- HEADER -->
        <div class="header">
          <button
            class="back-btn"
            @click="goBack"
          >
            ‹
          </button>

          <div class="brand">
            <BookTrackLogo size="small" />
            <span></span>
          </div>
        </div>

        <!-- LOADING -->
        <div
          v-if="loading"
          class="message"
        >
          📚 Sedang memuat informasi buku...
        </div>

        <!-- ERROR -->
        <div
          v-else-if="errorMessage"
          class="message error"
        >
          {{ errorMessage }}
        </div>

        <!-- DETAIL -->
        <section
          v-else-if="book"
          class="detail"
        >

          <!-- COVER -->
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
          </div>

          <!-- CATEGORY -->
          <div class="book-category">
            {{ book.categories?.[0] || 'Umum' }}
          </div>

          <!-- TITLE -->
          <h1>
            {{ book.title }}
          </h1>

          <!-- AUTHOR -->
          <p class="author">
            {{ book.authors?.join(', ') || '-' }}
          </p>

          <!-- RATING -->
          <div
            v-if="book.rating > 0"
            class="rating"
          >
            ★ {{ Number(book.rating).toFixed(1) }}
          </div>

          <!-- READING STATUS -->
          <div
            class="reading-status"
            :class="readingClass"
          >
            <span v-if="book.readable">
              📖 Bisa dibaca penuh
            </span>

            <span
              v-else-if="book.previewAvailable"
            >
              👀 Preview tersedia
            </span>

            <span v-else>
              🔒 Tidak tersedia untuk dibaca
            </span>
          </div>

          <!-- ACTION -->
          <div class="actions">

            <button
              class="wishlist-btn"
              @click="addWishlist"
            >
              ♡ Wishlist
            </button>

            <!-- FULL ACCESS -->
            <button
              v-if="book.readable"
              class="read-btn"
              @click="startReading"
            >
              📖 Baca Buku
            </button>

            <!-- PREVIEW -->
            <button
              v-else-if="book.previewAvailable"
              class="preview-btn"
              @click="startReading"
            >
              👀 Lihat Preview
            </button>

            <!-- NO ACCESS -->
            <button
              v-else
              class="disabled-btn"
              disabled
            >
              🔒 Tidak tersedia
            </button>

          </div>

          <!-- INFO AKSES -->
          <div
            v-if="book.readable"
            class="access-note available"
          >
            Buku ini memiliki akses baca melalui
            Google Books.
          </div>

          <div
            v-else-if="book.previewAvailable"
            class="access-note preview"
          >
            Buku ini hanya menyediakan preview.
            Kamu dapat melihat bagian yang tersedia
            melalui Google Books.
          </div>

          <div
            v-else
            class="access-note unavailable"
          >
            Buku ini tersedia untuk informasi,
            koleksi, atau wishlist, tetapi belum
            memiliki akses baca melalui API.
          </div>

          <!-- TENTANG BUKU -->
          <div class="description-card">
            <h2>
              Tentang Buku
            </h2>

            <p>
              {{ book.description || 'Deskripsi buku belum tersedia.' }}
            </p>
          </div>

          <!-- INFO -->
          <div class="info-card">

            <div class="info-item">
              <span>Kategori</span>

              <strong>
                {{ book.categories?.[0] || '-' }}
              </strong>
            </div>

            <div class="info-item">
              <span>Penulis</span>

              <strong>
                {{ book.authors?.join(', ') || '-' }}
              </strong>
            </div>

            <div class="info-item">
              <span>Tahun</span>

              <strong>
                {{ book.firstPublishYear || '-' }}
              </strong>
            </div>

            <div class="info-item">
              <span>Penerbit</span>

              <strong>
                {{ book.publisher || '-' }}
              </strong>
            </div>

            <div class="info-item">
              <span>Halaman</span>

              <strong>
                {{ book.pages || '-' }}
              </strong>
            </div>

            <div class="info-item">
              <span>Akses</span>

              <strong>
                {{ book.readStatus || '-' }}
              </strong>
            </div>

          </div>

          <!-- AI -->
          <div class="ai-section">

            <div class="ai-title">

              <span>
                ✨
              </span>

              <div>

                <h3>
                  Ringkasan AI
                </h3>

                <p>
                  Temukan inti dari buku ini
                  dengan bantuan AI.
                </p>

              </div>

            </div>

            <button
              v-if="!aiSummary && !loadingAI"
              class="ai-button"
              @click="generateAISummary"
            >
              ✨ Buat Ringkasan
            </button>

            <div
              v-if="loadingAI"
              class="ai-loading"
            >
              ✨ Sedang membuat ringkasan...
            </div>

            <div
              v-if="aiSummary"
              class="ai-result"
            >
              {{ aiSummary }}
            </div>

          </div>

        </section>

        <!-- SPACE BEFORE BOTTOM NAV -->
        <div class="bottom-space"></div>

      </div>
    </ion-content>

    <!-- SHARED BOTTOM NAVIGATION -->
    <BottomNav />

    <!-- CENTER NOTICE -->
    <div
      v-if="showWishlistNotice"
      class="notice-overlay"
      @click.self="closeWishlistNotice"
    >
      <div class="wishlist-notice">

        <div class="notice-icon">
          ♡
        </div>

        <h3>
          Pemberitahuan
        </h3>

        <p>
          {{ wishlistNoticeMessage }}
        </p>

        <button
          type="button"
          class="notice-button"
          @click="closeWishlistNotice"
        >
          Oke
        </button>

      </div>
    </div>

  </ion-page>
</template>


<script setup lang="ts">
import {
  ref,
  computed,
  onMounted
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

import {
  IonPage,
  IonContent
} from '@ionic/vue'

import { Capacitor } from '@capacitor/core'

import BookTrackLogo from '../components/BookTrackLogo.vue'
import BottomNav from '../components/BottomNav.vue'

import {
  addToWishlist,
  addToCollection,
  saveRating,
  getUserRating
} from '../services/database'

import {
  getBookById
} from '../services/bookApi'


const route = useRoute()
const router = useRouter()


/* =====================================================
   DATA
===================================================== */

const book = ref<any>(null)

const loading = ref(true)

const errorMessage = ref('')


/* =====================================================
   RATING
===================================================== */

const userRating = ref(0)


/* =====================================================
   WISHLIST NOTICE
===================================================== */

const showWishlistNotice = ref(false)

const wishlistNoticeMessage = ref('')


const closeWishlistNotice = () => {
  showWishlistNotice.value = false
}


const showMessage = (
  message: string
) => {
  wishlistNoticeMessage.value = message

  showWishlistNotice.value = true
}


/* =====================================================
   AI
===================================================== */

const loadingAI = ref(false)

const aiSummary = ref('')


/* =====================================================
   CURRENT USER
===================================================== */

const getCurrentUser = () => {
  try {
    return JSON.parse(
      localStorage.getItem(
        'booktrack_current_user'
      ) || 'null'
    )
  } catch {
    return null
  }
}


const getCurrentUserId = (): number | null => {
  const currentUser = getCurrentUser()

  if (!currentUser?.id) {
    return null
  }

  const userId = Number(
    currentUser.id
  )

  return Number.isFinite(userId)
    ? userId
    : null
}


/* =====================================================
   READING STATUS
===================================================== */

const readingClass = computed(() => {

  if (!book.value) {
    return ''
  }

  if (book.value.readable) {
    return 'available'
  }

  if (book.value.previewAvailable) {
    return 'preview'
  }

  return 'unavailable'
})


/* =====================================================
   LOAD BOOK
===================================================== */

const loadBook = async () => {

  loading.value = true

  errorMessage.value = ''

  try {

    const id = String(
      route.params.id
    )

    const result =
      await getBookById(id)

    if (!result) {

      errorMessage.value =
        'Buku tidak ditemukan.'

      return
    }

    book.value = result

    await loadUserRating()

  } catch (error) {

    console.error(
      'BOOK DETAIL ERROR:',
      error
    )

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Gagal mengambil data buku.'

  } finally {

    loading.value = false
  }
}


/* =====================================================
   LOAD USER RATING
===================================================== */

const loadUserRating = async () => {

  if (!book.value) {
    return
  }

  const userId =
    getCurrentUserId()

  if (!userId) {
    return
  }

  try {

    const rating =
      await getUserRating(
        userId,
        String(book.value.id)
      )

    if (
      rating !== null &&
      rating !== undefined
    ) {

      userRating.value =
        Number(rating)

    }

  } catch (error) {

    console.error(
      'Gagal mengambil rating:',
      error
    )
  }
}


/* =====================================================
   SAVE RATING
===================================================== */

const setRating = async (
  rating: number
) => {

  if (!book.value) {
    return
  }

  const userId =
    getCurrentUserId()

  if (!userId) {

    showMessage(
      'Silakan login terlebih dahulu.'
    )

    return
  }

  userRating.value = rating

  try {

    await saveRating(
      userId,
      String(book.value.id),
      rating
    )

    showMessage(
      'Rating berhasil disimpan.'
    )

  } catch (error) {

    console.error(
      'Gagal menyimpan rating:',
      error
    )

    showMessage(
      'Rating gagal disimpan.'
    )
  }
}


/* =====================================================
   WISHLIST
===================================================== */

const addWishlist = async () => {

  if (!book.value) {
    return
  }

  const userId =
    getCurrentUserId()


  /* =========================
     NATIVE / ANDROID
  ========================= */

  if (
    Capacitor.isNativePlatform()
  ) {

    if (!userId) {

      showMessage(
        'Silakan login terlebih dahulu.'
      )

      return
    }

    try {

      await addToWishlist(
        userId,
        book.value
      )

      showMessage(
        'Buku ditambahkan ke wishlist.'
      )

    } catch (error) {

      console.error(
        'Gagal menambahkan wishlist:',
        error
      )

      showMessage(
        'Buku gagal ditambahkan ke wishlist.'
      )
    }

    return
  }


  /* =========================
     BROWSER FALLBACK
  ========================= */

  try {

    const wishlist =
      JSON.parse(
        localStorage.getItem(
          'booktrack_wishlist'
        ) || '[]'
      )

    const exists =
      wishlist.some(
        (item: any) =>
          String(item.id) ===
          String(book.value.id)
      )

    if (!exists) {

      wishlist.push(
        book.value
      )

      localStorage.setItem(
        'booktrack_wishlist',
        JSON.stringify(
          wishlist
        )
      )
    }

    showMessage(
      'Buku ditambahkan ke wishlist.'
    )

  } catch (error) {

    console.error(
      'Wishlist error:',
      error
    )

    showMessage(
      'Buku gagal ditambahkan ke wishlist.'
    )
  }
}


/* =====================================================
   START READING
===================================================== */

const startReading = async () => {

  if (!book.value) {
    return
  }

  const userId =
    getCurrentUserId()


  /* =========================
     NATIVE / ANDROID
  ========================= */

  if (
    Capacitor.isNativePlatform()
  ) {

    if (!userId) {

      showMessage(
        'Silakan login terlebih dahulu.'
      )

      return
    }

    try {

      /*
       * PENTING:
       * Buku langsung disimpan dengan status
       * "reading", bukan "want_to_read".
       */
      await addToCollection(
        userId,
        book.value,
        'reading'
      )

      await router.push(
        `/reader/${encodeURIComponent(
          String(book.value.id)
        )}`
      )

    } catch (error) {

      console.error(
        'Gagal menambahkan buku:',
        error
      )

      showMessage(
        'Buku gagal ditambahkan ke koleksi.'
      )
    }

    return
  }


  /* =========================
     BROWSER FALLBACK
  ========================= */

  try {

    const collection =
      JSON.parse(
        localStorage.getItem(
          'booktrack_collection'
        ) || '[]'
      )

    const existingIndex =
      collection.findIndex(
        (item: any) =>
          String(item.id) ===
          String(book.value.id)
      )


    if (existingIndex === -1) {

      collection.push({

        ...book.value,

        status: 'reading',

        currentPage: 0,

        progress: 0,

        lastReadAt:
          new Date().toISOString()

      })

    } else {

      collection[
        existingIndex
      ] = {

        ...collection[
          existingIndex
        ],

        status: 'reading',

        lastReadAt:
          new Date().toISOString()

      }
    }


    localStorage.setItem(
      'booktrack_collection',
      JSON.stringify(
        collection
      )
    )


    await router.push(
      `/reader/${encodeURIComponent(
        String(book.value.id)
      )}`
    )

  } catch (error) {

    console.error(
      'Collection error:',
      error
    )

    showMessage(
      'Buku gagal ditambahkan ke koleksi.'
    )
  }
}


/* =====================================================
   BACK
===================================================== */

const goBack = () => {
  router.back()
}


/* =====================================================
   AI SUMMARY
===================================================== */

const generateAISummary = async () => {

  if (!book.value) {
    return
  }

  loadingAI.value = true

  aiSummary.value = ''

  try {

    const description =
      book.value.description?.trim()

    if (description) {

      aiSummary.value =
        description

    } else {

      aiSummary.value =
        'Ringkasan buku belum tersedia.'

    }

  } catch (error) {

    console.error(
      'AI SUMMARY ERROR:',
      error
    )

    aiSummary.value =
      'Gagal membuat ringkasan.'

  } finally {

    loadingAI.value = false

  }
}


/* =====================================================
   IMAGE ERROR
===================================================== */

const handleImageError = (
  event: Event
) => {

  const image =
    event.target as HTMLImageElement

  image.style.display =
    'none'
}


/* =====================================================
   INIT
===================================================== */

onMounted(() => {
  loadBook()
})
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
  max-width: 520px;
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

  gap: 12px;

}


.back-btn {

  width: 38px;
  height: 38px;

  border: none;

  border-radius: 13px;

  background: #eee5f4;

  color: #765486;

  font-size: 28px;

  line-height: 1;

}


.brand {

  display: flex;

  align-items: center;

  gap: 8px;

  font-size: 18px;

  font-weight: 700;

  color: #5f496d;

}


.book-logo {

  width: 30px;
  height: 30px;

  border-radius: 9px;

  display: flex;

  align-items: center;
  justify-content: center;

  background: #e9def0;

  color: #806093;

}


/* =====================================================
   MESSAGE
===================================================== */

.message {

  margin-top: 30px;

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


/* =====================================================
   DETAIL
===================================================== */

.detail {

  margin-top: 25px;

  text-align: center;

}


.cover-wrapper {

  width: 190px;
  height: 275px;

  margin:
    0 auto
    22px;

  padding: 7px;

  border-radius: 20px;

  background: white;

  box-shadow:
    0 12px 30px
    rgba(70, 50, 80, 0.13);

}


.book-cover {

  width: 100%;
  height: 100%;

  object-fit: cover;

  border-radius: 14px;

}


.no-cover {

  width: 100%;
  height: 100%;

  border-radius: 14px;

  background: #eee5f4;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 50px;

}


.book-category {

  display: inline-block;

  padding:
    6px
    10px;

  border-radius: 9px;

  background: #eee5f4;

  color: #9067a2;

  font-size: 8px;

  font-weight: 700;

}


.detail h1 {

  margin:
    12px auto
    5px;

  max-width: 350px;

  font-size: 24px;

  line-height: 1.2;

  color: #493b4f;

}


.author {

  margin: 0;

  font-size: 12px;

  color: #9b919d;

}


.rating {

  margin-top: 9px;

  font-size: 12px;

  color: #9a7890;

}


/* =====================================================
   STATUS
===================================================== */

.reading-status {

  width: fit-content;

  margin:
    14px auto
    0;

  padding:
    7px
    11px;

  border-radius: 10px;

  font-size: 9px;

  font-weight: 700;

}


.reading-status.available {

  background: #e6f2e9;

  color: #66856e;

}


.reading-status.preview {

  background: #f5eedf;

  color: #9b7b48;

}


.reading-status.unavailable {

  background: #f7e8ed;

  color: #a06f82;

}


/* =====================================================
   ACTION
===================================================== */

.actions {

  display: flex;

  gap: 10px;

  margin-top: 22px;

}


.actions button {

  flex: 1;

  min-height: 46px;

  border: none;

  border-radius: 14px;

  font-size: 11px;

  font-weight: 700;

}


.wishlist-btn {

  background: #eee5f4;

  color: #765486;

}


.read-btn {

  background: #806093;

  color: white;

}


.preview-btn {

  background: #b08a55;

  color: white;

}


.disabled-btn {

  background: #e8e4e8;

  color: #9d969f;

}


/* =====================================================
   ACCESS NOTE
===================================================== */

.access-note {

  margin-top: 12px;

  padding:
    11px
    13px;

  border-radius: 13px;

  font-size: 10px;

  line-height: 1.5;

  text-align: left;

}


.access-note.available {

  background: #edf7ef;

  color: #6d8974;

}


.access-note.preview {

  background: #faf4e7;

  color: #927849;

}


.access-note.unavailable {

  background: #f7edf0;

  color: #9a7180;

}


/* =====================================================
   DESCRIPTION
===================================================== */

.description-card {

  margin-top: 25px;

  padding: 18px;

  border-radius: 19px;

  background: white;

  text-align: left;

  box-shadow:
    0 7px 22px
    rgba(70, 50, 80, 0.06);

}


.description-card h2 {

  margin:
    0
    0
    9px;

  font-size: 16px;

  color: #514255;

}


.description-card p {

  margin: 0;

  white-space: pre-line;

  font-size: 11px;

  line-height: 1.7;

  color: #8f8592;

}


/* =====================================================
   INFO
===================================================== */

.info-card {

  margin-top: 14px;

  padding: 17px;

  border-radius: 19px;

  background: #f4edf7;

  text-align: left;

}


.info-item {

  display: flex;

  justify-content: space-between;

  gap: 15px;

  padding: 10px 0;

  border-bottom:
    1px solid
    rgba(120, 90, 135, 0.1);

}


.info-item:last-child {

  border-bottom: none;

}


.info-item span {

  font-size: 10px;

  color: #9b919d;

}


.info-item strong {

  max-width: 60%;

  text-align: right;

  font-size: 10px;

  color: #65536d;

}


/* =====================================================
   AI
===================================================== */

.ai-section {

  margin-top: 18px;

  margin-bottom: 30px;

  padding: 20px;

  border-radius: 22px;

  background: #f8f4fc;

  border:
    1px solid
    #ebe2f3;

  text-align: left;

}


.ai-title {

  display: flex;

  align-items: center;

  gap: 12px;

  margin-bottom: 16px;

}


.ai-title > span {

  width: 42px;
  height: 42px;

  border-radius: 14px;

  background: white;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 21px;

}


.ai-title h3 {

  margin: 0;

  font-size: 17px;

  color: #3d3448;

}


.ai-title p {

  margin: 4px 0 0;

  font-size: 12px;

  color: #8b8192;

}


.ai-button {

  width: 100%;

  height: 46px;

  border: none;

  border-radius: 14px;

  background: #8064a8;

  color: white;

  font-size: 13px;

  font-weight: 600;

}


.ai-loading {

  padding: 15px;

  text-align: center;

  color: #756b80;

  font-size: 13px;

}


.ai-result {

  padding: 15px;

  border-radius: 15px;

  background: white;

  color: #51485d;

  font-size: 13px;

  line-height: 1.7;

}


/* =====================================================
   CENTER WISHLIST NOTICE
===================================================== */

.notice-overlay {

  position: fixed;

  inset: 0;

  z-index: 10000;

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


.wishlist-notice {

  width: 100%;

  max-width: 300px;

  padding:
    24px
    22px
    20px;

  box-sizing: border-box;

  border-radius: 24px;

  background: white;

  text-align: center;

  box-shadow:
    0 18px 50px
    rgba(45, 30, 55, 0.22);

  animation:
    noticeIn
    0.2s
    ease-out;

}


.notice-icon {

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

  background: #eee5f4;

  color: #806093;

  font-size: 25px;

}


.wishlist-notice h3 {

  margin: 0;

  font-family: Georgia, serif;

  font-size: 18px;

  color: #514255;

}


.wishlist-notice p {

  margin:
    9px
    auto
    18px;

  max-width: 240px;

  color: #958c99;

  font-size: 11px;

  line-height: 1.55;

}


.notice-button {

  width: 100%;

  height: 40px;

  border: none;

  border-radius: 12px;

  background: #806093;

  color: white;

  font-size: 11px;

  font-weight: 700;

  box-shadow:
    0 5px 14px
    rgba(110, 75, 130, 0.18);

}


.notice-button:active {

  transform: scale(0.97);

}


@keyframes noticeIn {

  from {

    opacity: 0;

    transform: scale(0.94);

  }

  to {

    opacity: 1;

    transform: scale(1);

  }

}


/* =====================================================
   BOTTOM SPACE
===================================================== */

.bottom-space {

  height: 30px;

}


/* =====================================================
   SMALL SCREEN
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


  .cover-wrapper {

    width: 175px;

    height: 255px;

  }


  .detail h1 {

    font-size: 21px;

  }


  .actions {

    gap: 7px;

  }


  .actions button {

    font-size: 10px;

  }

}

</style>
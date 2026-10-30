<template>
  <ion-page>
    <ion-content :fullscreen="true">

      <div class="page">

        <!-- HEADER -->
        <div class="header">
          <div>
            <div class="brand">
              <BookTrackLogo />
            </div>

            <p>Daftar buku yang ingin kamu baca</p>
          </div>
        </div>


        <!-- TITLE -->
        <section class="intro">
          <span class="eyebrow">WISHLIST</span>

          <h1>
            Buku yang ingin<br />
            kamu baca nanti. ♡
          </h1>

          <p>
            Simpan buku favoritmu agar tidak lupa.
          </p>
        </section>


        <!-- ADA BUKU -->
        <section
          v-if="wishlist.length > 0"
          class="section"
        >

          <div class="section-title">

            <h2>Wishlist Kamu</h2>

            <span>
              {{ wishlist.length }} buku
            </span>

          </div>


          <div class="book-list">

            <div
              v-for="book in wishlist"
              :key="book.id"
              class="book-card"
              @click="openBook(book.id)"
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


              <!-- INFO -->
              <div class="book-info">

                <span class="genre">
                  {{ book.categories?.[0] || 'Umum' }}
                </span>

                <h3>
                  {{ book.title }}
                </h3>

                <p>
                  {{
                    book.authors?.join(', ') ||
                    'Penulis tidak diketahui'
                  }}
                </p>

                <div
                  v-if="book.rating"
                  class="rating"
                >
                  ★ {{ Number(book.rating).toFixed(1) }}
                </div>


                <button
                  class="remove-btn"
                  type="button"
                  @click.stop="removeWishlist(book.id)"
                >
                  Hapus dari Wishlist
                </button>

              </div>

            </div>

          </div>

        </section>


        <!-- KOSONG -->
        <div
          v-else
          class="empty"
        >

          <div class="empty-icon">
            ♡
          </div>

          <h3>
            Wishlist masih kosong
          </h3>

          <p>
            Simpan buku yang ingin kamu baca nanti
            dari halaman Detail Buku.
          </p>

          <button
            class="search-btn"
            type="button"
            @click="goToSearch"
          >
            Cari Buku
          </button>

        </div>


        <!-- SPACE -->
        <div class="bottom-space"></div>


        <!-- SHARED BOTTOM NAV -->
        <BottomNav />

      </div>


      <!-- =========================================
           CENTER DELETE DIALOG
      ========================================== -->

      <div
        v-if="showDeleteDialog"
        class="dialog-overlay"
        @click.self="cancelDelete"
      >

        <div class="delete-dialog">

          <div class="dialog-icon">
            ♡
          </div>

          <h3>
            Hapus dari Wishlist?
          </h3>

          <p>
            Apakah kamu yakin ingin menghapus
            buku ini dari wishlist?
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
  ref
} from 'vue'

import {
  useRouter
} from 'vue-router'

import BookTrackLogo
  from '../components/BookTrackLogo.vue'

import BottomNav
  from '../components/BottomNav.vue'

import type {
  Book
} from '../services/bookApi'

import {
  getWishlist,
  removeFromWishlist
} from '../services/database'


/* =====================================================
   ROUTER
===================================================== */

const router = useRouter()


/* =====================================================
   WISHLIST
===================================================== */

const wishlist =
  ref<Book[]>([])


/* =====================================================
   DELETE DIALOG
===================================================== */

const showDeleteDialog =
  ref(false)

const selectedBookId =
  ref<string | null>(null)


/* =====================================================
   CURRENT USER ID
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

    if (!userId || userId <= 0) {
      return null
    }

    return userId

  } catch (error) {

    console.error(
      'Gagal membaca user aktif:',
      error
    )

    return null

  }

}


/* =====================================================
   LOCAL STORAGE FALLBACK
===================================================== */

const loadLocalWishlist = (): Book[] => {

  try {

    const saved =
      localStorage.getItem(
        'booktrack_wishlist'
      )

    const parsed =
      saved
        ? JSON.parse(saved)
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


/* =====================================================
   LOAD WISHLIST
===================================================== */

const loadWishlist = async () => {

  const userId =
    getCurrentUserId()


  /*
   * PRIORITAS SQLITE
   */

  if (userId) {

    try {

      const result =
        await getWishlist(userId)

      if (Array.isArray(result)) {

        wishlist.value =
          result as Book[]

        return

      }

    } catch (error) {

      console.error(
        'Gagal membaca wishlist dari SQLite:',
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


/* =====================================================
   REMOVE WISHLIST
===================================================== */

const removeWishlist = (
  id: string
) => {

  selectedBookId.value =
    id

  showDeleteDialog.value =
    true

}


/* =====================================================
   CANCEL DELETE
===================================================== */

const cancelDelete = () => {

  showDeleteDialog.value =
    false

  selectedBookId.value =
    null

}


/* =====================================================
   CONFIRM DELETE
===================================================== */

const confirmDelete = async () => {

  if (!selectedBookId.value) {
    return
  }

  const id =
    selectedBookId.value

  const userId =
    getCurrentUserId()


  try {

    /*
     * PRIORITAS SQLITE
     */

    if (userId) {

      await removeFromWishlist(
        userId,
        id
      )

    }

    /*
     * FALLBACK LOCAL STORAGE
     */

    else {

      const updatedWishlist =
        wishlist.value.filter(
          book =>
            book.id !== id
        )

      localStorage.setItem(
        'booktrack_wishlist',
        JSON.stringify(
          updatedWishlist
        )
      )

    }


    /*
     * HAPUS DARI TAMPILAN
     */

    wishlist.value =
      wishlist.value.filter(
        book =>
          book.id !== id
      )


    /*
     * TUTUP DIALOG
     */

    showDeleteDialog.value =
      false

    selectedBookId.value =
      null

  } catch (error) {

    console.error(
      'Gagal menghapus wishlist:',
      error
    )

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
   NAVIGATION
===================================================== */

const goToSearch = () => {

  router.push('/search')

}


/* =====================================================
   IONIC LIFECYCLE
===================================================== */

onIonViewWillEnter(() => {

  loadWishlist()

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

  margin-top: 34px;

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

  font-family: Georgia, serif;

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
   SECTION
===================================================== */

.section {

  margin-top: 28px;

}


.section-title {

  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 14px;

}


.section-title h2 {

  margin: 0;

  font-family: Georgia, serif;

  font-size: 17px;

  color: #514255;

}


.section-title span {

  font-size: 9px;

  color: #9b919d;

}


/* =====================================================
   BOOK LIST
===================================================== */

.book-list {

  display: flex;

  flex-direction: column;

  gap: 13px;

}


.book-card {

  display: flex;

  gap: 13px;

  padding: 11px;

  border-radius: 18px;

  background: white;

  box-shadow:
    0 7px 22px
    rgba(70, 50, 80, 0.07);

  cursor: pointer;

}


.cover-wrapper {

  flex-shrink: 0;

}


.book-cover {

  width: 82px;
  height: 115px;

  display: block;

  flex-shrink: 0;

  object-fit: cover;

  border-radius: 11px;

  background: #eee5f4;

}


.no-cover {

  width: 82px;
  height: 115px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border-radius: 11px;

  background: #eee5f4;

  font-size: 28px;

}


/* =====================================================
   BOOK INFO
===================================================== */

.book-info {

  min-width: 0;

  padding:
    2px
    0;

}


.genre {

  display: block;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 7px;

  font-weight: 700;

  letter-spacing: 1px;

  color: #a277b3;

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

  font-size: 14px;

  line-height: 1.25;

  color: #514255;

}


.book-info p {

  display: -webkit-box;

  -webkit-line-clamp: 2;

  -webkit-box-orient: vertical;

  overflow: hidden;

  margin: 0;

  font-size: 9px;

  color: #a39aa5;

}


.rating {

  margin-top: 6px;

  font-size: 9px;

  color: #9a7890;

}


/* =====================================================
   REMOVE BUTTON
===================================================== */

.remove-btn {

  margin-top: 9px;

  padding:
    6px
    9px;

  border: none;

  border-radius: 9px;

  background: #f8e9ed;

  color: #a06f82;

  font-size: 8px;

  font-weight: 600;

}


/* =====================================================
   EMPTY
===================================================== */

.empty {

  margin-top: 55px;

  padding:
    28px
    22px;

  border-radius: 20px;

  background: white;

  text-align: center;

  box-shadow:
    0 7px 22px
    rgba(70, 50, 80, 0.06);

}


.empty-icon {

  font-size: 50px;

  color: #a67bb8;

}


.empty h3 {

  margin:
    12px
    0
    6px;

  font-size: 17px;

  color: #59485f;

}


.empty p {

  margin: 0;

  font-size: 11px;

  line-height: 1.5;

  color: #9d939f;

}


.search-btn {

  margin-top: 18px;

  padding:
    11px
    18px;

  border: none;

  border-radius: 12px;

  background: #806093;

  color: white;

  font-size: 10px;

  font-weight: 700;

}


/* =====================================================
   BOTTOM SPACE
===================================================== */

.bottom-space {

  height: 30px;

}


/* =====================================================
   CENTER DELETE DIALOG
===================================================== */

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


/* =====================================================
   DIALOG ICON
===================================================== */

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

  background: #f8e9ed;

  color: #a06f82;

  font-size: 25px;

}


/* =====================================================
   DIALOG TEXT
===================================================== */

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


/* =====================================================
   DIALOG ACTIONS
===================================================== */

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


/* =====================================================
   ANIMATION
===================================================== */

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

}

</style>
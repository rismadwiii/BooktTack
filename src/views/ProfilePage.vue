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

            <!-- Greeting -->
            <section class="greeting">
              <p class="eyebrow">
                PROFIL DAN PENGATURAN
              </p>
            </section>
          </div>

        </div>


        <!-- PROFILE -->
        <section class="profile-section">

          <div class="avatar">
            <span>
              {{ userInitial }}
            </span>
          </div>

          <h1>
            {{ userName }}
          </h1>

          <p>
            {{ userEmail }}
          </p>

          <button
            class="edit-btn"
            type="button"
            @click="openEditProfile"
          >
            ✎ Edit Profil
          </button>

        </section>


        <!-- STATISTIK OTOMATIS -->
        <div class="stats-card">

          <div>
            <strong>
              {{ totalBooks }}
            </strong>

            <span>
              Total Buku
            </span>
          </div>


          <div class="divider"></div>


          <div>
            <strong>
              {{ completedBooks }}
            </strong>

            <span>
              Selesai
            </span>
          </div>

        </div>


        <!-- MENU -->
        <section class="menu-section">

          <h2>Pengaturan</h2>


          <!-- PENGATURAN AKUN -->
          <button
            class="menu-item"
            type="button"
            @click="openAccountSettings"
          >

            <div class="menu-icon purple">
              ⚙
            </div>

            <div class="menu-text">
              <strong>
                Pengaturan Akun
              </strong>

              <span>
                Kelola informasi akun kamu
              </span>
            </div>

            <span class="arrow">
              ›
            </span>

          </button>


          <!-- NOTIFIKASI -->
          <button
            class="menu-item"
            type="button"
            @click="openNotificationSettings"
          >

            <div class="menu-icon cream">
              🔔
            </div>

            <div class="menu-text">

              <strong>
                Notifikasi
              </strong>

              <span>
                Pengingat:
                {{ notificationEnabled ? 'Aktif' : 'Nonaktif' }}
              </span>

            </div>

            <span class="arrow">
              ›
            </span>

          </button>


          <!-- WISHLIST -->
          <button
            class="menu-item"
            type="button"
            @click="goToWishlist"
          >

            <div class="menu-icon pink">
              ♡
            </div>

            <div class="menu-text">

              <strong>
                Wishlist
              </strong>

              <span>
                Buku yang ingin kamu baca
              </span>

            </div>

            <span class="arrow">
              ›
            </span>

          </button>


          <!-- BANTUAN -->
          <button
            class="menu-item"
            type="button"
            @click="openHelp"
          >

            <div class="menu-icon green">
              ?
            </div>

            <div class="menu-text">

              <strong>
                Bantuan
              </strong>

              <span>
                Panduan penggunaan BookTrack
              </span>

            </div>

            <span class="arrow">
              ›
            </span>

          </button>

        </section>


        <!-- LOGOUT -->
        <button
          class="logout-btn"
          type="button"
          @click="logout"
        >
          Keluar dari akun
        </button>


        <p class="version">
          BookTrack • Versi 1.0.0
        </p>


        <div class="bottom-space"></div>

        <!-- SHARED BOTTOM NAV -->
        <BottomNav />

      </div>


      <!-- =========================
           EDIT PROFIL
      ========================== -->

      <div
        v-if="showEditProfile"
        class="modal-overlay"
        @click.self="closeModal"
      >

        <div class="modal">

          <div class="modal-header">

            <h2>
              Edit Profil
            </h2>

            <button
              class="close-btn"
              type="button"
              @click="closeModal"
            >
              ×
            </button>

          </div>


          <label>
            Nama
          </label>

          <input
            v-model="editName"
            type="text"
            placeholder="Nama kamu"
          />


          <label>
            Email
          </label>

          <input
            v-model="editEmail"
            type="email"
            placeholder="Email kamu"
          />


          <button
            class="save-btn"
            type="button"
            @click="saveProfile"
          >
            Simpan Perubahan
          </button>

        </div>

      </div>


      <!-- =========================
           ACCOUNT SETTINGS
      ========================== -->

      <div
        v-if="showAccountSettings"
        class="modal-overlay"
        @click.self="closeModal"
      >

        <div class="modal">

          <div class="modal-header">

            <h2>
              Pengaturan Akun
            </h2>

            <button
              class="close-btn"
              type="button"
              @click="closeModal"
            >
              ×
            </button>

          </div>


          <div class="setting-row">

            <div>

              <strong>
                Email
              </strong>

              <span>
                {{ userEmail }}
              </span>

            </div>

          </div>


          <div class="setting-row">

            <div>

              <strong>
                Status Akun
              </strong>

              <span>
                Aktif
              </span>

            </div>

          </div>


          <button
            class="secondary-btn"
            type="button"
            @click="openEditProfile"
          >
            Edit Informasi Akun
          </button>

        </div>

      </div>


      <!-- =========================
           NOTIFICATION
      ========================== -->

      <div
        v-if="showNotifications"
        class="modal-overlay"
        @click.self="closeModal"
      >

        <div class="modal">

          <div class="modal-header">

            <h2>
              Notifikasi
            </h2>

            <button
              class="close-btn"
              type="button"
              @click="closeModal"
            >
              ×
            </button>

          </div>


          <div class="notification-box">

            <div>

              <strong>
                Pengingat Membaca
              </strong>

              <span>
                Ingatkan saya untuk melanjutkan membaca.
              </span>

            </div>


            <button
              class="toggle"
              :class="{
                enabled: notificationEnabled
              }"
              type="button"
              @click="toggleNotification"
            >

              <span></span>

            </button>

          </div>


          <p class="modal-note">

            Status:

            <strong>
              {{
                notificationEnabled
                  ? 'Aktif'
                  : 'Nonaktif'
              }}
            </strong>

          </p>

        </div>

      </div>


      <!-- =========================
           HELP
      ========================== -->

      <div
        v-if="showHelp"
        class="modal-overlay"
        @click.self="closeModal"
      >

        <div class="modal">

          <div class="modal-header">

            <h2>
              Bantuan
            </h2>

            <button
              class="close-btn"
              type="button"
              @click="closeModal"
            >
              ×
            </button>

          </div>


          <div class="help-list">

            <div>

              <strong>
                🔎 Cari Buku
              </strong>

              <span>
                Gunakan halaman Cari untuk menemukan
                buku berdasarkan judul atau kata kunci.
              </span>

            </div>


            <div>

              <strong>
                ♡ Wishlist
              </strong>

              <span>
                Simpan buku yang ingin kamu baca nanti.
              </span>

            </div>


            <div>

              <strong>
                📖 Buku Saya
              </strong>

              <span>
                Kelola buku yang sedang kamu baca
                dan buku yang sudah selesai.
              </span>

            </div>


            <div>

              <strong>
                📊 Progress
              </strong>

              <span>
                Pantau perkembangan membaca buku kamu.
              </span>

            </div>

          </div>


          <button
            class="save-btn"
            type="button"
            @click="closeModal"
          >
            Mengerti
          </button>

        </div>

      </div>


      <!-- =========================
           LOGOUT CONFIRMATION
      ========================== -->

      <div
        v-if="showLogoutDialog"
        class="logout-overlay"
        @click.self="cancelLogout"
      >

        <div class="logout-dialog">

          <div class="logout-icon">
            ⇥
          </div>

          <h3>
            Keluar dari Akun?
          </h3>

          <p>
            Apakah kamu yakin ingin keluar dari akun BookTrack?
          </p>

          <div class="logout-actions">

            <button
              type="button"
              class="logout-cancel"
              @click="cancelLogout"
            >
              Batal
            </button>

            <button
              type="button"
              class="logout-confirm"
              @click="confirmLogout"
            >
              Keluar
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

import BookTrackLogo
  from '../components/BookTrackLogo.vue'

import BottomNav
  from '../components/BottomNav.vue'

import {
  getDatabase,
  getUserByEmail,
  getCollection
} from '../services/database'


const router = useRouter()


/* =====================================================
   USER
===================================================== */

const userName = ref(
  'Pengguna BookTrack'
)

const userEmail = ref(
  'Belum ada email'
)

const editName = ref('')
const editEmail = ref('')


/* =====================================================
   STATISTIK
===================================================== */

const totalBooks = ref(0)

const completedBooks = ref(0)


/* =====================================================
   NOTIFICATION
===================================================== */

const notificationEnabled =
  ref(
    localStorage.getItem(
      'booktrack_notifications'
    ) !== 'false'
  )


/* =====================================================
   MODAL
===================================================== */

const showEditProfile =
  ref(false)

const showAccountSettings =
  ref(false)

const showNotifications =
  ref(false)

const showHelp =
  ref(false)


/* =====================================================
   LOGOUT DIALOG
===================================================== */

const showLogoutDialog =
  ref(false)


/* =====================================================
   USER ID
===================================================== */

const getCurrentUserId = (): number | null => {

  try {

    const currentUser =
      localStorage.getItem(
        'booktrack_current_user'
      )

    if (!currentUser) {
      return null
    }

    const data =
      JSON.parse(currentUser)

    const id =
      Number(data?.id)

    return Number.isFinite(id)
      ? id
      : null

  } catch {

    return null
  }

}


/* =====================================================
   INITIAL
===================================================== */

const userInitial =
  computed(() => {

    return (
      userName.value
        .trim()
        .charAt(0)
        .toUpperCase() ||
      'R'
    )

  })


/* =====================================================
   LOAD USER
===================================================== */

const loadUser = async () => {

  try {

    const currentUser =
      localStorage.getItem(
        'booktrack_current_user'
      )

    const loginEmail =
      localStorage.getItem(
        'booktrack_email'
      )


    /* ==========================================
       PRIORITAS SQLITE
    ========================================== */

    if (loginEmail) {

      try {

        const sqliteUser =
          await getUserByEmail(
            loginEmail
          )

        if (sqliteUser) {

          userName.value =
            sqliteUser.name ||
            loginEmail.split('@')[0] ||
            'Pengguna BookTrack'

          userEmail.value =
            sqliteUser.email ||
            loginEmail

          /*
           * Simpan ID user SQLite ke session
           * agar halaman lain dapat menggunakannya.
           */
          localStorage.setItem(
            'booktrack_current_user',
            JSON.stringify(sqliteUser)
          )

          return
        }

      } catch (error) {

        console.warn(
          'SQLite user tidak dapat dibaca:',
          error
        )

      }

    }


    /* ==========================================
       FALLBACK LOCALSTORAGE
    ========================================== */

    if (currentUser) {

      const data =
        JSON.parse(currentUser)

      userName.value =
        data.name ||
        loginEmail?.split('@')[0] ||
        'Pengguna BookTrack'

      userEmail.value =
        data.email ||
        loginEmail ||
        'Belum ada email'

      return
    }


    if (loginEmail) {

      userName.value =
        loginEmail.split('@')[0]

      userEmail.value =
        loginEmail

      return
    }


    userName.value =
      'Pengguna BookTrack'

    userEmail.value =
      'Belum ada email'

  } catch (error) {

    console.error(
      'Gagal membaca data user:',
      error
    )

    userName.value =
      'Pengguna BookTrack'

    userEmail.value =
      'Belum ada email'

  }

}


/* =====================================================
   LOAD STATISTICS
===================================================== */

const loadStatistics = async () => {

  try {

    const userId =
      getCurrentUserId()


    /* ==========================================
       SQLITE
    ========================================== */

    if (userId !== null) {

      try {

        const saved =
          await getCollection(
            userId
          )


        if (
          Array.isArray(saved)
        ) {

          totalBooks.value =
            saved.length


          completedBooks.value =
            saved.filter(
              (book: any) =>
                book.status === 'finished'
            ).length

          return

        }

      } catch (error) {

        console.warn(
          'Gagal membaca statistik dari SQLite:',
          error
        )

      }

    }


    /* ==========================================
       FALLBACK LOCALSTORAGE
    ========================================== */

    const data =
      localStorage.getItem(
        'booktrack_collection'
      )

    const saved =
      data
        ? JSON.parse(data)
        : []


    if (!Array.isArray(saved)) {

      totalBooks.value = 0
      completedBooks.value = 0

      return
    }


    totalBooks.value =
      saved.length


    completedBooks.value =
      saved.filter(
        (book: any) =>
          book.status === 'finished' ||
          Number(book.progress || 0) >= 100
      ).length

  } catch (error) {

    console.error(
      'Gagal menghitung statistik:',
      error
    )

    totalBooks.value = 0
    completedBooks.value = 0

  }

}


/* =====================================================
   EDIT PROFILE
===================================================== */

const openEditProfile = () => {

  editName.value =
    userName.value

  editEmail.value =
    userEmail.value


  showAccountSettings.value =
    false

  showEditProfile.value =
    true

}


const saveProfile = async () => {

  const name =
    editName.value.trim()

  const email =
    editEmail.value.trim()


  if (!name) {

    alert(
      'Nama tidak boleh kosong.'
    )

    return

  }


  if (!email) {

    alert(
      'Email tidak boleh kosong.'
    )

    return

  }


  const userId =
    getCurrentUserId()


  try {

    /* ==========================================
       UPDATE SQLITE
    ========================================== */

    if (userId !== null) {

      const db =
        await getDatabase()


      await db.run(
        `
          UPDATE users
          SET name = ?, email = ?
          WHERE id = ?
        `,
        [
          name,
          email,
          userId
        ]
      )

    }


    /* ==========================================
       UPDATE TAMPILAN
    ========================================== */

    userName.value =
      name

    userEmail.value =
      email


    /* ==========================================
       UPDATE SESSION
    ========================================== */

    let currentUser: any = {}

    try {

      const savedUser =
        localStorage.getItem(
          'booktrack_current_user'
        )

      if (savedUser) {
        currentUser =
          JSON.parse(savedUser)
      }

    } catch {

      currentUser = {}

    }


    const userData = {
      ...currentUser,
      id: userId ?? currentUser.id,
      name,
      email
    }


    localStorage.setItem(
      'booktrack_current_user',
      JSON.stringify(userData)
    )

    localStorage.setItem(
      'booktrack_email',
      email
    )

    localStorage.setItem(
      'booktrack_user',
      JSON.stringify(userData)
    )


    showEditProfile.value =
      false


    alert(
      'Profil berhasil diperbarui.'
    )

  } catch (error) {

    console.error(
      'Gagal memperbarui profil:',
      error
    )

    alert(
      'Profil gagal diperbarui.'
    )

  }

}


/* =====================================================
   ACCOUNT SETTINGS
===================================================== */

const openAccountSettings = () => {

  showEditProfile.value =
    false

  showNotifications.value =
    false

  showHelp.value =
    false

  showAccountSettings.value =
    true

}


/* =====================================================
   NOTIFICATION
===================================================== */

const openNotificationSettings = () => {

  showEditProfile.value =
    false

  showAccountSettings.value =
    false

  showHelp.value =
    false

  showNotifications.value =
    true

}


const toggleNotification = () => {

  notificationEnabled.value =
    !notificationEnabled.value


  localStorage.setItem(
    'booktrack_notifications',
    String(
      notificationEnabled.value
    )
  )

}


/* =====================================================
   HELP
===================================================== */

const openHelp = () => {

  showEditProfile.value =
    false

  showAccountSettings.value =
    false

  showNotifications.value =
    false

  showHelp.value =
    true

}


/* =====================================================
   CLOSE MODAL
===================================================== */

const closeModal = () => {

  showEditProfile.value =
    false

  showAccountSettings.value =
    false

  showNotifications.value =
    false

  showHelp.value =
    false

}


/* =====================================================
   NAVIGATION
===================================================== */

const goToWishlist = () =>
  router.push('/wishlist')


/* =====================================================
   LOGOUT
===================================================== */

const logout = () => {

  showLogoutDialog.value =
    true

}


const cancelLogout = () => {

  showLogoutDialog.value =
    false

}


const confirmLogout = () => {

  showLogoutDialog.value =
    false


  localStorage.removeItem(
    'booktrack_logged_in'
  )

  localStorage.removeItem(
    'booktrack_email'
  )

  localStorage.removeItem(
    'booktrack_current_user'
  )

  router.push('/login')

}


/* =====================================================
   REFRESH STATISTICS
===================================================== */

const refreshStatistics = async () => {

  await loadUser()

  await loadStatistics()

}


/* =====================================================
   INIT / REFRESH SAAT KEMBALI KE HALAMAN
===================================================== */

onIonViewWillEnter(() => {

  refreshStatistics()

})

</script>


<style scoped>

* {
  box-sizing: border-box;
}


ion-content {
  --background: #fcf9f7;
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

.greeting {
  margin-top: 16px;
  margin-left: 0;
  text-align: left;
}

.eyebrow {
  margin: 0;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 1.2px;
  color: #806093;
  text-transform: uppercase;
  line-height: 1.2;
}


/* =====================================================
   PROFILE
===================================================== */

.profile-section {
  margin-top: 30px;

  padding:
    25px
    18px;

  border-radius: 24px;

  background:
    linear-gradient(
      145deg,
      #eee5f4,
      #f6edf3
    );

  text-align: center;
}

.avatar {
  width: 76px;
  height: 76px;

  margin: 0 auto;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background:
    linear-gradient(
      145deg,
      #806093,
      #a982ba
    );

  color: white;

  font-family: Georgia, serif;

  font-size: 29px;

  font-weight: 700;

  box-shadow:
    0 9px 20px
    rgba(
      110,
      75,
      130,
      0.18
    );
}

.profile-section h1 {
  margin:
    14px 0
    5px;

  font-family: Georgia, serif;

  font-size: 22px;

  color: #514255;
}

.profile-section p {
  margin: 0;

  font-size: 10px;

  color: #948997;
}

.edit-btn {
  margin-top: 15px;

  padding:
    8px
    14px;

  border:
    1px solid
    #ddcfe4;

  border-radius: 10px;

  background:
    rgba(
      255,
      255,
      255,
      0.7
    );

  color: #806093;

  font-size: 9px;

  font-weight: 700;

  cursor: pointer;
}


/* =====================================================
   STATISTICS
===================================================== */

.stats-card {
  display: flex;

  align-items: center;

  justify-content: space-around;

  margin-top: 15px;

  padding:
    17px
    8px;

  border-radius: 19px;

  background: white;

  box-shadow:
    0 7px 22px
    rgba(
      70,
      50,
      80,
      0.06
    );
}

.stats-card > div:not(.divider) {
  flex: 1;

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 4px;
}

.stats-card strong {
  font-size: 19px;

  color: #74558a;
}

.stats-card span {
  font-size: 8px;

  color: #9d939f;
}

.divider {
  width: 1px;
  height: 28px;

  background: #eee6f0;
}


/* =====================================================
   MENU
===================================================== */

.menu-section {
  margin-top: 29px;
}

.menu-section h2 {
  margin:
    0
    0
    12px;

  font-family: Georgia, serif;

  font-size: 17px;

  color: #514255;
}

.menu-item {
  width: 100%;

  min-height: 65px;

  display: flex;

  align-items: center;

  gap: 11px;

  margin-bottom: 9px;

  padding:
    10px
    12px;

  border:
    1px solid
    #eee7ef;

  border-radius: 17px;

  background: white;

  text-align: left;

  box-shadow:
    0 4px 15px
    rgba(
      70,
      50,
      80,
      0.035
    );

  cursor: pointer;
}

.menu-icon {
  width: 38px;
  height: 38px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 12px;

  font-size: 17px;
}

.menu-icon.purple {
  background: #eee5f4;
  color: #806093;
}

.menu-icon.cream {
  background: #f7eddd;
  color: #a18150;
}

.menu-icon.pink {
  background: #f7e6ec;
  color: #a06f82;
}

.menu-icon.green {
  background: #e7efe5;
  color: #6c8b72;
}

.menu-text {
  min-width: 0;

  flex: 1;

  display: flex;

  flex-direction: column;

  gap: 3px;
}

.menu-text strong {
  color: #59485f;

  font-size: 11px;
}

.menu-text span {
  color: #aaa0ad;

  font-size: 8px;
}

.arrow {
  color: #aaa0ad;

  font-size: 22px;

  line-height: 1;
}


/* =====================================================
   LOGOUT
===================================================== */

.logout-btn {
  width: 100%;

  margin-top: 20px;

  height: 43px;

  border:
    1px solid
    #f0dce2;

  border-radius: 13px;

  background: #fdf1f4;

  color: #a06f82;

  font-size: 10px;

  font-weight: 700;

  cursor: pointer;
}

.version {
  margin:
    14px
    0
    0;

  text-align: center;

  color: #b0a7b1;

  font-size: 8px;
}


/* =====================================================
   BOTTOM SPACE
===================================================== */

.bottom-space {
  height: 30px;
}


/* =====================================================
   MODAL
===================================================== */

.modal-overlay {
  position: fixed;

  z-index: 2000;

  inset: 0;

  display: flex;

  align-items: flex-end;

  justify-content: center;

  background:
    rgba(
      45,
      35,
      50,
      0.35
    );

  padding: 18px;
}

.modal {
  width: 100%;

  max-width: 500px;

  max-height: 85vh;

  overflow-y: auto;

  padding: 22px;

  border-radius:
    25px
    25px
    20px
    20px;

  background: #fffdfb;

  box-shadow:
    0 -5px 30px
    rgba(
      50,
      35,
      60,
      0.15
    );
}

.modal-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;

  font-family: Georgia, serif;

  font-size: 20px;

  color: #514255;
}

.close-btn {
  width: 32px;
  height: 32px;

  border: none;

  border-radius: 50%;

  background: #f1eaf4;

  color: #806093;

  font-size: 22px;

  cursor: pointer;
}

.modal label {
  display: block;

  margin:
    12px
    0
    6px;

  color: #66586b;

  font-size: 10px;

  font-weight: 700;
}

.modal input {
  width: 100%;

  height: 43px;

  padding:
    0
    13px;

  border:
    1px solid
    #e5dce8;

  border-radius: 12px;

  outline: none;

  background: #faf7fc;

  color: #514255;

  font-size: 11px;
}

.modal input:focus {
  border-color: #a17ab8;
}


/* =====================================================
   MODAL BUTTON
===================================================== */

.save-btn,
.secondary-btn {
  width: 100%;

  min-height: 43px;

  margin-top: 18px;

  border: none;

  border-radius: 13px;

  background:
    linear-gradient(
      135deg,
      #806093,
      #a47cbb
    );

  color: white;

  font-size: 10px;

  font-weight: 700;

  cursor: pointer;
}

.secondary-btn {
  background: #eee5f4;

  color: #76558a;
}


/* =====================================================
   ACCOUNT
===================================================== */

.setting-row {
  padding:
    13px
    0;

  border-bottom:
    1px solid
    #eee7ef;
}

.setting-row div {
  display: flex;

  flex-direction: column;

  gap: 4px;
}

.setting-row strong {
  color: #5b4b61;

  font-size: 11px;
}

.setting-row span {
  color: #9c919f;

  font-size: 9px;
}


/* =====================================================
   NOTIFICATION
===================================================== */

.notification-box {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  padding: 14px;

  border-radius: 15px;

  background: #f8f3fa;
}

.notification-box > div {
  display: flex;

  flex-direction: column;

  gap: 5px;
}

.notification-box strong {
  font-size: 11px;

  color: #59485f;
}

.notification-box span {
  font-size: 8px;

  line-height: 1.4;

  color: #9c919f;
}

.toggle {
  width: 45px;
  height: 25px;

  flex-shrink: 0;

  padding: 3px;

  border: none;

  border-radius: 20px;

  background: #d9d0dc;

  cursor: pointer;
}

.toggle span {
  display: block;

  width: 19px;
  height: 19px;

  border-radius: 50%;

  background: white;

  transition: .2s;
}

.toggle.enabled {
  background: #806093;
}

.toggle.enabled span {
  transform:
    translateX(20px);
}

.modal-note {
  margin:
    13px
    0
    0;

  font-size: 9px;

  color: #9c919f;
}


/* =====================================================
   HELP
===================================================== */

.help-list {
  display: flex;

  flex-direction: column;

  gap: 12px;
}

.help-list div {
  padding: 12px;

  border-radius: 13px;

  background: #f8f4fa;
}

.help-list strong {
  display: block;

  margin-bottom: 5px;

  color: #5b4b61;

  font-size: 10px;
}

.help-list span {
  display: block;

  color: #9c919f;

  font-size: 9px;

  line-height: 1.5;
}


/* =====================================================
   LOGOUT CONFIRMATION
===================================================== */

.logout-overlay {
  position: fixed;

  inset: 0;

  z-index: 10000;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 20px;

  background:
    rgba(
      45,
      35,
      50,
      0.38
    );

  backdrop-filter: blur(3px);

  -webkit-backdrop-filter: blur(3px);
}


.logout-dialog {
  width: 100%;

  max-width: 300px;

  padding:
    24px
    22px
    20px;

  border-radius: 24px;

  background: white;

  text-align: center;

  box-shadow:
    0 18px 50px
    rgba(
      45,
      30,
      55,
      0.22
    );

  animation:
    logoutDialogIn
    0.2s
    ease-out;
}


.logout-icon {
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

  background: #f7e8ed;

  color: #a06f82;

  font-size: 25px;

  font-weight: 700;
}


.logout-dialog h3 {
  margin: 0;

  font-family: Georgia, serif;

  font-size: 18px;

  color: #514255;
}


.logout-dialog p {
  margin:
    9px
    auto
    20px;

  max-width: 240px;

  color: #958c99;

  font-size: 11px;

  line-height: 1.55;
}


.logout-actions {
  display: flex;

  gap: 9px;
}


.logout-actions button {
  flex: 1;

  height: 40px;

  border: none;

  border-radius: 12px;

  font-size: 11px;

  font-weight: 700;

  cursor: pointer;
}


.logout-cancel {
  background: #eee5f4;

  color: #765486;
}


.logout-confirm {
  background: #a06f82;

  color: white;

  box-shadow:
    0 5px 14px
    rgba(
      160,
      111,
      130,
      0.18
    );
}


.logout-actions button:active {
  transform: scale(0.97);
}


@keyframes logoutDialogIn {

  from {

    opacity: 0;

    transform: scale(0.94);

  }

  to {

    opacity: 1;

    transform: scale(1);

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

}

</style>
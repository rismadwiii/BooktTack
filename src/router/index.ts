import { createRouter, createWebHistory } from '@ionic/vue-router'

const routes = [
  {
    path: '/',
    redirect: '/welcome'
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: () => import('../views/WelcomePage.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/SignInPage.vue')
  },
  {
  path: '/register',
  name: 'Register',
  component: () => import('../views/RegisterPage.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/SearchPage.vue')
  },
  {
    path: '/book/:id',
    name: 'BookDetail',
    component: () => import('../views/BookDetailPage.vue')
  },
  {
    path: '/my-books',
    name: 'MyBooks',
    component: () => import('../views/MyBooksPage.vue')
  },
  {
    path: '/progress',
    name: 'Progress',
    component: () => import('../views/ProgressPage.vue')
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: () => import('../views/WishlistPage.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfilePage.vue')
  },
  {
    path: '/reader/:id',
    name: 'Reader',
    component: () => import('../views/ReaderPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
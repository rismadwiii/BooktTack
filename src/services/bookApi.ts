const API_URL = 'https://www.googleapis.com/books/v1/volumes'

const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY

export interface Book {
  id: string
  title: string
  authors: string[]
  description: string
  thumbnail: string
  categories: string[]
  rating: number
  firstPublishYear: number | null
  publisher: string
  pages: number | null
  isbn: string
  language: string

  // Akses membaca
  readable: boolean
  previewAvailable: boolean
  embeddable: boolean
  readUrl: string
  readStatus: string
  viewability: string
  publicDomain: boolean
}

/* =====================================================
   CEK API KEY
===================================================== */

const checkApiKey = () => {
  if (!API_KEY) {
    throw new Error(
      'Google Books API Key belum ditemukan. Periksa file .env'
    )
  }
}

/* =====================================================
   BERSIHKAN DESKRIPSI
===================================================== */

const cleanDescription = (value: any): string => {
  if (!value) {
    return 'Deskripsi buku belum tersedia.'
  }

  const text =
    typeof value === 'string'
      ? value
      : value?.value || ''

  const cleaned = text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .trim()

  return cleaned || 'Deskripsi buku belum tersedia.'
}

/* =====================================================
   COVER
===================================================== */

const getCoverUrl = (
  imageLinks: any
): string => {
  if (!imageLinks) {
    return ''
  }

  const cover =
    imageLinks.extraLarge ||
    imageLinks.large ||
    imageLinks.medium ||
    imageLinks.small ||
    imageLinks.thumbnail ||
    imageLinks.smallThumbnail ||
    ''

  return cover
    .replace('http://', 'https://')
    .replace('zoom=1', 'zoom=2')
}

/* =====================================================
   ISBN
===================================================== */

const getISBN = (
  identifiers: any[] = []
): string => {
  const isbn13 =
    identifiers.find(
      item => item.type === 'ISBN_13'
    )?.identifier

  const isbn10 =
    identifiers.find(
      item => item.type === 'ISBN_10'
    )?.identifier

  return isbn13 || isbn10 || ''
}

/* =====================================================
   TAHUN
===================================================== */

const getYear = (
  publishedDate?: string
): number | null => {
  if (!publishedDate) {
    return null
  }

  const match =
    publishedDate.match(/\d{4}/)

  return match
    ? Number(match[0])
    : null
}

/* =====================================================
   INFORMASI AKSES BACA
===================================================== */

const getReadingInfo = (
  accessInfo: any = {}
) => {
  const viewability =
    accessInfo.viewability || 'UNKNOWN'

  const embeddable =
    accessInfo.embeddable === true

  const publicDomain =
    accessInfo.publicDomain === true

  const webReaderLink =
    accessInfo.webReaderLink || ''

  /*
   * ALL_PAGES
   * = buku mempunyai akses baca penuh
   */
  if (
    viewability === 'ALL_PAGES' &&
    webReaderLink
  ) {
    return {
      readable: true,
      previewAvailable: true,
      embeddable,
      readUrl: webReaderLink,
      readStatus: embeddable
        ? 'Bisa dibaca penuh'
        : 'Bisa dibaca melalui Google Books',
      viewability,
      publicDomain
    }
  }

  /*
   * PARTIAL
   * = hanya preview
   */
  if (
    viewability === 'PARTIAL' &&
    webReaderLink
  ) {
    return {
      readable: false,
      previewAvailable: true,
      embeddable,
      readUrl: webReaderLink,
      readStatus: 'Preview tersedia',
      viewability,
      publicDomain
    }
  }

  /*
   * NO_PAGES / UNKNOWN
   * = tidak ada akses baca
   */
  return {
    readable: false,
    previewAvailable: false,
    embeddable: false,
    readUrl: '',
    readStatus: 'Buku tidak tersedia untuk dibaca',
    viewability,
    publicDomain
  }
}

/* =====================================================
   MAP GOOGLE BOOKS → BOOKTRACK
===================================================== */

const mapVolumeToBook = (
  volume: any
): Book => {
  const info =
    volume.volumeInfo || {}

  const access =
    volume.accessInfo || {}

  const reading =
    getReadingInfo(access)

  return {
    id:
      volume.id || '',

    title:
      info.title ||
      'Judul tidak tersedia',

    authors:
      info.authors?.length
        ? info.authors
        : ['Penulis tidak diketahui'],

    description:
      cleanDescription(
        info.description
      ),

    thumbnail:
      getCoverUrl(
        info.imageLinks
      ),

    categories:
      info.categories?.length
        ? info.categories
        : ['Umum'],

    rating:
      Number(
        info.averageRating || 0
      ),

    firstPublishYear:
      getYear(
        info.publishedDate
      ),

    publisher:
      info.publisher || '',

    pages:
      info.pageCount
        ? Number(info.pageCount)
        : null,

    isbn:
      getISBN(
        info.industryIdentifiers
      ),

    language:
      info.language || '',

    readable:
      reading.readable,

    previewAvailable:
      reading.previewAvailable,

    embeddable:
      reading.embeddable,

    readUrl:
      reading.readUrl,

    readStatus:
      reading.readStatus,

    viewability:
      reading.viewability,

    publicDomain:
      reading.publicDomain
  }
}

/* =====================================================
   SEARCH BOOKS
===================================================== */

export const searchBooks = async (
  query: string
): Promise<Book[]> => {

  checkApiKey()

  const params = new URLSearchParams({
    q: query,
    maxResults: '20',
    printType: 'books',
    langRestrict: 'id',
    country: 'ID',
    projection: 'full',
    key: API_KEY
  })

  const response = await fetch(
    `${API_URL}?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error(
      `Google Books API Error: ${response.status}`
    )
  }

  // Ambil hasil dari API
  const data = await response.json()

  // Ubah data Google Books menjadi format Book
  const books: Book[] = (data.items || [])
    .map(mapVolumeToBook)
    .filter((book: Book) => book.id)

  // Buku yang memiliki cover ditampilkan lebih dulu
  books.sort((a, b) => {
    const coverA = a.thumbnail ? 1 : 0
    const coverB = b.thumbnail ? 1 : 0

    return coverB - coverA
  })

  // Hilangkan buku duplikat berdasarkan ID
  const uniqueBooks: Book[] = []

  for (const book of books) {

    const sudahAda = uniqueBooks.some(
      item => item.id === book.id
    )

    if (!sudahAda) {
      uniqueBooks.push(book)
    }

  }

  return uniqueBooks
}


/* =====================================================
   DETAIL BOOK
===================================================== */

export const getBookById = async (
  id: string
): Promise<Book> => {

  checkApiKey()

  const cleanId =
    decodeURIComponent(id).trim()

  const response = await fetch(
    `${API_URL}/${encodeURIComponent(
      cleanId
    )}?projection=full&country=ID&key=${API_KEY}`
  )

  if (!response.ok) {
    throw new Error(
      `Google Books API Error: ${response.status}`
    )
  }

  const volume = await response.json()

  return mapVolumeToBook(volume)
}

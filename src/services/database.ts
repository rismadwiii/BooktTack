import { Capacitor } from '@capacitor/core'
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection
} from '@capacitor-community/sqlite'

const sqlite = new SQLiteConnection(CapacitorSQLite)

let db: SQLiteDBConnection | null = null


/* =====================================================
   INIT DATABASE
===================================================== */

export const initDatabase = async () => {
  try {
    if (!Capacitor.isNativePlatform()) {
      console.log('SQLite hanya dijalankan di Android/iOS.')
      return
    }

    db = await sqlite.createConnection(
      'booktrack',
      false,
      'no-encryption',
      1,
      false
    )

    await db.open()

    await db.execute(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS books (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        authors TEXT,
        description TEXT,
        thumbnail TEXT,
        categories TEXT,
        publisher TEXT,
        pages INTEGER,
        isbn TEXT,
        language TEXT,
        rating REAL DEFAULT 0,
        first_publish_year INTEGER,
        readable INTEGER DEFAULT 0,
        preview_available INTEGER DEFAULT 0,
        embeddable INTEGER DEFAULT 0,
        read_url TEXT,
        read_status TEXT,
        viewability TEXT,
        public_domain INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS collections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        book_id TEXT NOT NULL,
        status TEXT DEFAULT 'want_to_read',
        added_at TEXT DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE,

        FOREIGN KEY (book_id)
          REFERENCES books(id)
          ON DELETE CASCADE,

        UNIQUE(user_id, book_id)
      );

      CREATE TABLE IF NOT EXISTS reading_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        book_id TEXT NOT NULL,
        current_page INTEGER DEFAULT 0,
        total_pages INTEGER DEFAULT 0,
        progress REAL DEFAULT 0,
        started_at TEXT,
        last_read_at TEXT DEFAULT CURRENT_TIMESTAMP,
        finished_at TEXT,

        FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE,

        FOREIGN KEY (book_id)
          REFERENCES books(id)
          ON DELETE CASCADE,

        UNIQUE(user_id, book_id)
      );

      CREATE TABLE IF NOT EXISTS ratings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        book_id TEXT NOT NULL,
        rating REAL NOT NULL,
        review TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE,

        FOREIGN KEY (book_id)
          REFERENCES books(id)
          ON DELETE CASCADE,

        UNIQUE(user_id, book_id)
      );
    `)

    console.log('Database BookTrack berhasil dibuat.')
  } catch (error) {
  console.error('GAGAL INISIALISASI DATABASE:', error)
  throw error
}
}


/* =====================================================
   GET DATABASE
===================================================== */

export const getDatabase = () => {
  if (!db) {
    throw new Error('Database belum diinisialisasi.')
  }

  return db
}


/* =====================================================
   USER
===================================================== */

export const saveUser = async (
  name: string,
  email: string,
  password: string
) => {
  const database = getDatabase()

  await database.run(
    `
    INSERT INTO users (
      name,
      email,
      password
    )
    VALUES (?, ?, ?)

    ON CONFLICT(email)
    DO UPDATE SET
      name = excluded.name,
      password = excluded.password
    `,
    [
      name,
      email,
      password
    ]
  )
}


export const getUserByEmail = async (
  email: string
) => {
  const database = getDatabase()

  const result = await database.query(
    `
    SELECT
      id,
      name,
      email,
      password
    FROM users
    WHERE email = ?
    LIMIT 1
    `,
    [
      email
    ]
  )

  return result.values?.[0] || null
}


/* =====================================================
   BOOK
===================================================== */

export const saveBook = async (
  book: any
) => {
  const database = getDatabase()

  await database.run(
    `
    INSERT INTO books (
      id,
      title,
      authors,
      description,
      thumbnail,
      categories,
      publisher,
      pages,
      isbn,
      language,
      rating,
      first_publish_year,
      readable,
      preview_available,
      embeddable,
      read_url,
      read_status,
      viewability,
      public_domain
    )
    VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?
    )

    ON CONFLICT(id)
    DO UPDATE SET
      title = excluded.title,
      authors = excluded.authors,
      description = excluded.description,
      thumbnail = excluded.thumbnail,
      categories = excluded.categories,
      publisher = excluded.publisher,
      pages = excluded.pages,
      isbn = excluded.isbn,
      language = excluded.language,
      rating = excluded.rating,
      first_publish_year = excluded.first_publish_year,
      readable = excluded.readable,
      preview_available = excluded.preview_available,
      embeddable = excluded.embeddable,
      read_url = excluded.read_url,
      read_status = excluded.read_status,
      viewability = excluded.viewability,
      public_domain = excluded.public_domain
    `,
    [
      book.id,
      book.title,
      JSON.stringify(book.authors || []),
      book.description || '',
      book.thumbnail || '',
      JSON.stringify(book.categories || []),
      book.publisher || '',
      book.pages || 0,
      book.isbn || '',
      book.language || '',
      book.rating || 0,
      book.firstPublishYear || null,
      book.readable ? 1 : 0,
      book.previewAvailable ? 1 : 0,
      book.embeddable ? 1 : 0,
      book.readUrl || '',
      book.readStatus || '',
      book.viewability || '',
      book.publicDomain ? 1 : 0
    ]
  )
}


/* =====================================================
   ADD TO COLLECTION
===================================================== */

export const addToCollection = async (
  userId: number,
  book: any,
  status: string = 'want_to_read'
) => {
  const database = getDatabase()

  await saveBook(book)

  await database.run(
    `
    INSERT INTO collections (
      user_id,
      book_id,
      status
    )
    VALUES (?, ?, ?)

    ON CONFLICT(user_id, book_id)
    DO UPDATE SET
      status = excluded.status
    `,
    [
      userId,
      book.id,
      status
    ]
  )
}


/* =====================================================
   GET COLLECTION
===================================================== */

export const getCollection = async (
  userId: number
) => {
  const database = getDatabase()

  const result = await database.query(
    `
    SELECT
      c.id AS collection_id,
      c.user_id,
      c.book_id,
      c.status,
      c.added_at,

      b.id,
      b.title,
      b.authors,
      b.description,
      b.thumbnail,
      b.categories,
      b.publisher,
      b.pages,
      b.isbn,
      b.language,
      b.rating,
      b.first_publish_year,
      b.readable,
      b.preview_available,
      b.embeddable,
      b.read_url,
      b.read_status,
      b.viewability,
      b.public_domain

    FROM collections c

    INNER JOIN books b
      ON b.id = c.book_id

    WHERE c.user_id = ?
      AND c.status != 'wishlist'

    ORDER BY c.added_at DESC
    `,
    [
      userId
    ]
  )

  return (result.values || []).map(
    (book: any) => ({
      ...book,

      authors: book.authors
        ? JSON.parse(book.authors)
        : [],

      categories: book.categories
        ? JSON.parse(book.categories)
        : [],

      firstPublishYear:
        book.first_publish_year,

      readable:
        Boolean(book.readable),

      previewAvailable:
        Boolean(book.preview_available),

      embeddable:
        Boolean(book.embeddable),

      publicDomain:
        Boolean(book.public_domain)
    })
  )
}


/* =====================================================
   UPDATE BOOK STATUS
===================================================== */

export const updateBookStatus = async (
  userId: number,
  bookId: string,
  status: string
) => {
  const database = getDatabase()

  await database.run(
    `
    UPDATE collections
    SET status = ?
    WHERE user_id = ?
      AND book_id = ?
    `,
    [
      status,
      userId,
      bookId
    ]
  )
}


/* =====================================================
   REMOVE FROM COLLECTION
===================================================== */

export const removeFromCollection = async (
  userId: number,
  bookId: string
) => {
  const database = getDatabase()

  await database.run(
    `
    DELETE FROM collections
    WHERE user_id = ?
      AND book_id = ?
    `,
    [
      userId,
      bookId
    ]
  )
}


/* =====================================================
   ADD WISHLIST
===================================================== */

export const addToWishlist = async (
  userId: number,
  book: any
) => {
  const database = getDatabase()

  await saveBook(book)

  await database.run(
    `
    INSERT INTO collections (
      user_id,
      book_id,
      status
    )
    VALUES (?, ?, 'wishlist')

    ON CONFLICT(user_id, book_id)
    DO UPDATE SET
      status = 'wishlist'
    `,
    [
      userId,
      book.id
    ]
  )
}


/* =====================================================
   GET WISHLIST
===================================================== */

export const getWishlist = async (
  userId: number
) => {
  const database = getDatabase()

  const result = await database.query(
    `
    SELECT
      b.id,
      b.title,
      b.authors,
      b.description,
      b.thumbnail,
      b.categories,
      b.publisher,
      b.pages,
      b.isbn,
      b.language,
      b.rating,
      b.first_publish_year,
      b.readable,
      b.preview_available,
      b.embeddable,
      b.read_url,
      b.read_status,
      b.viewability,
      b.public_domain

    FROM collections c

    INNER JOIN books b
      ON b.id = c.book_id

    WHERE c.user_id = ?
      AND c.status = 'wishlist'

    ORDER BY c.added_at DESC
    `,
    [
      userId
    ]
  )

  return (result.values || []).map(
    (book: any) => ({
      ...book,

      authors: book.authors
        ? JSON.parse(book.authors)
        : [],

      categories: book.categories
        ? JSON.parse(book.categories)
        : [],

      firstPublishYear:
        book.first_publish_year,

      readable:
        Boolean(book.readable),

      previewAvailable:
        Boolean(book.preview_available),

      embeddable:
        Boolean(book.embeddable),

      publicDomain:
        Boolean(book.public_domain)
    })
  )
}


/* =====================================================
   REMOVE WISHLIST
===================================================== */

export const removeFromWishlist = async (
  userId: number,
  bookId: string
) => {
  const database = getDatabase()

  await database.run(
    `
    DELETE FROM collections
    WHERE user_id = ?
      AND book_id = ?
      AND status = 'wishlist'
    `,
    [
      userId,
      bookId
    ]
  )
}


/* =====================================================
   READING PROGRESS
===================================================== */

export const saveReadingProgress = async (
  userId: number,
  bookId: string,
  currentPage: number,
  totalPages: number
) => {
  const database = getDatabase()

  const safeCurrentPage =
    Math.max(
      0,
      Number(currentPage) || 0
    )

  const safeTotalPages =
    Math.max(
      0,
      Number(totalPages) || 0
    )

  let progress = 0

  if (safeTotalPages > 0) {
    progress =
      (safeCurrentPage / safeTotalPages) * 100
  }

  progress = Math.min(
    100,
    Math.max(
      0,
      progress
    )
  )

  const finished =
    progress >= 100

  await database.run(
    `
    INSERT INTO reading_progress (
      user_id,
      book_id,
      current_page,
      total_pages,
      progress,
      started_at,
      last_read_at,
      finished_at
    )
    VALUES (
      ?,
      ?,
      ?,
      ?,
      ?,
      CASE
        WHEN ? > 0
        THEN CURRENT_TIMESTAMP
        ELSE NULL
      END,
      CURRENT_TIMESTAMP,
      CASE
        WHEN ? >= 100
        THEN CURRENT_TIMESTAMP
        ELSE NULL
      END
    )

    ON CONFLICT(user_id, book_id)
    DO UPDATE SET
      current_page = excluded.current_page,
      total_pages = excluded.total_pages,
      progress = excluded.progress,
      last_read_at = CURRENT_TIMESTAMP,
      finished_at =
        CASE
          WHEN excluded.progress >= 100
          THEN CURRENT_TIMESTAMP
          ELSE reading_progress.finished_at
        END
    `,
    [
      userId,
      bookId,
      safeCurrentPage,
      safeTotalPages,
      progress,
      safeCurrentPage,
      progress
    ]
  )

  /*
   * Buku yang sedang dibuka/dibaca
   * selalu menjadi status reading,
   * meskipun halaman masih 0.
   */
  if (finished) {
    await updateBookStatus(
      userId,
      bookId,
      'finished'
    )
  } else {
    await updateBookStatus(
      userId,
      bookId,
      'reading'
    )
  }
}


/* =====================================================
   GET ONE READING PROGRESS
===================================================== */

export const getReadingProgress = async (
  userId: number,
  bookId: string
) => {
  const database = getDatabase()

  const result = await database.query(
    `
    SELECT
      id,
      user_id,
      book_id,
      current_page,
      total_pages,
      progress,
      started_at,
      last_read_at,
      finished_at
    FROM reading_progress
    WHERE user_id = ?
      AND book_id = ?
    LIMIT 1
    `,
    [
      userId,
      bookId
    ]
  )

  return result.values?.[0] || null
}


/* =====================================================
   GET ALL READING PROGRESS
===================================================== */

export const getAllReadingProgress = async (
  userId: number
) => {
  const database = getDatabase()

  const result = await database.query(
    `
    SELECT
      rp.id,
      rp.user_id,
      rp.book_id,
      rp.current_page,
      rp.total_pages,
      rp.progress,
      rp.started_at,
      rp.last_read_at,
      rp.finished_at,

      b.title,
      b.authors,
      b.thumbnail,
      b.pages

    FROM reading_progress rp

    INNER JOIN books b
      ON b.id = rp.book_id

    WHERE rp.user_id = ?

    ORDER BY rp.last_read_at DESC
    `,
    [
      userId
    ]
  )

  return (result.values || []).map(
    (book: any) => ({
      ...book,

      authors: book.authors
        ? JSON.parse(book.authors)
        : []
    })
  )
}


/* =====================================================
   GET PROGRESS SUMMARY
===================================================== */

export const getProgressSummary = async (
  userId: number
) => {
  const database = getDatabase()

  const result = await database.query(
    `
    SELECT
      COUNT(*) AS total_books,

      SUM(
        CASE
          WHEN c.status = 'reading'
          THEN 1
          ELSE 0
        END
      ) AS reading_books,

      SUM(
        CASE
          WHEN c.status = 'finished'
          THEN 1
          ELSE 0
        END
      ) AS finished_books,

      COALESCE(
        ROUND(
          AVG(
            COALESCE(
              rp.progress,
              0
            )
          )
        ),
        0
      ) AS overall_progress

    FROM collections c

    LEFT JOIN reading_progress rp
      ON rp.user_id = c.user_id
      AND rp.book_id = c.book_id

    WHERE c.user_id = ?
      AND c.status != 'wishlist'
    `,
    [
      userId
    ]
  )

  return result.values?.[0] || {
    total_books: 0,
    reading_books: 0,
    finished_books: 0,
    overall_progress: 0
  }
}


/* =====================================================
   RATINGS
===================================================== */

export const saveRating = async (
  userId: number,
  bookId: string,
  rating: number,
  review: string = ''
) => {
  const database = getDatabase()

  const safeRating =
    Math.min(
      5,
      Math.max(
        1,
        Number(rating) || 1
      )
    )

  await database.run(
    `
    INSERT INTO ratings (
      user_id,
      book_id,
      rating,
      review
    )
    VALUES (?, ?, ?, ?)

    ON CONFLICT(user_id, book_id)
    DO UPDATE SET
      rating = excluded.rating,
      review = excluded.review,
      updated_at = CURRENT_TIMESTAMP
    `,
    [
      userId,
      bookId,
      safeRating,
      review
    ]
  )
}


/* =====================================================
   GET USER RATING
===================================================== */

export const getUserRating = async (
  userId: number,
  bookId: string
) => {
  const database = getDatabase()

  const result = await database.query(
    `
    SELECT
      id,
      user_id,
      book_id,
      rating,
      review,
      created_at,
      updated_at

    FROM ratings

    WHERE user_id = ?
      AND book_id = ?

    LIMIT 1
    `,
    [
      userId,
      bookId
    ]
  )

  return result.values?.[0] || null
}
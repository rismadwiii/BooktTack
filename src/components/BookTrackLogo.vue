<template>
  <div class="brand-small">

    <div class="logo-book">
      <div class="logo-page"></div>
      <span>❧</span>
    </div>

    <div class="brand-text">
      <h2>BookTrack</h2>
      <p>Teman bacamu</p>
    </div>

  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>

/* =====================================================
   BRAND
===================================================== */

.brand-small {
  display: flex;
  align-items: center;
  gap: 10px;
}


/* =====================================================
   LOGO BOOK
   SAMA DENGAN HOMEPAGE
===================================================== */

.logo-book {
  position: relative;

  width: 39px;
  height: 43px;

  border-radius:
    7px
    9px
    9px
    7px;

  background:
    linear-gradient(
      145deg,
      #76558f,
      #a47bc0
    );

  box-shadow:
    0 7px 15px
    rgba(117, 82, 142, .2);
}


/* BORDER DALAM */

.logo-book::before {
  content: "";

  position: absolute;

  inset: 4px;

  border:
    1px solid
    rgba(255,255,255,.45);

  border-radius:
    5px
    7px
    7px
    5px;
}


/* HALAMAN PUTIH */

.logo-page {
  position: absolute;

  right: -3px;
  top: 4px;

  width: 9px;
  height: 35px;

  background: #fffaf3;

  border-radius:
    0
    5px
    5px
    0;
}


/* SIMBOL */

.logo-book span {
  position: absolute;

  left: 12px;
  top: 13px;

  color: #fff5e7;

  font-size: 12px;
}


/* =====================================================
   TEXT
===================================================== */

.brand-text h2 {
  margin: 0;

  font-family: Georgia, serif;

  font-size: 21px;

  color: #4d3960;
}


.brand-text p {
  margin: 2px 0 0;

  color: #a098a5;

  font-size: 9px;
}

</style>
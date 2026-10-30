<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonRouterOutlet
} from '@ionic/vue'
</script>

<style>
html,
body,
ion-app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background: #fcf9f7;
}

ion-content {
  --background: #fcf9f7;
}

/* =====================================================
   GLOBAL SAFE AREA BOOKTRACK
===================================================== */

:root {
  --booktrack-safe-top:
    max(
      28px,
      var(--safe-area-inset-top, 0px)
    );

  --booktrack-safe-bottom:
    max(
      18px,
      var(--safe-area-inset-bottom, 0px)
    );
}
</style>
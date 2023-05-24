<script setup lang="ts">
import { reactive } from 'vue';
import type { ToastState } from '@/types/ComponentsTypes';
    
  const props = defineProps({
    message: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true
    }
  })

  const toast = reactive<ToastState>({
    show: false,
    message: props.message,
    color: props.color,
    icon: props.icon,
    timeout: -1,
  });

  const showToast=(message: string, color: string, icon: string, timeout: number) => {
    toast.show = true;
    toast.message = message;
    toast.color = color;
    toast.icon = icon;
    toast.timeout = timeout;
  }

  defineExpose({
    showToast
  })

</script>
<template>
  <div class="notyfication">
    <VSnackbar :timeout="toast.timeout" :top="true" :right="true" v-model="toast.show" :color="toast.color"
      :multi-line = "false" role="alert" @click="toast.show = false" class="toast-info">
      <VIcon left dark color="iconColor">
        {{ toast.icon }}
      </VIcon>
      <span class="notyfication-text">
        {{ toast.message }}
      </span>
    </VSnackbar>
  </div>
</template>

<style>
  .toast-info {
    max-width: none !important;
    width: auto !important;
  }
  .toast-info .v-snack__content {
    justify-content: flex-start;
  }
</style>

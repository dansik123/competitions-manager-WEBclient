<script setup lang="ts">

const props = defineProps({
    showDialog: {
        type: Boolean,
        required: true,
    }
})

const emit = defineEmits(['update:showDialog', 'dialogConfirm'])
const dialogActionResultAccept = () =>{
    emit('update:showDialog', false)
    emit('dialogConfirm', true)
}

const dialogActionResultReject = () =>{
    emit('update:showDialog', false)
    emit('dialogConfirm', false)
}

</script>
<template>
    <VDialog
      v-model="props.showDialog"
      persistent
      width="auto">
      <VCard>
        <VCardTitle class="text-h5">
            <slot name="dialog-title"></slot>
        </VCardTitle>
        <VCardText>
            <slot name="dialog-text"></slot>
        </VCardText>
        <VCardActions>
            <VSpacer></VSpacer>
            <VBtn 
                color="green-darken-1"
                @click="dialogActionResultAccept">
                Yes
            </VBtn>
            <VBtn 
                color="green-darken-1"
                @click="dialogActionResultReject">
                No
            </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
</template>
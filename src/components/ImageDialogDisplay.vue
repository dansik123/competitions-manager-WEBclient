<script setup lang="ts">
import { computed, inject, ref, type PropType } from "vue";
import { genericGetHttpRequest, genericPostHttpRequestFormBodyNoParams } from "@/apiHttp/RequestsApi";
import type { GenericErrorResponse, SingleMatchResponse } from "@/types/HttpResponseTypes";
import type { AxiosError } from 'axios';
import { useMutation, useQuery } from "vue-query";
import { distanceAndSkiddingToXY } from "@popperjs/core/lib/modifiers/offset";

const props = defineProps({
    matchId: {
        type: Number,
        required: true,
    },
    disabled: {
        type: Boolean,
        required: true
    },
    useIcon: {
        type: Boolean,
        required: true
    },
    density: {
        type: String as PropType<null | 'default' | 'comfortable' | 'compact'>,
        required: true
    },
    isCompetitor1:{
        type: Boolean,
        required: true
    }
})
// const popUpSuccess: (msg: string, timeout: number) => void = inject("okayToastPopUp", ()=>{})
// const popUpWarning: (msg: string, timeout: number) => void = inject("warningToastPopUp", ()=>{})
// const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})

// const emit = defineEmits(['updateMatch'])

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const isDialogOpenRef = ref(false)
const imageUrl = computed(() =>{
    const whichCompetitor =  props.isCompetitor1? 'competitor1': 'competitor2'
    return API_BASE_URL + `/matches/${props.matchId}/${whichCompetitor}/scorecard`
})

</script>
<template>
    <VBtn 
        :disabled="props.disabled" :icon="props.useIcon"
        :density="props.density" 
        @click="isDialogOpenRef = true">
        <slot></slot>
        <VDialog
            v-model="isDialogOpenRef"
        >
            <VCard>
                <VCardText class="d-flex justify-center">
                    <div class="image-dialog-box">
                        <img :src="imageUrl" class="img-dialog-scorecard">
                    </div>
                </VCardText>
            </VCard>
        </VDialog>
    </VBtn>
</template>
<style scoped>
.image-dialog-box{
    max-width: 40%;
}
.img-dialog-scorecard{
    max-width: 100%;
}
</style>
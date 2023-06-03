<script setup lang="ts">
import { computed, inject, ref } from "vue";
import { genericPostHttpRequestFormBodyNoParams } from "@/apiHttp/RequestsApi";
import type { GenericErrorResponse, SingleMatchResponse } from "@/types/HttpResponseTypes";
import type { AxiosResponse } from 'axios';
import { useMutation } from "@tanstack/vue-query";

const props = defineProps({
    matchId: {
        type: Number,
        required: true,
    },
    isCompetitor1:{
        type: Boolean,
        required: true
    }
})
const popUpSuccess: (msg: string, timeout: number) => void = inject("okayToastPopUp", ()=>{})
const popUpWarning: (msg: string, timeout: number) => void = inject("warningToastPopUp", ()=>{})
const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})

const emit = defineEmits(['updateMatch'])

const isDialogOpenRef = ref(false)
const selectImageRef = ref<Array<File>>([])
const whichCompetitor = computed(() =>{
    return props.isCompetitor1? 'competitor1': 'competitor2'
})

const uploadScoreCardImage = async (imageFile: File) => 
    await genericPostHttpRequestFormBodyNoParams<SingleMatchResponse>(
        `/matches/${props.matchId}/${whichCompetitor.value}/scorecard`, imageFile)
const { mutate } = useMutation<SingleMatchResponse, AxiosResponse<GenericErrorResponse>, any>(
    ["uploadNewScoreCardForCompetiorInMatch"],
    uploadScoreCardImage,
    {
        onSuccess: (data) => {
            isDialogOpenRef.value = false
            emit('updateMatch', data)
            popUpSuccess('Image has been uploaded succesfully', 5000)
        }, 
        onError: (error)=>{
			popUpError(error.data.message || 'Unknown login error', 5000)
		},
        retry: 0
    }
)
const uploadImageToCompetitorMach = () =>{
    if(selectImageRef.value.length<1){
        popUpWarning('Please select image', 5000)
        return
    }
    mutate(selectImageRef.value[0])
}
</script>
<template>
    <VBtn @click="isDialogOpenRef = true">
        <VIcon icon="mdi-upload"/>
        <VDialog
            v-model="isDialogOpenRef"
            width="25%"
        >
            <VCard>
                <VCardText>
                    <VFileInput 
                    v-model="selectImageRef" 
                    prepend-icon="mdi-camera" 
                    label="Image input" /> 
                    <VBtn @click="uploadImageToCompetitorMach">upload</VBtn>
                </VCardText>
            </VCard>
        </VDialog>
    </VBtn>
</template>
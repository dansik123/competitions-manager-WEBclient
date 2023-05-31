<script setup lang="ts">
import { inject, ref } from "vue";
import { genericPostHttpRequestNoParams } from "@/apiHttp/RequestsApi";
import type { GenericErrorResponse } from "@/types/HttpResponseTypes";
import type { AxiosError } from 'axios';
import { useMutation } from "@tanstack/vue-query";
import AcceptDialog from "@/components/AcceptDialog.vue";

const props = defineProps({
    btnDisabled:{
        type: Boolean,
        required: true
    },
    groupLeaguePrefix: {
        type: String,
        required: true
    }
})

const isDialogOpen = ref(false)

const popUpSuccess: (msg: string, timeout: number) => void = inject("okayToastPopUp", ()=>{})
const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})

const updateCompetitorsAverageScoresHttpFn = async () => 
    await genericPostHttpRequestNoParams(`/leagues/groups/${props.groupLeaguePrefix}/finish`, {})
const { mutate } = useMutation<any, AxiosError<any, GenericErrorResponse>, any>(
    ["updateCompetitorsAverageScores"],
    updateCompetitorsAverageScoresHttpFn,
    {
        onSuccess: () => {
            popUpSuccess('League group all competitors average scores have been updated', 5000)
        }, 
        onError: (error)=>{
			popUpError(error.response?.data.message || 'Unknown login error', 5000)
		},
        retry: 0
    }
)

const deleteLeague = (isDialogConfirmSuccess: boolean) =>{
    if(isDialogConfirmSuccess){
        mutate({})
    }
}
</script>
<template>
    <VBtn @click="isDialogOpen = true" :disabled="props.btnDisabled">
        Update average scores
    </VBtn>
    <AcceptDialog v-model:showDialog="isDialogOpen" @dialogConfirm="deleteLeague">
        <template v-slot:dialog-title>
            Confirm to update competitors Average scores for league group
        </template>
        <template v-slot:dialog-text>
            Are you sure you want to do it?
        </template>
    </AcceptDialog>
</template>
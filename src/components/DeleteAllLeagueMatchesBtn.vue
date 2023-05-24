<script setup lang="ts">
import { inject, ref } from "vue";
import { genericDeleteHttpRequestNoParamsNoBody } from "@/apiHttp/RequestsApi";
import type { GenericErrorResponse } from "@/types/HttpResponseTypes";
import type { AxiosError } from 'axios';
import { useMutation } from "vue-query";
import navRouter from "@/router";
import AcceptDialog from "@/components/AcceptDialog.vue";

const props = defineProps({
    leagueId: {
        type: Number,
        required: true,
    }
})

const isDialogOpen = ref(false)

const popUpSuccess: (msg: string, timeout: number) => void = inject("okayToastPopUp", ()=>{})
const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})

const deleteLeagueMatchesHttpFn = async () => 
    await genericDeleteHttpRequestNoParamsNoBody(`/leagues/${props.leagueId}/matches`)
const { mutate } = useMutation<any, AxiosError<any, GenericErrorResponse>, any>(
    "deleteLeagueMatchesById",
    deleteLeagueMatchesHttpFn,
    {
        onSuccess: () => {
            popUpSuccess('League matches has been deleted', 5000)
            navRouter.go(0)
        }, 
        onError: (error)=>{
			popUpError(error.response?.data.message || 'Unknown login error', 5000)
		},
        retry: 0
    }
)

const deleteLeagueMatches = (isDialogConfirmSuccess: boolean) =>{
    if(isDialogConfirmSuccess){
        mutate({})
    }
}
</script>
<template>
    <VBtn @click="isDialogOpen = true">
        Delete all league matches
    </VBtn>
    <AcceptDialog v-model:showDialog="isDialogOpen" @dialogConfirm="deleteLeagueMatches">
        <template v-slot:dialog-title>
            Confirm delete league matches
        </template>
        <template v-slot:dialog-text>
            Are you sure you want to delete all matches(this includes all matches scores)
        </template>
    </AcceptDialog>
</template>
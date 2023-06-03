<script setup lang="ts">
import { inject, ref } from "vue";
import { genericDeleteHttpRequestNoParamsNoBody } from "@/apiHttp/RequestsApi";
import type { GenericErrorResponse } from "@/types/HttpResponseTypes";
import type { AxiosResponse } from 'axios';
import { useMutation } from "@tanstack/vue-query";
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

const deleteLeagueHttpFn = async () => 
    await genericDeleteHttpRequestNoParamsNoBody(`/leagues/${props.leagueId}`)
const { mutate } = useMutation<any, AxiosResponse<GenericErrorResponse>, any>(
    ["deleteLeagueById"],
    deleteLeagueHttpFn,
    {
        onSuccess: () => {
            popUpSuccess('League has been deleted succesfully', 5000)
            navRouter.push({ name: 'leagues'})
        }, 
        onError: (error)=>{
			popUpError(error.data.message || 'Unknown login error', 5000)
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
    <VBtn @click="isDialogOpen = true">
        Delete league
    </VBtn>
    <AcceptDialog v-model:showDialog="isDialogOpen" @dialogConfirm="deleteLeague">
        <template v-slot:dialog-title>
            Confirm delete entire league
        </template>
        <template v-slot:dialog-text>
            Are you sure you want to delete entire league
            (this includes information about league competitors, matches and scores)
        </template>
    </AcceptDialog>
</template>
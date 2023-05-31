<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import { genericPostHttpRequestNoParams } from "@/apiHttp/RequestsApi";
import type { GenericErrorResponse } from "@/types/HttpResponseTypes";
import { inject } from "vue";
import type { AxiosError } from "axios";

const props = defineProps({
    leagueId: {
        type: Number,
        required: true
    },
    leagueHasMatches:{
        type: Boolean,
        required: true
    }
})
const emits = defineEmits(['update:leagueHasMatches'])
const popUpSuccess: (msg: string, timeout: number) => void = inject("okayToastPopUp", ()=>{})
const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})


const generateLeagueMatchesFn = async (): Promise<any> =>
    await genericPostHttpRequestNoParams<any, any>(`/leagues/${props.leagueId}/matches/generate`,{})
const generateMutation = useMutation<any, AxiosError<any, GenericErrorResponse>, any>(
    ["generateMatchesForLeague"],
    generateLeagueMatchesFn,
    {
        onSuccess: () =>{
            popUpSuccess("Matches for league have been generated succesfully", 5000)
            emits('update:leagueHasMatches', true);
        },
        onError: (error)=>{
            popUpError(error.response?.data.message || 'Unknown login error', 5000)
        }
    }
)

</script>
<template>
    <VBtn @click="generateMutation.mutate({})">
        Generate matches
    </VBtn>
</template>

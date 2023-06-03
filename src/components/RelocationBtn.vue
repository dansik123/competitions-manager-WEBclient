<script setup lang="ts">
import { inject } from "vue";
import { useMutation } from "@tanstack/vue-query";
import { genericPostHttpRequestNoParams } from "@/apiHttp/RequestsApi";
import type { GenericErrorResponse } from "@/types/HttpResponseTypes";
import type { AxiosResponse } from 'axios';
import type { LeaguesRelocateDto } from "@/types/HttpRequestTypes";

const props = defineProps({
    leagueGroupRelocateData: {
        type: Object as () => LeaguesRelocateDto,
        required: true,
    },
    isDisabled:{
        type: Boolean,
        required: true
    }
})

const emits = defineEmits(['onRelocationSuccess'])

const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})
const popUpSuccess: (msg: string, timeout: number) => void = inject("okayToastPopUp", ()=>{})

const relocateUsersAcrossLeagueFn = async (relocateData: LeaguesRelocateDto) => 
    await genericPostHttpRequestNoParams<LeaguesRelocateDto, any>('/leagues/relocate', relocateData)

const { mutate } = useMutation<any, AxiosResponse<GenericErrorResponse>, LeaguesRelocateDto>(
    relocateUsersAcrossLeagueFn,
{
    onError: (error)=>{
        popUpError(error.data.message || 'Unknown login error', 5000)
    },
    onSuccess: () => {
        emits('onRelocationSuccess');
        popUpSuccess('League group users relocation and promotion succesfull', 5000)
    },
})

//methods
function leagueGroupRelocation(){
    mutate(props.leagueGroupRelocateData);
}
</script>
<template>
    <VBtn color="primary" @click="leagueGroupRelocation()" :disabled="props.isDisabled">
        Promote and relocate users
    </VBtn>
</template>
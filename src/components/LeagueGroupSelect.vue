<script setup lang="ts">
import { inject, ref, watch } from "vue";
import { genericGetHttpRequest } from "@/apiHttp/RequestsApi";
import type { GenericErrorResponse } from "@/types/HttpResponseTypes";
import type { AxiosResponse } from 'axios';
import { useQuery } from "@tanstack/vue-query";

const props = defineProps({
    gunType: {
        type: String,
        required: true,
    }
})

watch(() => props.gunType, () => {
    selectedLeagueGroup.value = ''
    refetch({})
})

const emits = defineEmits(['selectedLeagueGroup'])
const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})

const selectOptionsRef = ref<Array<string>>([])
const selectedLeagueGroup = ref("")

const fetchListOfLeagueGroups = async () => 
    await genericGetHttpRequest<Array<string>>('/leagues/groups', { gunType: props.gunType })
const { isError, isLoading, error, refetch } = useQuery<Array<string>, AxiosResponse<GenericErrorResponse>>(
['getLeagueGroupsList'],
fetchListOfLeagueGroups,
{
    onError: (error)=>{
        popUpError(error.data.message || 'Unknown fetch error', 5000)
    },
    onSuccess: (responseData) => {
        selectOptionsRef.value = ['', ...responseData]
    },
})
</script>
<template>
    <div>
        <VContainer v-if="isError">
            <VRow>
                <p>Error: {{ error?.data.message }}</p>
            </VRow>
        </VContainer>
        <VContainer v-else>
            <VRow>
                <VSelect class="league_group_select"
                v-model="selectedLeagueGroup"
                clearable
                label="Select league group"
                :loading="isLoading"
                :items="selectOptionsRef"
                @update:modelValue="() => emits('selectedLeagueGroup', selectedLeagueGroup)"
                >
                </VSelect>  
            </VRow>
        </VContainer>
    </div>
</template>
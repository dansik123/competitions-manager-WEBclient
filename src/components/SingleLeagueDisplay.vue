<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { genericGetHttpRequest } from "@/apiHttp/RequestsApi";
import type { GenericErrorResponse, UserLeagueMatchesBooleanResponse } from "@/types/HttpResponseTypes";
import { computed, inject, ref } from "vue";
import type { AxiosResponse } from "axios";
import { roundFormat } from "@/components/Formaters"

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    leagueHasMatches: {
        type: Boolean,
        required: true,
    },
    leagueId: {
        type: Number,
        required: true,
    }
})

const emit = defineEmits(['update:modelValue', 'update:leagueHasMatches'])
const leagueDataRef = ref<UserLeagueMatchesBooleanResponse>(
    {
        leagueId: -1,
        leagueName: '',
        leagueMaxCompetitors: -1,
        competitorsCount: 0,
        totalRounds: 0,
        currentRoundNo: 0,
        leagueGunType: '',
        matchesGenerated: props.leagueHasMatches
    }
)

const roundComputedFormat = computed(()=>{
    const leagueData = leagueDataRef.value
    return roundFormat(leagueData.currentRoundNo, leagueData.totalRounds)
})
const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})

const fetchLeagueData = async () => 
    await genericGetHttpRequest<UserLeagueMatchesBooleanResponse>(`/leagues/${props.leagueId}`, {})
const { isError, isLoading, error } = useQuery<UserLeagueMatchesBooleanResponse, AxiosResponse<GenericErrorResponse>>(
    ['getLeaguesData'], 
    fetchLeagueData,
    {
        onSuccess: (data) => {
            leagueDataRef.value = data
            emit('update:modelValue', true)
            emit('update:leagueHasMatches', data.matchesGenerated)
        },  
        onError: (error) => {
            popUpError(error.data.message || 'Unknown error message', 5000)
        },
        retry: 0 
    }
)
</script>
<template>
    <span v-if="isLoading">Loading...</span>
    <span v-else-if="isError">Error: {{ error?.data.message }}</span>
    <VCard v-else>
        <VContainer> 
            <VRow>
                <VCol cols="5">
                    <VTextField :disabled="true"
                    v-model="leagueDataRef.leagueName"
                    label="League Name"/>
                </VCol>
                <VCol cols="4">
                    <VTextField :disabled="true"
                    v-model="leagueDataRef.leagueGunType"
                    label="League gun type" />
                </VCol>
                <VCol cols="3">
                    <VTextField :disabled="true"
                    v-model="roundComputedFormat"
                    label="League rounds info" />
                </VCol>
            </VRow>
            <VRow>
                <VCol cols="4">
                    <VTextField :disabled="true"
                    v-model="leagueDataRef.leagueMaxCompetitors"
                    label="Max competitors in league"/> 
                </VCol>
                <VCol cols="4">
                    <VTextField :disabled="true"
                    v-model="leagueDataRef.competitorsCount"
                    label="Number of competitors" />
                </VCol>
            </VRow>
        </VContainer>
    </VCard>
</template>
<script setup lang="ts">
import { inject } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { genericGetHttpRequest } from "@/apiHttp/RequestsApi";
import type { GenericErrorResponse, LeagueCompetitorResponse } from "@/types/HttpResponseTypes";
import type { AxiosError } from 'axios';

const props = defineProps({
    leagueId: {
        type: Number,
        required: true,
    }
})

const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})

const fetchLeagueCompetitors = async () => 
    await genericGetHttpRequest<Array<LeagueCompetitorResponse>>(`/leagues/${props.leagueId}/competitors`, {})
const { data, isError, isLoading, error } = 
    useQuery<Array<LeagueCompetitorResponse>, AxiosError<GenericErrorResponse, any>>(
    ['getLeaguesCompetitors'], 
    fetchLeagueCompetitors,
    {
        onError: (error) => {
            popUpError(error.response?.data.message || 'Unknown error message', 5000)
        },
        retry: 0
    })
</script>
<template>
    <span v-if="isLoading">Loading...</span>
    <span v-else-if="isError">Error: {{ error?.message }}</span>
    <VTable v-else>
        <thead>
            <tr>
                <th class="text-left">Competitor firstname</th>
                <th class="text-left">Competitor lastname</th>
                <th class="text-left">Competitor Average Score</th>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="leagueCompetitor in data"
                :key="leagueCompetitor.userId"
            >
                <td>{{ leagueCompetitor.firstname }}</td>
                <td>{{ leagueCompetitor.lastname }}</td>
                <td>{{ leagueCompetitor.avgScore }}</td>
            </tr>
        </tbody>
    </VTable>
</template>
<script setup lang="ts">
import { useQuery } from "vue-query";
import { genericGetHttpRequest } from "@/apiHttp/RequestsApi";
import type { GenericErrorResponse, UserMatchResponse } from "@/types/HttpResponseTypes";
import { ref, watch } from "vue";
import type { AxiosError } from "axios";
import { userTableCellFormater, dateFormater } from "@/components/Formaters"

const props = defineProps({
    leagueId: {
        type: Number,
        required: true
    },
    userId:{
        type: Number,
        required: true
    }
})

watch(() => props.leagueId, async (newLeagueId, oldLeagueId)=>{
    //any default value should result to display empty array of data
    if(newLeagueId == -1 || newLeagueId == undefined || newLeagueId== oldLeagueId){ 
        return;
    }
    //otherwise we reset query params to default ones and we set new gunType there too.
    //finally we repeate fetch to get table updated
    refetch.value({});
})

const matchesDataRef = ref<Array<UserMatchResponse>>([]);
const fetchAllUserMatchesInLeague = async (params: any) => 
    await genericGetHttpRequest<Array<UserMatchResponse>>(`/matches`, params)
const { isError, isLoading, error, refetch } = 
    useQuery<Array<UserMatchResponse>, AxiosError<GenericErrorResponse, any>>(
    'getUserMatchesInLeague', 
    () => fetchAllUserMatchesInLeague({leagueId: props.leagueId, userId: props.userId}),
    {
        onSuccess: (data) =>{
            matchesDataRef.value = data
        },
        retry: 0 
    }
)

</script>
<template>
    <span v-if="isLoading">Loading...</span>
    <span v-else-if="isError">Error: {{ error?.response?.data.message}}</span>
    <div v-else>
        <VContainer fluid>
            <VRow>
                <VCol>
                    <VTable v-if="matchesDataRef.length > 1">
                        <thead>
                            <tr>
                                <th class="text-left">League match round No.</th>
                                <th class="text-left">Match date</th>
                                <th class="text-left">Competitor 1</th>
                                <th class="text-left">Competitor 2</th>
                                <th class="text-left">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="matchData in matchesDataRef"
                                :key="matchData.matchId"
                            >
                                <td>{{ matchData.roundNo }}</td>
                                <td>{{ dateFormater(matchData.matchDate) }}</td>
                                <td>{{ userTableCellFormater(matchData.competitor1) }}</td>
                                <td>{{ userTableCellFormater(matchData.competitor2) }}</td>
                                <td>See</td>
                            </tr>
                        </tbody>
                    </VTable>
                    <p v-else>
                        No matches found/generated in this league
                    </p>
                </VCol>
            </VRow>
        </VContainer>
    </div>
</template>
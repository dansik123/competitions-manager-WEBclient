<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { genericGetHttpRequest } from "@/apiHttp/RequestsApi";
import type { GenericErrorResponse, SingleMatchResponse, SingleRoundMatchesResponse } from "@/types/HttpResponseTypes";
import { ref } from "vue";
import type { AxiosError } from "axios";
import { dateFormater, userTableCellFormater } from "@/components/Formaters";
import { useAuthStore } from "@/stores/AuthorizationStore";
import DateBtn from "@/components/adminComponents/DateBtn.vue"
import UpdateMatchScore from "@/components/adminComponents/UpdateMatchScore.vue";
import ScoreCardImageUpload from "@/components/ScoreCardImageUpload.vue";
import ImageDialogDisplay from "@/components/ImageDialogDisplay.vue";

const props = defineProps({
    leagueId: {
        type: Number,
        required: true,
    }
})

const authStore = useAuthStore()

const leagueMatchesDataRef = ref<Array<SingleRoundMatchesResponse>>([]);
const fetchLeagueAllMatches = async (leagueId: number) => 
    await genericGetHttpRequest<Array<SingleRoundMatchesResponse>>(`/leagues/${leagueId}/matches`, {})
const { isError, isLoading, error } = 
    useQuery<Array<SingleRoundMatchesResponse>, AxiosError<GenericErrorResponse, any>>(
    ['getAllLeagueMatches'], 
    () => fetchLeagueAllMatches(props.leagueId),
    {
        onSuccess: (data) =>{
            leagueMatchesDataRef.value = data
        },
        retry: 0 
    }
)

const correctMatch = (roundArrayIndex: number, matchArrayIndex: number, matchData: SingleMatchResponse) => {
    leagueMatchesDataRef.value[roundArrayIndex].matches[matchArrayIndex] = matchData
}


</script>
<template>
    <span v-if="isLoading">Loading...</span>
    <span v-else-if="isError">Error: {{ error?.response?.data.message}}</span>
    <div v-else>
        <VContainer fluid>
            <VRow v-for="roundData, roundIndex in leagueMatchesDataRef" :key="roundIndex">
                <VCol>
                    <h3>Match round {{ roundData.roundNo }}</h3>
                    <VSpacer></VSpacer>
                    <div v-if="roundData.roundPauseUsers.length > 0">
                        <VItemGroup>
                            <div class="text-caption mb-2">Users don't compete in this round</div>
                            <VItem v-for="pauseUser in roundData.roundPauseUsers" 
                                :key="pauseUser.userId">
                                <VChip>
                                    {{ userTableCellFormater(pauseUser) }}
                                </VChip>
                            </VItem>
                        </VItemGroup>
                    </div>
                    
                    <VTable>
                        <thead>
                            <tr>
                                <th class="text-left">Match date</th>
                                <th class="text-left">Competitor 1</th>
                                <th class="text-left">Competitor 2</th>
                                <th class="text-left">Match result</th>
                                <th class="text-left">Score Cards</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="match, matchIndex in roundData.matches"
                                :key="match.matchId"
                            >
                                <td v-if="authStore.isLoginUserAdmin">
                                    <DateBtn 
                                        :matchId="match.matchId" 
                                        v-model:matchDate="match.matchDate">
                                    </DateBtn>
                                </td>
                                <td v-else>{{ dateFormater(match.matchDate) }}</td>
                                <td>{{ userTableCellFormater(match.competitor1) }}</td>
                                <td>{{ userTableCellFormater(match.competitor2) }}</td>
                                <td>
                                    <UpdateMatchScore
                                        v-model:matchResult="match.slotMatchResult" 
                                        :matchId="match.matchId"/>
                                </td>
                                <td>
                                    <ImageDialogDisplay 
                                        density="comfortable" :useIcon="true" 
                                        :isCompetitor1="true" :match-id="match.matchId" 
                                        :disabled="match.competitor1ScoreCardLink==null">
                                        <VIcon icon="mdi-image"></VIcon>
                                        <VTooltip
                                            activator="parent"
                                            location="top"
                                        >
                                            {{ userTableCellFormater(match.competitor1) }}'s score card
                                        </VTooltip>
                                    </ImageDialogDisplay>
                                    <ScoreCardImageUpload v-if="authStore.isLoginUserAdmin || authStore.isLoginUserSpectator"
                                        @updateMatch="(newMatch) => correctMatch(roundIndex, matchIndex, newMatch)" 
                                        :isCompetitor1="true" 
                                        :matchId="match.matchId"/>
                                    <ImageDialogDisplay 
                                        density="comfortable" :useIcon="true" 
                                        :isCompetitor1="false" :matchId="match.matchId" 
                                        :disabled="match.competitor2ScoreCardLink==null">
                                        <VIcon icon="mdi-image"></VIcon>
                                        <VTooltip
                                            activator="parent"
                                            location="top"
                                        >
                                            {{ userTableCellFormater(match.competitor2) }}'s score card
                                        </VTooltip>
                                    </ImageDialogDisplay>
                                    <ScoreCardImageUpload v-if="authStore.isLoginUserAdmin || authStore.isLoginUserSpectator"
                                        @updateMatch="(newMatch) => correctMatch(roundIndex, matchIndex, newMatch)"
                                        :isCompetitor1="false" 
                                        :matchId="match.matchId"/>
                                </td>
                            </tr>
                        </tbody>
                    </VTable>
                </VCol>
            </VRow>
        </VContainer>
    </div>
</template>
<script setup lang="ts">
import { useQuery } from "vue-query";
import { genericGetHttpRequest } from "@/apiHttp/RequestsApi";
import type { GenericErrorResponse, LeagueRoundSlotPointsResponse, SummaryPointsRowResponse } from "@/types/HttpResponseTypes";
import { ref, watch } from "vue";
import type { AxiosError } from "axios";
import { userTableCellFormater } from "@/components/Formaters";
import { areUsersWithTheSameId } from "@/components/Utils";

const props = defineProps({
    leaguesIdsStringArray: {
        type: String,
        required: true
    }
})

watch(() => props.leaguesIdsStringArray, (newValue) => {
    if(newValue != '' || newValue == undefined){
        leagueSummaryDataRef.value = []
        return
    }
    refetch.value({})
})

const leagueSummaryDataRef = ref<Array<SummaryPointsRowResponse<LeagueRoundSlotPointsResponse>>>([]);
const componentError = ref('')
const fetchLeagueGroupSummaryMatches = async (leaguesIdsStringArray: String) => 
    await genericGetHttpRequest<Array<SummaryPointsRowResponse<LeagueRoundSlotPointsResponse>>>(
        `/leagues/summary`, {leaguesIds: leaguesIdsStringArray})
const { isError, isLoading, refetch } = 
    useQuery<Array<SummaryPointsRowResponse<LeagueRoundSlotPointsResponse>>, AxiosError<GenericErrorResponse, any>>(
    'getLeagueSummaryData', 
    () => fetchLeagueGroupSummaryMatches(props.leaguesIdsStringArray),
    {
        onSuccess: (data) =>{
            leagueSummaryDataRef.value = data
        },
        onError:(error) =>{
            if(error?.response?.status == 409){
                componentError.value = "No matches have been created yet"
            }else{
                componentError.value = "Can't display summary table(other problem)"
            }
        },
        retry: 0 
    }
)


</script>
<template>
    <span v-if="isLoading">Loading...</span>
    <div v-else-if="isError">
        <VCard>
            <VCardTitle>{{ componentError }}</VCardTitle>
        </VCard>
    </div>
    <div v-else-if="leagueSummaryDataRef.length < 1">
        Leagues summary Data is empty
    </div>
    <div v-else>
        <VTable>
            <thead>
                <tr>
                    <th class="text-left">Competitor</th>
                    <th class="text-left">All league rounds Points</th>
                    <th class="text-left">All Rounds Total</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="leagueSummaryRow, index in leagueSummaryDataRef" :key="index">
                    <td>
                        {{ userTableCellFormater(leagueSummaryRow.pointsOwner) }}
                    </td>
                    <td>
                        <VBtn density="comfortable" 
                            v-for="leagueSinglePoints in leagueSummaryRow.individualPoints"
                            :key="index"
                        >
                            <span>{{ leagueSinglePoints.slotLeaguePoints }}</span>
                            <VTooltip
                                activator="parent"
                                location="top"
                            >
                                <span>League Round {{ leagueSinglePoints.leagueRoundNumber }}</span>
                                <div>
                                    <span 
                                        v-if="areUsersWithTheSameId(
                                            leagueSummaryRow.pointsOwner,
                                            leagueSinglePoints.competitor1)"
                                    >
                                        Opponent: {{ userTableCellFormater(leagueSinglePoints.competitor2) }}
                                    </span>
                                    <span v-else>
                                        Opponent: {{ userTableCellFormater(leagueSinglePoints.competitor1) }}
                                    </span>
                                </div>
                                <div v-if="leagueSinglePoints.slotShootingResult != null">
                                    <span>Score: {{ leagueSinglePoints.slotShootingResult }}</span>
                                </div>
                            </VTooltip>
                        </VBtn>
                    </td>
                    <td>
                        {{ leagueSummaryRow.totalLeaguePoints }}
                    </td>
                </tr>
            </tbody>
        </VTable>
    </div>
</template>
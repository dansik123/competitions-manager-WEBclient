<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { genericGetHttpRequest } from "@/apiHttp/RequestsApi";
import type { GenericErrorResponse, SingleSlotUserPointsResponse, SummaryPointsRowResponse } from "@/types/HttpResponseTypes";
import { ref, watch } from "vue";
import type { AxiosError } from "axios";
import { userTableCellFormater } from "@/components/Formaters";
import { areUsersWithTheSameId } from "@/components/Utils";

const props = defineProps({
    leagueId: {
        type: Number,
        required: true,
    },
    areMatchesGenerated: {
        type: Boolean,
        required: true
    }
})

watch(() => props.areMatchesGenerated, () => {
  refetch({})
})

const leagueSummaryDataRef = ref<Array<SummaryPointsRowResponse<SingleSlotUserPointsResponse>>>([]);
const componentError = ref('')
const fetchLeagueSummaryMatches = async (leagueId: number) => 
    await genericGetHttpRequest<Array<SummaryPointsRowResponse<SingleSlotUserPointsResponse>>>(`/leagues/${leagueId}/summary`, {})
const { isError, isLoading, refetch } = 
    useQuery<Array<SummaryPointsRowResponse<SingleSlotUserPointsResponse>>, AxiosError<GenericErrorResponse, any>>(
    ['getLeagueSummaryData'], 
    () => fetchLeagueSummaryMatches(props.leagueId),
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

const refreshTableData = () =>{
    leagueSummaryDataRef.value = []
    refetch({})
}


</script>
<template>
    <span v-if="isLoading">Loading...</span>
    <div v-else-if="isError">
        <VCard>
            <VCardTitle>{{ componentError }}</VCardTitle>
        </VCard>
    </div>
    <div v-else>
        <VBtn @click="refreshTableData">Refresh</VBtn>
        <VTable>
            <thead>
                <tr>
                    <th class="text-left">Competitor</th>
                    <th class="text-left">Recent round Points</th>
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
                                <span>Round {{ leagueSinglePoints.roundNumber }}</span>
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
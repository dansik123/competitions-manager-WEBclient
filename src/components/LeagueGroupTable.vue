<script setup lang="ts">
import { computed, inject, ref, watch } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { genericGetHttpRequest } from "@/apiHttp/RequestsApi";
import type { GenericErrorResponse, LeagueGroupRelocationResponse } from "@/types/HttpResponseTypes";
import type { AxiosError } from 'axios';
import { useAuthStore } from "@/stores/AuthorizationStore"
import type { LeaguesRelocateDto } from "@/types/HttpRequestTypes";
import RelocationBtn from "@/components/RelocationBtn.vue";
import UpdateCompetitorsAvgScoresBtn from "@/components/UpdateCompetitorsAvgScoresBtn.vue";

const props = defineProps({
    leagueGroupName: {
        type: String,
        required: true,
    }
})

const tranformToRelocationData = computed(() =>{
    let relocationObject: LeaguesRelocateDto = {
        leaguesGroupPrefix: leagueGroupStatusData.value.leagueGroupName,
        groupAllLeaguesIds: leagueGroupStatusData.value.
            leaguesStatus.map(leagueStatus => leagueStatus.leagueId)
    }
    return relocationObject
})
const defaultStatusData = {
    leagueGroupName: '',
    readyToRelocate: false,
    leagueGroupFinished: false,
    leaguesStatus: []
}

const getLeaguesIds = () =>{
    return leagueGroupStatusData.value
        .leaguesStatus.map(leagueStat => leagueStat.leagueId)
}

watch(() => props.leagueGroupName, (newValue, oldValue) => {
    if(newValue != oldValue && newValue != ''){
        leagueGroupStatusData.value = defaultStatusData
        refetch({})
    }
})

const leagueGroupStatusData = ref<LeagueGroupRelocationResponse>(defaultStatusData)
const isLeagueRelocateReady = ref(false)
const isLeagueFinishReady = ref(false)
const authStore = useAuthStore()

const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})

const fetchGroupLeaguesStatusFn = async () => 
    await genericGetHttpRequest<LeagueGroupRelocationResponse>(`/leagues/groups/${props.leagueGroupName}`, {})
const { isError, isLoading, error, refetch } = 
    useQuery<LeagueGroupRelocationResponse, AxiosError<GenericErrorResponse, any>>(
    ['getGroupLeaguesStatus'], 
    fetchGroupLeaguesStatusFn,
    {
        onSuccess: (data) =>{
            leagueGroupStatusData.value = data
            isLeagueRelocateReady.value = data.readyToRelocate
            isLeagueFinishReady.value = data.leagueGroupFinished
        },
        onError: (error) => {
            popUpError(error.response?.data.message || 'Unknown error message', 5000)
        },
        retry: 0
    })
</script>
<template>
    <span v-if="isLoading">Loading...</span>
    <span v-else-if="isError">Error: {{ error?.message }}</span>
    <div v-else>
        <h5>League group {{ leagueGroupStatusData.leagueGroupName }} status</h5>
        <VTable>
            <thead>
                <tr>
                    <th class="text-left">League name</th>
                    <th class="text-left">League status</th>
                    <th class="text-left">Options</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="leagueStatusData in leagueGroupStatusData.leaguesStatus"
                    :key="leagueStatusData.leagueId"
                >
                    <td>{{ leagueStatusData.leagueName }}</td>
                    <td>{{ leagueStatusData.leagueStatus }}</td>
                    <td>
                        <VContainer>
                            <VRow>
                                <RouterLink :to="{ path: '/league', query: { id: leagueStatusData.leagueId }}">
                                    <VIcon icon="mdi-eye"></VIcon>
                                </RouterLink>
                            </VRow>
                        </VContainer>
                    </td>
                </tr>
            </tbody>
        </VTable>
        <div v-if="authStore.isLoginUserAdmin">
            <div class="d-flex flex-row">
                <RelocationBtn 
                    :isDisabled="!isLeagueRelocateReady || isLeagueFinishReady" 
                    :leagueGroupRelocateData="tranformToRelocationData"
                    @onRelocationSuccess="refetch({})" />
                <UpdateCompetitorsAvgScoresBtn 
                    :btnDisabled="!isLeagueFinishReady" 
                    :groupLeaguePrefix="leagueGroupStatusData.leagueGroupName"/>
            </div>
        </div>
        <div>
            <div>
                <VBtn>
                    <RouterLink :to="{ path: '/league-groups-summary', query: { groupLeaguesIds: getLeaguesIds() }}">
                        League Summary
                    </RouterLink>
                </VBtn>
            </div>
        </div>
    </div>
</template>
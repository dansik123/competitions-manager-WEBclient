<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { genericGetHttpRequest } from "@/apiHttp/RequestsApi";
import type { GenericErrorResponse, PagedResponse, PageQuerySortedParams, PaginationData, UserLeagueResponse } from "@/types/HttpResponseTypes";
import { inject, ref } from "vue";
import type { AxiosResponse } from "axios";
import { paginationQuerySortedDefault, paginationResponseDefault } from "@/components/PaginationDefaults";
import { useAuthStore } from "@/stores/AuthorizationStore";
import { roundFormat } from "@/components/Formaters"

const paginationDataRef = ref<PaginationData>(paginationResponseDefault)
const paginationQueryData = ref<PageQuerySortedParams>(paginationQuerySortedDefault)
const authStore = useAuthStore()

const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})

const fetchLeaguesPage = async (paginationData: PageQuerySortedParams) => 
    await genericGetHttpRequest<PagedResponse<UserLeagueResponse>>(`/leagues`, paginationData)
const { data, isError, isLoading, error, refetch } = useQuery<PagedResponse<UserLeagueResponse>, AxiosResponse<GenericErrorResponse>>(
    ['getLeaguesPage'], 
    () => fetchLeaguesPage(paginationQueryData.value),
    {
        onSuccess: (data) =>{
            paginationDataRef.value = data
            paginationDataRef.value.paginationNumber = data.number + 1
        },
        onError: (error) => {
            popUpError(error.data.message || 'Unknown error message', 5000)
        },
        retry: 0 
    }
)

const updateContent = (newPageNumber: number) => {
    //the request page value starts from 0 therefore I have to substart 1
    //from pagination numbers value which starts from 1.
    paginationQueryData.value.page = newPageNumber - 1;
    refetch({}) //refetch must have at least empty object to execute
}
</script>
<template>
    <span v-if="isLoading">Loading...</span>
    <span v-else-if="isError">Error: {{ error?.data.message }}</span>
    <VTable v-else>
        <thead>
            <tr>
                <th class="text-left">League Name</th>
                <th class="text-left">Max competitors</th>
                <th class="text-left">Competitors count</th>
                <th class="text-left">Rounds info</th>
                <th class="text-left">League gun type</th>
                <th class="text-left">Options</th>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="league in data?.content"
                :key="league.leagueId"
            >
                <td>{{ league.leagueName }}</td>
                <td>{{ league.leagueMaxCompetitors }}</td>
                <td>{{ league.competitorsCount}}</td>
                <td>{{ roundFormat(league.currentRoundNo, league.totalRounds) }}</td>
                <td>{{ league.leagueGunType }}</td>
                <td>
                    <VContainer>
                        <VRow>
                            <RouterLink :to="{ path: '/league', query: { id: league.leagueId }}">
                                <VIcon :icon="authStore.isLoginUser? 'mdi-eye': 'mdi-pencil'"></VIcon>
                            </RouterLink>
                            <!-- <a @click="">
                                <VIcon icon="mdi-delete"></VIcon>
                            </a> -->
                        </VRow>
                    </VContainer>
                </td>
            </tr>
        </tbody>
    </VTable>
    <VPagination 
        v-model="paginationDataRef.paginationNumber"
        @update:modelValue="updateContent"
        :length="paginationDataRef.totalPages"></VPagination>
</template>
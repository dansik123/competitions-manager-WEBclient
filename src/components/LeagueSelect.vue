<script setup lang="ts">
import { ref } from "vue";
import { genericGetHttpRequest } from "@/apiHttp/RequestsApi";
import type { GenericErrorResponse, LeagueSelect } from "@/types/HttpResponseTypes";
import type { AxiosError } from 'axios';
import { useQuery } from "vue-query";
import { useAuthStore } from "@/stores/AuthorizationStore";

const props = defineProps({
    selectedLeagueId: {
        type: Number,
        required: true,
    }
})

const emits = defineEmits(['update:selectedLeagueId'])

const selectOptionsRef = ref<Array<LeagueSelect>>([])
const authStore = useAuthStore();

const fetchSelectableLeagues = async () => 
    await genericGetHttpRequest<Array<LeagueSelect>>('/leagues/selectable', { userId: authStore.getCurrentUserId})
const { isError, isLoading, error } = useQuery<Array<LeagueSelect>, AxiosError<GenericErrorResponse, any>>(
'getLeaguesForSelect',
fetchSelectableLeagues,
{
    onSuccess: (responseData) => {
        selectOptionsRef.value = [{ leagueId: -1, leagueName:'' }, ...responseData]
    },
})
</script>
<template>
    <div>
        <VContainer v-if="!isError && selectOptionsRef.length < 1">
            <VRow>
                <VCol>
                    <p>Sorry don't participate in any league now</p>
                </VCol>
            </VRow>
        </VContainer>
        <VContainer v-if="!isError">
            <VRow>
                <VSelect class="league_select"
                v-model="props.selectedLeagueId"
                clearable
                label="Select league"
                :loading="isLoading"
                :items="selectOptionsRef"
                :itemTitle="(item) => item.leagueName"
                :itemValue="(item) => item.leagueId"
                @update:modelValue="(leagueId) => emits('update:selectedLeagueId', leagueId)"
                >
                </VSelect>  
            </VRow>
        </VContainer>
        <VContainer v-else>
            <VRow>
                <p>Error: {{ error?.response?.data.message }}</p>
            </VRow>
        </VContainer>
    </div>
</template>
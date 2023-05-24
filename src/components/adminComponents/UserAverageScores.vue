<script setup lang="ts">
import { useQuery } from "vue-query";
import { genericGetHttpRequest } from "@/apiHttp/RequestsApi";
import type { UserAverageScores, GenericErrorResponse } from "@/types/HttpResponseTypes";

const props = defineProps({
    userId: {
        type: Number,
        nullable: true,
        required: true,
    }
})

const fetchAverageScoresFn = async () => 
    await genericGetHttpRequest<Array<UserAverageScores>>(
        `/users/${props.userId}/average-scores`, {})
const { data, isError, isLoading, error } = 
    useQuery<Array<UserAverageScores>, GenericErrorResponse>(
    'getUserAverageScores', 
    fetchAverageScoresFn,
    {
        retry: 0
    })
</script>
<template>
    <div v-if="userId != null">
        <span v-if="isLoading">Loading...</span>
        <span v-else-if="isError">Error: {{ error?.message }}</span>
        <div v-else>
            <VContainer v-if="data?.length != 0 && data?.length != undefined">
                <VRow>
                    <VCard v-for="avgScore in data" :key="avgScore.gunType">
                        <VCardTitle>Average {{ avgScore.gunType.toLowerCase() }} score:</VCardTitle>
                        <VCardText>{{ avgScore.avgScore }}</VCardText>
                    </VCard>
                </VRow>
            </VContainer>
            <VCard v-else>
                <VCardText>User does not have any average scores</VCardText>
            </VCard>
        </div>
    </div>
</template>
<script setup lang="ts">
import SingleLeagueDisplay from "@/components/SingleLeagueDisplay.vue";
import SingleLeagueCompetitors from "@/components/SingleLeagueCompetitors.vue";
import LeagueMatches from "@/components/LeagueMatches.vue";
import GenerateLeagueMatchesBtn from "@/components/adminComponents/GenerateLeagueMatchesBtn.vue";
import DeleteLeagueBtnVue from "@/components/DeleteLeagueBtn.vue";
import DeleteAllLeagueMatchesBtn from "@/components/DeleteAllLeagueMatchesBtn.vue";
import LeagueSummary from "@/components/LeagueSummary.vue"
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/AuthorizationStore";
import { queryParamNumberFormater } from "@/components/Formaters";

const router = useRoute()
const leagueIdQueryParam = computed(() => queryParamNumberFormater(router.query.id))

const authStore = useAuthStore();
const leagueReadOkRef = ref<boolean>(false);
const leagueHasGeneratedMatches = ref<boolean>(false);

</script>

<template>
	<VContainer fluid>
        <VRow>
            <h1>This is Leagues list page</h1>
        </VRow>
        <VRow>
            <VCol>
                <DeleteLeagueBtnVue 
                    v-if="authStore.isLoginUserAdmin && authStore.isLoginUserAdmin" 
                    :leagueId="leagueIdQueryParam" />
                <SingleLeagueDisplay 
                v-model="leagueReadOkRef" 
                :leagueId="leagueIdQueryParam" 
                v-model:leagueHasMatches="leagueHasGeneratedMatches" />
            </VCol>
        </VRow>
        <VRow v-if="leagueReadOkRef">
            <VCol>
                <SingleLeagueCompetitors :league-id="leagueIdQueryParam"/>
            </VCol>
        </VRow>
        <VRow v-if="leagueReadOkRef">
            <VCol v-if="leagueHasGeneratedMatches">
                <!-- THIS DELETE BUTTON DOES NOT WORK
                    <DeleteAllLeagueMatchesBtn 
                    v-if="authStore.isLoginUserAdmin" 
                    :leagueId="leagueIdQueryParam" /> -->
                <LeagueMatches :league-id="leagueIdQueryParam"/>
            </VCol>
            <VCol v-else-if="!leagueHasGeneratedMatches && authStore.isLoginUserAdmin">
                <GenerateLeagueMatchesBtn 
                :league-id="leagueIdQueryParam" 
                v-model:leagueHasMatches="leagueHasGeneratedMatches"/>
            </VCol>
            <VCol v-else>
                <VCard>
                    <VCardTitle>No Matches have been created yet</VCardTitle>
                </VCard>
            </VCol>
        </VRow>
        <VRow v-if="leagueReadOkRef">
            <VCol v-if="leagueHasGeneratedMatches">
                <LeagueSummary :leagueId="leagueIdQueryParam" :areMatchesGenerated = "leagueHasGeneratedMatches"/>
            </VCol>
            <VCol v-else>
                <VCard>
                    <VCardTitle>No matches generated in the current league round</VCardTitle>
                </VCard>
            </VCol>
        </VRow>
	</VContainer>
</template>
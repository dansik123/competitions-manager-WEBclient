<script setup lang="ts">
import UserLeagueMatches from "@/components/UserLeagueMatches.vue";
import LeagueSelectVue from "@/components/LeagueSelect.vue";
import { useAuthStore } from "@/stores/AuthorizationStore";
import { ref } from "vue";

const authStore = useAuthStore();
const selectedLeagueId = ref<number>(-1);

</script>

<template>
	<VContainer fluid>
        <VRow>
            <h1>This is Leagues list page</h1>
        </VRow>
        <VRow>
            <VCol>
                <LeagueSelectVue v-model:selectedLeagueId="selectedLeagueId" /> 
            </VCol>
        </VRow>
        <VRow>
            <VCol v-if="selectedLeagueId != -1" cols="12">
                <UserLeagueMatches :userId="authStore.getCurrentUserId" :leagueId="selectedLeagueId" />
            </VCol>
            <VCol cols="12" v-else>
                <p>Please select league</p>
            </VCol>
        </VRow>
	</VContainer>
</template>
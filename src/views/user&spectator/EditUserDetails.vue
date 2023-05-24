<script setup lang="ts">
import UserClub from "@/components/adminComponents/UserClub.vue";
import UserAverageScores from "@/components/adminComponents/UserAverageScores.vue";
import CurrentUSerDetails from "@/components/CurrentUserDetails.vue";
import { useAuthStore } from "@/stores/AuthorizationStore";
import { ref } from "vue";

const authStore = useAuthStore()
const detailsOk = ref(false)
</script>
<template>
    <VCard class="max-auto" >
        <VContainer flex>
            <VRow>
                <div class="title text-h2">My details:</div>
            </VRow>
            <VRow align="center" flex v-if="detailsOk">
                <VCol>
                    <UserAverageScores :userId="authStore.getCurrentUserId"/>
                </VCol>
                <VCol>
                    <UserClub :userId="authStore.getCurrentUserId" :editable="false"/>
                </VCol>
            </VRow>
            <VSpacer />
            <VRow>
                <VCol>
                    <CurrentUSerDetails v-model:isSuccess="detailsOk" />
                </VCol>
            </VRow>
        </VContainer>
    </VCard>
</template>
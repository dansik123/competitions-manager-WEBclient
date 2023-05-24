<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router'
import UserDetails from "@/components/adminComponents/UserDetails.vue";
import UserClub from "@/components/adminComponents/UserClub.vue";
import UserAverageScores from "@/components/adminComponents/UserAverageScores.vue";

const router = useRoute()
const pageIdQueryParam = computed(() =>{
    const idParam = router.query.id;
    return Number(idParam);
})
const detailsOk = ref(false)
</script>

<template>
    <VCard class="max-auto" >
        <VContainer flex>
            <VRow>
                <div class="title text-h3">This is User page</div>
            </VRow>
            <VRow align="center" flex v-if="detailsOk">
                <VCol>
                    <UserAverageScores :userId="pageIdQueryParam"/>
                </VCol>
                <VCol>
                    <UserClub :userId="pageIdQueryParam" :editable="true"/>
                </VCol>
            </VRow>
            <VSpacer />
            <VRow>
                <VCol>
                    <UserDetails v-model:isSuccess="detailsOk" :userId="pageIdQueryParam"/>
                </VCol>
            </VRow>
        </VContainer>
    </VCard>
</template>
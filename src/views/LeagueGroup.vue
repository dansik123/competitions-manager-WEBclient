<script setup lang="ts">
import GunTypeBtnSelect from "@/components/GunTypeBtnSelect.vue";
import LeagueGroupSelect from "@/components/LeagueGroupSelect.vue"
import LeagueGroupTable from "@/components/LeagueGroupTable.vue";
import { ref, watch } from "vue";

const leagueGroupSelecteGunType = ref<string>('')
const leagueGroupSelecteLeagueGroupName = ref<string>('')

watch(() => leagueGroupSelecteGunType.value, () => {
    leagueGroupSelecteLeagueGroupName.value = ''
})

</script>

<template>
	<VContainer fluid>
        <VRow>
            <h1>This is group Leagues list</h1>
        </VRow>
        <VRow>
            <VCol>
                <GunTypeBtnSelect 
                    @selectedGunType="(newGunType) => leagueGroupSelecteGunType = newGunType"/>
            </VCol>
        </VRow>
        <VRow v-if="leagueGroupSelecteGunType != ''">
            <VCol>
                <LeagueGroupSelect 
                    :gunType="leagueGroupSelecteGunType" 
                    @selectedLeagueGroup="(newLeagueGroupName) => 
                        leagueGroupSelecteLeagueGroupName = newLeagueGroupName" />
            </VCol>
        </VRow>
        <VRow v-if="leagueGroupSelecteLeagueGroupName != ''">
            <VCol>
                <LeagueGroupTable :leagueGroupName="leagueGroupSelecteLeagueGroupName"/>
            </VCol>
        </VRow>
	</VContainer>
</template>
<script setup lang="ts">
import AllLeaguesGroupSummary from "@/components/AllLeaguesGroupSummary.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

const router = useRoute()
const queryValue = router.query.groupLeaguesIds

const queryDataTranform = computed(()=>{
    if(queryValue == null || queryValue == undefined){
        return ''
    }
    else if(Array.isArray(queryValue)){
        return queryValue.join(',')
    }else{
        return new String(queryValue).valueOf()
    }
})
</script>

<template>
	<VContainer fluid>
        <VRow>
            <h1>This is group {{  }} matches summary table</h1>
        </VRow>
        <VRow v-if="queryDataTranform != ''">
            <VCol>
                <AllLeaguesGroupSummary :leaguesIdsStringArray="queryDataTranform" />
            </VCol>
        </VRow>
	</VContainer>
</template>
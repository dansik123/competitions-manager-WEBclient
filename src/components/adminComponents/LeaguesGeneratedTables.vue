<script setup lang="ts">
import { inject, onMounted, ref } from "vue";
import { useMutation } from "vue-query";
import { genericPostHttpRequest } from "@/apiHttp/RequestsApi";
import type { GenericErrorResponse, GeneratedLeagueGroup } from "@/types/HttpResponseTypes";
import type { AxiosError } from 'axios';
import { watch } from "vue";
import { onUpdated } from "vue";

const props = defineProps({
    usersGunTypeSelectedGroup:{
        type: Object as () => any,
        required: true
    },
    leagueCompetitorsSize:{
        type: Number,
        default: 1,
        required: true
    }
})

const emits = defineEmits(['saveGeneratedLeaguesData'])

const generatedLeaguesRef = ref<Array<GeneratedLeagueGroup>>([])
const leaguePrefix = ref('')

const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})

onMounted(() => {
    mutate(props.usersGunTypeSelectedGroup)
})
onUpdated(() => {
    mutate(props.usersGunTypeSelectedGroup)
})

const fetchUsersGeneratedLeaguesFn = async (requestBody: any) => 
    await genericPostHttpRequest<any, Array<GeneratedLeagueGroup>>(
        '/leagues/generate', requestBody, {leagueSize: props.leagueCompetitorsSize})
const { mutate } = 
    useMutation<Array<GeneratedLeagueGroup>, AxiosError<GenericErrorResponse, any>, any>(
    'genrateUsersLeaguesTables', 
    fetchUsersGeneratedLeaguesFn,
    {
        onSuccess: (data) =>{
            generatedLeaguesRef.value = data;
        },
        onError: (error)=>{
            popUpError(error.response?.data.message || 'Unknown login error', 5000)
        },
        retry: 0
    })
const btnClickSaveGeneratedLeagues = () =>{
    let toSaveObject: any = {}

    for(let league of generatedLeaguesRef.value){
        let competitorsIdList = league.leagueCompetitors.map((competitor) => competitor.userId)
        toSaveObject[leaguePrefix.value + league.leagueName] = competitorsIdList
    }
    emits('saveGeneratedLeaguesData', toSaveObject)
}


</script>
<template>
    <VContainer>
        <VRow>
            <h3>Generated leagues</h3>
            <VTextField v-model="leaguePrefix"></VTextField>
        </VRow>
        <VRow>
            <VCol cols="6" 
            v-for="generatedLeague in generatedLeaguesRef" 
            :key="generatedLeague.leagueName"
            >
                <VTable>
                    <thead>
                        <tr>
                            <th colspan="3">League name: {{ leaguePrefix + generatedLeague.leagueName }}</th>
                        </tr>
                        <tr>
                            <th class="text-left">Firstname</th>
                            <th class="text-left">Lastname</th>
                            <th class="text-left"> Average Score </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="competitor in generatedLeague.leagueCompetitors"
                            :key="competitor.userId"
                        >
                            <td>{{ competitor.firstname }}</td>
                            <td>{{ competitor.lastname }}</td>
                            <td>{{ competitor.avgScore }}</td>
                        </tr>
                    </tbody>
                </VTable>
            </VCol>
        </VRow>
        <VRow>
            <VCol class="d-flex justify-end">
                <VBtn end @click="btnClickSaveGeneratedLeagues">
                    Save
                </VBtn>
            </VCol>
        </VRow>
    </VContainer>
</template>
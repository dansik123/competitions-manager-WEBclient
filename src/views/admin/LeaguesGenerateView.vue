<script setup lang="ts">
import GunTypeBtnSelect from "@/components/GunTypeBtnSelect.vue";
import LeaguesUserSelector from "@/components/adminComponents/LeaguesUserSelector.vue";
import LeaguesGeneratedTables from "@/components/adminComponents/LeaguesGeneratedTables.vue";
import { inject, ref } from "vue";
import { genericPostHttpRequestNoParams } from "@/apiHttp/RequestsApi";
import type { GenericErrorResponse } from "@/types/HttpResponseTypes";
import type { AxiosResponse } from "axios";
import { useMutation } from "@tanstack/vue-query";
import type { SaveLeaguesRequest } from "@/types/HttpRequestTypes";

const selectedGunType = ref("")
const selectedGunTypeUsersGroup = ref<any|undefined>(undefined)
const leagueSizeNumberRef = ref<number>(1);
const singleLeagueRef = ref<boolean>(false);
const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})
const popUpSuccess: (msg: string, timeout: number) => void = inject("okayToastPopUp", ()=>{})

const roundsToPlayRef = ref(1) 

const updateSelected = (newGunType: string) => {
    if(selectedGunType.value != newGunType){
        selectedGunTypeUsersGroup.value = undefined;
    }
    selectedGunType.value = newGunType
}

const updateUsersToGenerate = (usersGenerateObject: any) =>{
    selectedGunTypeUsersGroup.value = usersGenerateObject
}

const selectedLeagueSize = () => {
    if(singleLeagueRef.value){
        if(selectedGunTypeUsersGroup.value==undefined){
            return 1
        }
        //selectedGunTypeUsersGroup is {'guntype': userIds -> Array<number>}
        return Number(selectedGunTypeUsersGroup.value[selectedGunType.value].length)
    }
    return leagueSizeNumberRef.value
}

const saveGeneratedLeaguesData = (leaguesSaveObject: any)=>{
    const leaguesSaveRequestObject: SaveLeaguesRequest = {
        leagueGunType: selectedGunType.value,
        leagueMaxCompetitors: selectedLeagueSize(),
        roundsToPlay: roundsToPlayRef.value,
        leaguesGroups: leaguesSaveObject
    }
    mutate(leaguesSaveRequestObject)
}


const saveGeneratedLeaguesFn = async (requestBody: SaveLeaguesRequest) => 
    await genericPostHttpRequestNoParams<SaveLeaguesRequest, any>('/leagues', requestBody)
const { mutate } = 
    useMutation<any, AxiosResponse<GenericErrorResponse>, SaveLeaguesRequest>(
    ['saveGeneratedLeagues'], 
    saveGeneratedLeaguesFn,
    {
        onSuccess: () =>{
            popUpSuccess('Leagues have been succesfully saved', 5000)
            selectedGunTypeUsersGroup.value = undefined;
        },
        onError: (error)=>{
            popUpError(error.data.message || 'Unknown leagues save error', 5000)
        },
        retry: 0
    })

</script>

<template>
    <VCard class="max-auto" >
        <VContainer flex>
            <VRow>
                <div class="title text-h2">This is League generate page</div>
            </VRow>
            <VRow align="center" flex>
                <VCol>
                    <GunTypeBtnSelect @selectedGunType="updateSelected" />
                </VCol>
                <VCol>
                    <VSwitch
                        v-model="singleLeagueRef"
                        :label="`One league: ${singleLeagueRef}`"
                    ></VSwitch>
                    <VSlider :disabled="singleLeagueRef"
                    v-model="leagueSizeNumberRef"
                    :max="25"
                    :step="1"
                    :min="1"
                    thumb-label="always"
                    label="league group size"
                    ></VSlider>
                </VCol>
            </VRow>
            <VSpacer />
            <LeaguesUserSelector 
                :selectedLeagueGunType="selectedGunType" 
                @updateSelectedUsers="updateUsersToGenerate"/>
            <VSpacer />
            <VSlider v-if="selectedGunTypeUsersGroup!==undefined"
                v-model="roundsToPlayRef"
                :max="10"
                :step="1"
                :min="1"
                thumb-label="always"
                label="number of rounds"
            ></VSlider>
            <LeaguesGeneratedTables v-if="selectedGunTypeUsersGroup!==undefined"
                :usersGunTypeSelectedGroup="selectedGunTypeUsersGroup" 
                :leagueCompetitorsSize="selectedLeagueSize()"
                @saveGeneratedLeaguesData="saveGeneratedLeaguesData"/>
        </VContainer>
    </VCard>
</template>
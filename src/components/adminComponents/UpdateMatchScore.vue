<script setup lang="ts">
import { genericPatchHttpRequestNoParams } from '@/apiHttp/RequestsApi';
import type { GenericErrorResponse, SingleMatchResponse } from '@/types/HttpResponseTypes';
import type { AxiosError } from 'axios';
import { inject, ref } from 'vue';
import { useMutation } from 'vue-query';
import { computed } from '@vue/reactivity';
import type { UpdateMatchScoreResult } from '@/types/HttpRequestTypes';
import { useAuthStore } from '@/stores/AuthorizationStore';

const props = defineProps({
    matchId:{
        type: Number,
        required: true
    },
    matchResult:{
        type: String,
        required: true
    }
})

const emit = defineEmits(['update:matchResult'])

const matchResultCompetitor1Input = computed(() =>{
    return props.matchResult == 'unmarked'? 0 : Number(props.matchResult.split('-')[0])
})

const matchResultCompetitor2Input = computed(() =>{
    return props.matchResult == 'unmarked'? 0 : Number(props.matchResult.split('-')[1])
})

const matchResultCompetitor1Ref = ref(matchResultCompetitor1Input.value)
const matchResultCompetitor2Ref = ref(matchResultCompetitor2Input.value)

const isEditModeRef = ref(false)
const authStore = useAuthStore()

const popUpSuccess: (msg: string, timeout: number) => void = inject("okayToastPopUp", ()=>{})
const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})

const patchMatchScoresHttpFn = async (scoresBody: UpdateMatchScoreResult) => 
    await genericPatchHttpRequestNoParams<UpdateMatchScoreResult, SingleMatchResponse>(`/matches/${props.matchId}/result`, scoresBody)
const { mutate } = useMutation<SingleMatchResponse, AxiosError<any, GenericErrorResponse>, any>(
    "updateMatchScoreResults",
    patchMatchScoresHttpFn,
    {
        onSuccess: (data) => {
            emit('update:matchResult', data.slotMatchResult)
            matchResultCompetitor1Ref.value = matchResultCompetitor1Input.value
            matchResultCompetitor2Ref.value = matchResultCompetitor2Input.value
            isEditModeRef.value = false
            popUpSuccess('Match score results have been updated', 5000)
        }, 
        onError: (error)=>{
            matchResultCompetitor1Ref.value = matchResultCompetitor1Input.value
            matchResultCompetitor2Ref.value = matchResultCompetitor2Input.value
			popUpError(error.response?.data.message || 'Unknown login error', 5000)
            
		},
        retry: 0
    }
)

const changeMatchScore = () =>{
    mutate( {
        competitor1Result: matchResultCompetitor1Ref.value,
        competitor2Result: matchResultCompetitor2Ref.value
    })
}
</script>
<template>
    <div v-if="authStore.isLoginUserAdmin || authStore.isLoginUserSpectator">
        <div class="d-flex flex-row" v-if="isEditModeRef">
            <VTextField type="number" v-model="matchResultCompetitor1Ref">
            </VTextField>
            <VTextField type="number" v-model="matchResultCompetitor2Ref">
            </VTextField>
            <VIcon icon="mdi-content-save-edit-outline" @click="changeMatchScore"></VIcon>
            <VIcon icon="mdi-close" @click="isEditModeRef = false"></VIcon>
        </div>
        <div class="d-flex flex-row" v-else>
            <span>{{ matchResult }}</span>
            <VBtn icon="mdi-pencil" @click="isEditModeRef = true"></VBtn>
        </div>
    </div>
    <div v-else>
        <span>{{ matchResult }}</span>
    </div>
</template>

<script setup lang="ts">
import { genericPatchHttpRequestNoParams } from '@/apiHttp/RequestsApi';
import type { GenericErrorResponse, UserMatchResponse } from '@/types/HttpResponseTypes';
import type { AxiosError } from 'axios';
import { inject, ref, type PropType } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import { dateRequestFormater } from '@/components/Formaters';
import { isDateGraterThenNow } from '@/components/Utils';
import { computed } from '@vue/reactivity';

const props = defineProps({
    matchId:{
        type: Number,
        required: true
    },
    matchDate: {
        type: String as PropType<null | string>,
    }
})

const emit = defineEmits(['update:matchDate'])

const dateTextField = computed(() =>{
    return props.matchDate == null? 'Unscheduled': props.matchDate
})
const pickerDate = ref(props.matchDate == null? '': props.matchDate)
const showDatePicker = ref(false)

const popUpSuccess: (msg: string, timeout: number) => void = inject("okayToastPopUp", ()=>{})
const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})

const patchMatchDateHttpFn = async (dateBody: any) => 
    await genericPatchHttpRequestNoParams<any, UserMatchResponse>(`/matches/${props.matchId}/date`, dateBody)
const { mutate } = useMutation<UserMatchResponse, AxiosError<any, GenericErrorResponse>, any>(
    ["updateMatchDate"],
    patchMatchDateHttpFn,
    {
        onSuccess: (data) => {
            emit('update:matchDate', data.matchDate)
            popUpSuccess('Match date has been updated', 2000)
            showDatePicker.value = false
        }, 
        onError: (error)=>{
			popUpError(error.response?.data.message || 'Unknown login error', 5000)
		},
        retry: 0
    }
)

const changeMatchDate = () =>{
    if(isDateGraterThenNow(new Date(pickerDate.value))){
        mutate( {newDate: dateRequestFormater(new Date(pickerDate.value))} )
        return;
    }
    pickerDate.value = ''
    showDatePicker.value = false
    popUpError('Past date not allowed', 3000)
}
</script>
<template>
    <VMenu
        v-model="showDatePicker"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
    >
        <template v-slot:activator="{ props }">
            <VTextField
                v-model="dateTextField"
                label="Picker in menu"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="props"
            ></VTextField>
        </template>
        <VDatePicker v-model="pickerDate">
            <template #footer>
                <div class="w-full px-4 pb-3 d-flex justify-space-between">
                    <VBtn @click="changeMatchDate">
                        Save
                    </VBtn>
                    <VBtn @click="showDatePicker=false">Cancel</VBtn>
                </div>
            </template>
        </VDatePicker>
    </VMenu>
</template>

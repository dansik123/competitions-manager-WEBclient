<script setup lang="ts">
import { inject, ref } from "vue";
import { useQuery } from "vue-query";
import { genericGetHttpRequest } from "@/apiHttp/RequestsApi";
import type { PageQueryParams, PagedResponse, PaginationData, AdminUserResponse, GenericErrorResponse } from "@/types/HttpResponseTypes";
import type { AxiosError } from 'axios';
import { paginationQueryRequestDefault, paginationResponseDefault } from "../PaginationDefaults";

const paginationData = ref<PaginationData>(paginationResponseDefault)

const paginationQueryData = ref<PageQueryParams>(paginationQueryRequestDefault)

const updateContent = (newPageNumber: number) => {
    //the request page value starts from 0 therefore I have to substart 1
    //from pagination numbers value which starts from 1.
    paginationQueryData.value.page = newPageNumber - 1;
    refetch.value({}) //refetch must have at least empty object to execute
}

const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})

const fetchUsersAdminListFn = async (paginationParams:PageQueryParams) => 
    await genericGetHttpRequest<PagedResponse<AdminUserResponse>>('/users', paginationParams)
const { data, isError, isLoading, error, refetch } = 
    useQuery<PagedResponse<AdminUserResponse>, AxiosError<GenericErrorResponse, any>>(
    'getUsersPagedList', 
    () => fetchUsersAdminListFn(paginationQueryData.value),
    {
        onSuccess: (data) =>{
            paginationData.value = data
            paginationData.value.paginationNumber = data.number + 1
        },
        onError: (error) => {
            popUpError(error.response?.data.message || 'Unknown error message', 5000)
        },
        retry: 0
    })
</script>
<template>
    <span v-if="isLoading">Loading...</span>
    <span v-else-if="isError">Error: {{ error?.message }}</span>
    <VTable v-else>
        <thead>
            <tr>
                <th class="text-left">Firstname</th>
                <th class="text-left">Lastname</th>
                <th class="text-left">Email</th>
                <th class="text-left">Is Enabled?</th>
                <th class="text-left">Role</th>
                <th class="text-left">Options</th>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="user in data?.content"
                :key="user.id"
            >
                <td>{{ user.firstname }}</td>
                <td>{{ user.lastname }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.enabled }}</td>
                <td>{{ user.role }}</td>
                <td>
                    <VContainer>
                        <VRow>
                            <RouterLink :to="{ path: '/user', query: { id: user.id }}">
                                <VIcon icon="mdi-pencil"></VIcon>
                            </RouterLink>
                            <a @click="">
                                <VIcon icon="mdi-delete"></VIcon>
                            </a>
                        </VRow>
                    </VContainer>
                </td>
            </tr>
        </tbody>
    </VTable>
    <VPagination 
        v-model="paginationData.paginationNumber"
        @update:modelValue="updateContent"
        :length="paginationData.totalPages"></VPagination>
</template>
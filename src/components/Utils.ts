import type { MemberUserResponse } from "@/types/HttpResponseTypes";

export const areUsersWithTheSameId = (user1: MemberUserResponse, user2: MemberUserResponse) =>{
    return user1.userId == user2.userId
}

export const isDateGraterThenNow = (d1: Date) => {
    const nowDate = new Date(Date.now())
    if(d1.getFullYear() > nowDate.getFullYear()) {
        return true
    }else if(d1.getFullYear() < nowDate.getFullYear()){
        return false
    }else if(d1.getMonth() > nowDate.getMonth()){
        return true
    }else if(d1.getMonth() < nowDate.getMonth()){
        return false
    }else if(d1.getDate() > nowDate.getDate()){
        return true
    }else if(d1.getDate() < nowDate.getDate()){
        return false
    }
    return false
}
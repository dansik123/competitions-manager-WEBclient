import type { MemberUserResponse } from "@/types/HttpResponseTypes";
import type { LocationQueryValue } from "vue-router";

export const dateFormater = (date: string | Date | null) =>{
    if(date == null){
        return "Unscheduled";
    }
    let dateDisplay: Date
    if(typeof date === 'string'){
        dateDisplay = new Date(date)
    }else{
        dateDisplay = date
    }
    const month = dateDisplay.getMonth() + 1 //months range 0..11
    const day = dateDisplay.getDate()
    return `${day<10? '0'+day: day}.${month<10? '0'+month: month}.${dateDisplay.getFullYear()}`
}

export const userTableCellFormater = (user: MemberUserResponse) =>{
    if(user == null){
        return "Not present"
    }
    return user.firstname +' '+ user.lastname
}

export const queryParamNumberFormater = 
(queryParam: string | LocationQueryValue | LocationQueryValue[]) =>{
    return Number(queryParam)
}

export const queryParamArrayNumberFormater = 
(queryParam: LocationQueryValue | LocationQueryValue[]) =>{
    // queryParam.
    // return Number(queryParam)
    return;
}

export const dateRequestFormater = (date: Date) =>{
    const month = date.getMonth() + 1 //months range 0..11
    const day = date.getDate()
    //proper request date is YYYY-MM-DD
    return `${date.getFullYear()}-${month<10? '0'+month: month}-${day<10? '0'+day: day}`
}

export const roundFormat = (currentRoundNo: number, totalRounds: number)=>{
    return `Round ${currentRoundNo} out of ${totalRounds}`
}
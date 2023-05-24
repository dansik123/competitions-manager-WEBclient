export interface ToastState {
    show: boolean;
    message: string;
    color: string;
    icon: string;
    timeout: number;
}

export interface LeaguesToGenerateData{
    gunType: string,
    requestToGenerateObject: any
}
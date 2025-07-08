export type TAuth = {
    access: string;
    refresh: string;
}

export type TUser = {
    id: string;
    userInfo: {
        firstName: string;
        lastName: string;
        middleName: string;
    }
}

export type TDelivery = {
    id: number;
    orderDate: string;
    transport: string;
    service: string;
    status: string;
    distance: number;
    packagingType: string
}
import {DeviceType} from "@/src/models/types/entities/DeviceType";
import {UserType} from "@/src/models/types/entities/UserType";

export type AccessLogType = {
    idAccessLog: number;
    user: UserType;
    idUser: number;
    device: DeviceType;
    idDevice: number;
    date: Date;
    accessLocation: string;
};
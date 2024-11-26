import { UserType } from "./UserType";
import { EnDeviceOs } from "@/src/models/types/enums/EnDevicesOs";

export type DeviceType = {
    idDevice: number;
    user: UserType;
    idUser: number;
    isDeleted: boolean;
    lastLocation: string;
    availableSpace: number;
    occupiedSpace: number;
    name: string;
    creationDate: Date;
    alterationDate: Date;
    enDeviceOs: EnDeviceOs;
    lastAccessDate: Date;
}
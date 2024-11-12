import { DeviceType } from "./DeviceType";
import { UserType } from "./UserType";
import { EnActions } from "@/src/models/types/enums/EnActions";

export type HistoryType = {
    idHistory: number;
    user: UserType;
    idUser: number;
    device: DeviceType;
    idDevice: number;
    enAction: EnActions;
    description: string;
    date: Date;
}
import { UserType} from "@/src/models/types/entities/UserType";
import { DeviceType} from "@/src/models/types/entities/DeviceType";
import { EnStatus } from "@/src/models/types/enums/EnStatus";

export type TransferenceType = {
    idTransference: number;
    user: UserType;
    idUser: number;
    deviceOrigin: DeviceType;
    idDeviceOrigin: number;
    deviceDestination: DeviceType;
    idDeviceDestination: number;
    filePath: string;
    fileNameExtension: string;
    size: number;
    destinationPath: string;
    enStatus: EnStatus;
    creationDate: Date;
    updateDate: Date;
}
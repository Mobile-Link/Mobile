import { EnStatus } from "@/src/models/types/enums/EnStatus";
import {TransferenceType} from "@/src/models/types/entities/TransferenceType";

export type TransferenceChunksType = {
    idTransferenceChunk?: number;
    transference?: TransferenceType;
    idTransference?: number;
    startByteIndex?: number;
    status?: EnStatus;
}
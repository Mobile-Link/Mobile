import {EnDeviceOs} from "@/src/models/types/enums/EnDevicesOs";

const getDeviceIcon = (os: EnDeviceOs) => {
    switch (os) {
        case EnDeviceOs.Linux:
            return "linux";
        case EnDeviceOs.Windows:
            return "microsoft-windows";
        case EnDeviceOs.Android:
            return "android";
        case EnDeviceOs.IOS:
            return "apple";
        case EnDeviceOs.MacOS:
            return "apple-finder";
        default:
            return "help-circle-outline";
    }
};

export default getDeviceIcon;
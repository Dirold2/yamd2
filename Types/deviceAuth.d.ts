export type DeviceCode = {
    deviceCode: string;
    userCode: string;
    verificationUrl: string;
    expiresIn: number;
    interval: number;
};
export type OAuthToken = {
    accessToken: string;
    uid: number;
    tokenType: string;
    expiresIn: number;
};

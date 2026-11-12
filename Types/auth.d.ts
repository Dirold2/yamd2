export type ApiConfig = {
    oauth: {
        CLIENT_ID: string;
        CLIENT_SECRET: string;
    };
    fake_device: {
        DEVICE_ID: string;
        UUID: string;
        PACKAGE_NAME: string;
    };
};
export type ApiInitConfig = {
    access_token?: string;
    uid?: number;
    username?: string;
    password?: string;
};
export type InitResponse = {
    access_token: string;
    uid: number;
};
export type ApiUser = {
    username: string;
    password: string;
    token: string;
    uid: number;
};

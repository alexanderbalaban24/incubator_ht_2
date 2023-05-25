export type DeviceAuthSessionsTypeDB = {
    userId: string,
    ip: string,
    deviceName: string,
    issuedAt: Date,
    expirationAt: Date
}
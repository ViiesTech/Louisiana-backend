import os from "os";

export const getLocalIp = (): string => {
    const interfaces = os.networkInterfaces();

    for (const iface of Object.values(interfaces)) {
        if (!iface) continue;

        for (const alias of iface) {
            if (alias.family === "IPv4" && !alias.internal) {
                if (alias.address.startsWith("192.168.") || alias.address.startsWith("10.")) {
                    return alias.address;
                }
            }
        }
    }

    for (const iface of Object.values(interfaces)) {
        if (!iface) continue;
        for (const alias of iface) {
            if (alias.family === "IPv4" && !alias.internal) {
                return alias.address;
            }
        }
    }

    return "127.0.0.1";
}
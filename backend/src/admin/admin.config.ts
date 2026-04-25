import { PrismaClient } from '@prisma/client';

export const buildAdminRouter = async (prisma: PrismaClient) => {
    // 1. Load dynamic modules
    const adminModule = await (new Function('return import("adminjs")')());
    const prismaModule = await (new Function('return import("@adminjs/prisma")')());
    const expressModule = await (new Function('return import("@adminjs/express")')());

    const AdminJS = adminModule.AdminJS || adminModule.default;
    const AdminJSExpress = expressModule.default || expressModule;

    // 2. Register Adapter
    AdminJS.registerAdapter(prismaModule);

    // 3. Setup Options
    const adminOptions = {
        databases: [prisma],
        branding: {
            companyName: 'Bright Futures Coaching AI',
            softwareBrothers: false,
        },
        rootPath: '/admin',
    };

    const admin = new AdminJS(adminOptions);
    return AdminJSExpress.buildRouter(admin);
};

import { prisma } from '../prisma';

export const buildAdminRouter = async () => {
    // Load components
    const adminModule = await (new Function('return import("adminjs")')());
    const prismaModule = await (new Function('return import("@adminjs/prisma")')());
    const expressModule = await (new Function('return import("@adminjs/express")')());

    const AdminJS = adminModule.AdminJS || adminModule.default;
    const AdminJSExpress = expressModule.default || expressModule;

    // Register the Prisma Adapter
    AdminJS.registerAdapter(prismaModule);

    const adminOptions = {
        // Just provide the whole database - AdminJS will auto-discover all tables!
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

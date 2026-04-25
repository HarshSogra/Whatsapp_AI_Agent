import { prisma } from '../prisma';

export const buildAdminRouter = async () => {
    console.log("Loading AdminJS modules...");
    const adminModule = await (new Function('return import("adminjs")')());
    const prismaModule = await (new Function('return import("@adminjs/prisma")')());
    const expressModule = await (new Function('return import("@adminjs/express")')());

    // Resolve the actual classes
    const AdminJS = adminModule.AdminJS || adminModule.default;
    const { Database, Resource } = prismaModule;
    const AdminJSExpress = expressModule.default || expressModule;

    console.log(`AdminJS Class: ${AdminJS ? 'FOUND' : 'MISSING'}`);
    console.log(`Prisma Adapter Database: ${Database ? 'FOUND' : 'MISSING'}`);
    console.log(`Prisma Adapter Resource: ${Resource ? 'FOUND' : 'MISSING'}`);

    // Register the adapter
    if (AdminJS && Database && Resource) {
        AdminJS.registerAdapter({ Database, Resource });
        console.log("AdminJS Adapter Registered ✅");
    }

    const adminOptions = {
        resources: [
            {
                resource: { model: (prisma as any).institute, client: prisma },
                options: { parent: { name: 'Institute Management', icon: 'Business' } },
            },
            {
                resource: { model: (prisma as any).course, client: prisma },
                options: { parent: { name: 'Institute Management', icon: 'Education' } },
            },
            {
                resource: { model: (prisma as any).student, client: prisma },
                options: { parent: { name: 'User Data', icon: 'User' } },
            },
            {
                resource: { model: (prisma as any).message, client: prisma },
                options: { parent: { name: 'User Data', icon: 'Message' } },
            },
            {
                resource: { model: (prisma as any).demoBooking, client: prisma },
                options: { parent: { name: 'User Data', icon: 'Calendar' } },
            },
        ],
        branding: {
            companyName: 'Bright Futures Coaching AI',
            softwareBrothers: false,
        },
        rootPath: '/admin',
    };

    if (!AdminJS) throw new Error("AdminJS class could not be loaded.");

    const admin = new AdminJS(adminOptions);
    const buildRouter = AdminJSExpress.buildRouter;

    return buildRouter(admin);
};

import { prisma } from '../prisma';

export const buildAdminRouter = async () => {
    // 1. Load all AdminJS components using dynamic imports to ensure they share the same ESM environment
    const { default: AdminJS } = await (new Function('return import("adminjs")')());
    const { Database, Resource } = await (new Function('return import("@adminjs/prisma")')());
    const AdminJSExpress = await (new Function('return import("@adminjs/express")')());

    // 2. Register the adapter
    AdminJS.registerAdapter({ Database, Resource });

    // 3. Define options inside the builder
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

    const admin = new AdminJS(adminOptions);
    const buildRouter = AdminJSExpress.default ? AdminJSExpress.default.buildRouter : AdminJSExpress.buildRouter;

    return buildRouter(admin);
};

import { prisma } from '../prisma';

export const buildAdminRouter = async () => {
    // Force a clean ESM import for all AdminJS components
    const adminPkg = await (new Function('return import("adminjs")')());
    const prismaPkg = await (new Function('return import("@adminjs/prisma")')());
    const expressPkg = await (new Function('return import("@adminjs/express")')());

    // Resolve the actual classes from the packages (handling ESM 'default' vs named)
    const AdminJS = adminPkg.default || adminPkg;
    const { Database, Resource } = prismaPkg;
    const AdminJSExpress = expressPkg.default || expressPkg;

    // Register the adapter explicitly on this specific AdminJS instance
    AdminJS.registerAdapter({ Database, Resource });

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
    const buildRouter = AdminJSExpress.buildRouter;

    return buildRouter(admin);
};

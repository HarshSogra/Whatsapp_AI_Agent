import { prisma } from '../prisma';

export const buildAdminRouter = async () => {
    const adminModule = await (new Function('return import("adminjs")')());
    const prismaModule = await (new Function('return import("@adminjs/prisma")')());
    const expressModule = await (new Function('return import("@adminjs/express")')());

    const AdminJS = adminModule.AdminJS || adminModule.default;
    const { Database, Resource } = prismaModule;
    const AdminJSExpress = expressModule.default || expressModule;

    // Register the adapter
    AdminJS.registerAdapter(prismaModule);

    // Test if the adapter actually recognizes our models
    const testModel = { model: (prisma as any).institute, client: prisma };
    const isRecognized = Resource.isResource(testModel);
    console.log(`>>> Adapter Self-Test (Is Institute Recognized?): ${isRecognized}`);

    const adminOptions = {
        resources: [
            {
                resource: testModel,
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
    return AdminJSExpress.buildRouter(admin);
};

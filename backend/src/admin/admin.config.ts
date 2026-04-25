import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Database, Resource } from '@adminjs/prisma';
import { prisma } from '../index';

AdminJS.registerAdapter({ Database, Resource });

const adminOptions = {
  resources: [
    {
      resource: { model: (prisma as any).institute, client: prisma },
      options: {
        parent: { name: 'Institute Management', icon: 'Business' },
      },
    },
    {
      resource: { model: (prisma as any).course, client: prisma },
      options: {
        parent: { name: 'Institute Management', icon: 'Education' },
      },
    },
    {
      resource: { model: (prisma as any).student, client: prisma },
      options: {
        parent: { name: 'User Data', icon: 'User' },
      },
    },
    {
      resource: { model: (prisma as any).message, client: prisma },
      options: {
        parent: { name: 'User Data', icon: 'Message' },
      },
    },
    {
      resource: { model: (prisma as any).demoBooking, client: prisma },
      options: {
        parent: { name: 'User Data', icon: 'Calendar' },
      },
    },
  ],
  branding: {
    companyName: 'Bright Futures Coaching AI',
    softwareBrothers: false,
  },
  rootPath: '/admin',
};

export const buildAdminRouter = async () => {
  const admin = new AdminJS(adminOptions);
  return AdminJSExpress.buildRouter(admin);
};

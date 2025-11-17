import { UserRole } from '@seller-erp/types';

declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      user?: {
        id: string;
        email: string;
        role: UserRole;
        tenantId: string;
      };
    }
  }
}

export {};


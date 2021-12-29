
export const APP_NAME = 'Asstan Web App';
export const APP_URL = process.env.NEXT_PUBLIC_FRONTEND_HOST as string;
export const API_URL = process.env.NEXT_PUBLIC_BACKEND_HOST as string;
export const APP_DESCRIPTION = 'Handling to manage and track shops that has tobacco license, listing on map';

export const isServer = typeof window !== 'undefined';

/**
 * Global prefix for all api calls, no trailing slash
 */
 export const API_PREFIX = '/api';
import { ResponseCookies } from '../../../web/spec-extension/cookies';
export declare function handleTemporaryRedirectResponse(url: string, mutableCookies: ResponseCookies): Response;
export declare function handleBadRequestResponse(): Response;
export declare function handleNotFoundResponse(): Response;
export declare function handleMethodNotAllowedResponse(): Response;
export declare function handleInternalServerErrorResponse(): Response;

import type * as ServerHooks from '../../../../../client/components/hooks-server-context';
import type * as HeaderHooks from '../../../../../client/components/headers';
import type { staticGenerationBailout as StaticGenerationBailout } from '../../../../../client/components/static-generation-bailout';
import type { AppRouteUserlandModule } from '../module';
import type { NextRequest } from '../../../../web/spec-extension/request';
export declare function proxyRequest(request: NextRequest, { dynamic }: Pick<AppRouteUserlandModule, 'dynamic'>, hooks: {
    readonly serverHooks: typeof ServerHooks;
    readonly headerHooks: typeof HeaderHooks;
    readonly staticGenerationBailout: typeof StaticGenerationBailout;
}): NextRequest;

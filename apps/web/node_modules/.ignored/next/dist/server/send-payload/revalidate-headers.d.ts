/// <reference types="node" />
import type { ServerResponse } from 'http';
import type { BaseNextResponse } from '../base-http';
import type { PayloadOptions } from './index';
export declare function setRevalidateHeaders(res: ServerResponse | BaseNextResponse, options: PayloadOptions): void;

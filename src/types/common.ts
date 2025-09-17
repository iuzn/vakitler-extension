import type { PropsWithChildren } from 'react';

export type WithChildren<T = {}> = T & PropsWithChildren<{}>;
 export type WithClassName<T = {}> = T & {
 className?: string;
};
export type QueryParams = {
 [key: string]: string | number | null;
};
export interface SequentialLoading {
 ok: boolean;
 id: number | string | null;
}

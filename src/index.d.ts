import "react";

declare module 'react' {
    export interface HTMLAttributes<T> {
        visible?: number | string;
    }
};
declare type Callback = ((value: any, old: any) => void) | string;
declare type HasChanged = ((val: any, old: any) => boolean) | undefined;
declare type ObservablePropertyObject = {
    cb: Callback;
    configurable?: boolean | undefined;
    enumerable?: boolean | undefined;
    hasChanged?: HasChanged;
};
declare type ObservableProperty = string | ((value: any, old: any) => void) | ObservablePropertyObject;
export declare function observeProperties(obj: object, properties: Record<string, ObservableProperty>): void;
export {};

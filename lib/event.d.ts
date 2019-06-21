export declare type EventListener = (...args: any[]) => void;
declare class Event {
    static emit(eventName: string, ...args: any[]): void;
    static names(): string[];
    static listenerCount(eventName: string): number;
    static listeners(eventName: string): Array<EventListener>;
    static addListener(eventName: string, listener: EventListener): void;
    static prependListener(eventName: string, listener: EventListener): void;
    static once(eventName: string, listener: EventListener): void;
    static prependOnceListener(eventName: string, listener: EventListener): void;
    static removeListener(eventName: string, listener: EventListener): void;
    static removeAllListeners(eventName?: string): void;
    static on(eventName: string, listener: EventListener): void;
    static off(eventName: string, listener: EventListener): void;
    _linsters: {
        [key: string]: [EventListener, boolean?][];
    };
    constructor();
    emit(eventName: string, ...args: any[]): void;
    names(): string[];
    listenerCount(eventName: string): number;
    listeners(eventName: string): Array<EventListener>;
    addListener(eventName: string, listener: EventListener): void;
    prependListener(eventName: string, listener: EventListener): void;
    once(eventName: string, listener: EventListener): void;
    prependOnceListener(eventName: string, listener: EventListener): void;
    removeListener(eventName: string, listener: EventListener): void;
    removeAllListeners(eventName?: string): void;
    on(eventName: string, listener: EventListener): void;
    off(eventName: string, listener: EventListener): void;
}
export default Event;

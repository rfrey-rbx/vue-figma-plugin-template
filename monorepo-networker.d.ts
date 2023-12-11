declare module "monorepo-networker" {
    export type Consumer<T> = (value: T) => void;
    export type AutoComplete<T, L extends string | number | symbol> = L | Omit<T, L>;

    export type ListenerDetachPredicate<T> = (message: TransportMessage<T>) => boolean;
    export declare class Side<E = any> {
        private name;
        private definitions;
        private static currentSide;
        static get current(): Side<any>;
        static set current(side: Side<any>);
        private static sides;
        static register(side: Side): Side<any>;
        static byName(name: string): Side<any> | undefined;
        constructor(name: string, definitions: {
            shouldHandle?: (event: E) => boolean;
            messageGetter?: (event: E) => TransportMessage<any>;
            attachListener: (callback: Consumer<E>) => void;
            detachListener: (callback: Consumer<E>) => void;
        });
        getName(): string;
        beginListening(forMessages: MessageTypeRegistry | null, until?: ListenerDetachPredicate<E>): void;
    }

    export type TransportDelegate<M extends TransportMessage<any>> = Consumer<M>;
    export declare namespace Transports {
        function getDelegate(from: Side, to: Side): TransportDelegate<any> | undefined;
        function register(from: Side, to: Side, delegate: TransportDelegate<any>): void;
    }

    export interface TransportMessage<P> {
        requestId: string;
        type: AutoComplete<string, "response">;
        from: string;
        payload: P;
    }
    export declare abstract class MessageType<P, R = void> {
        private name;
        constructor(name: string);
        getName(): string;
        abstract receivingSide(): Side;
        abstract handle(payload: P, from: Side): R;
        private createTransportMessage;
        private sendTransportMessage;
        send(payload: P): TransportMessage<P>;
        request(payload: P): Promise<R>;
    }
    export declare class MessageTypeRegistry {
        private registry;
        byName(name: string): MessageType<any, any> | undefined;
        register<P, R>(message: MessageType<P, R>): MessageType<P, R>;
    }

    interface Options {
        messagesRegistry: MessageTypeRegistry;
        initTransports: (register: typeof Transports.register) => void;
    }
    export declare function createInitializer(opts: Options): <E>(currentSide: Side<E>) => void;
    export { };
}
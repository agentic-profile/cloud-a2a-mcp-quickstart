export interface StoreItem {
    id: string;
    updated: string;
    owner?: string
    [key: string]: any;
}

export interface ItemStore<T extends StoreItem> {
    readItem(id: string): Promise<T | undefined>;
    updateItem(item: T): Promise<void>;
    deleteItem(id: string): Promise<void>;
    queryItems(): Promise<T[]>;
    recentItems(since: string): Promise<T[]>;
    name(): string
}
export interface StoreItem {
    id: string;
    updated: string;
    [key: string]: any;
}

export interface ItemStore<T extends StoreItem> {
    readItem(id: string): Promise<T | undefined>;
    updateItem(item: T): Promise<void>;
    deleteItem(id: string): Promise<void>;
    queryItems(query:any): Promise<T[]>;
    recentItems( kind: string, since: string): Promise<T[]>;
    name(): string
}
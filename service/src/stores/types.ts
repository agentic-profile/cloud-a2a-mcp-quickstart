export interface DatedItem {
    id: string;
    updated: string;
    [key: string]: any;
}

export interface ItemStore<T extends DatedItem> {
    readItem(id: string): Promise<T | undefined>;
    updateItem(item: T): Promise<void>;
    deleteItem(id: string): Promise<void>;
    queryItems(): Promise<T[]>;
    recentItems(since: string): Promise<T[]>;
}
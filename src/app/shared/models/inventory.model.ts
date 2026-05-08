export interface InventoryItem {
    id: string;
    itemName: string;
    category: string; // e.g., Raw Material, Dairy, Packing
    quantity: number;
    unit: string; // kg, ltr, packets
    pricePerUnit: number;
    totalValue: number;
    lastUpdated: Date;
}
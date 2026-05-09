export interface VendorItem {
    id: string;
    name: string;
    category: string; // e.g., Dairy, Vegetables, Packaging
    contactPerson: string;
    phone: string;
    address: string;
    status: 'Active' | 'Inactive';
}
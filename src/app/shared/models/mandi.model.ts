export interface MandiRates {
    state: string;
    district: string;
    market: string;
    commodity: string;
    variety: string;
    arrival_date: string | Date;
    min_price: number;
    max_price: number;
    modal_price: number;
}

export interface MandiApiResponse {
    records: MandiRates[];
}
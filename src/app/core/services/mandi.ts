import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { MandiApiResponse, MandiRates } from '../../shared/models/mandi.model';
@Injectable({
  providedIn: 'root',
})
export class Mandi {
  // Ye sample API URL hai (Actual GOI API key ke saath use hoti hai)
  private readonly apiUrl = '/api-mandi/resource/9ef84268-d588-465a-a308-a864a43d0070';
  private readonly apiKey = '579b464db66ec23bdd000001ec8dcbaab22d47d65c774f21ae734e46';

  constructor(private readonly http: HttpClient) { }
  getMandiData() {
    return this.http.get(this.apiUrl, {
    });
  }

  // Filter ke saath data fetch karne ke liye naya method
  getFilteredRates(state: string, district: string): Observable<any> {
    let url = `${this.apiUrl}?api-key=${this.apiKey}&format=json&limit=1000`;

    // Sirf tabhi filter jodein jab value majood ho
    if (state) {
      url += `&filters[state]=${encodeURIComponent(state)}`;
    }

    // AGAR district khali hai toh filter bilkul mat jodein
    if (district && district !== '') {
      url += `&filters[district]=${encodeURIComponent(district)}`;
    }
    return this.http.get<MandiApiResponse>(url).pipe(
      map((response: MandiApiResponse) => {
        if (!response?.records) return [];

        // Aapka wahi transformation logic jo pehle tha
        return response.records.map((record: any) => ({
          state: record.state,
          district: record.district,
          market: record.market,
          commodity: record.commodity,
          variety: record.variety,
          min_price: +record.min_price || 0,
          max_price: +record.max_price || 0,
          modal_price: +record.modal_price || 0,
          arrival_date: record.arrival_date
        }));
      })
    );
  }

  // Pure Bharat ka live data fetch karne ke liye
  getLiveRates(): Observable<MandiRates[]> {
    // Local variable define kiya
    const fullUrl = `${this.apiUrl}?api-key=${this.apiKey}&format=json&limit=1000`;

    // 'this.fullUrl' ki jagah sirf 'fullUrl' use karein
    return this.http.get<MandiApiResponse>(fullUrl).pipe(
      map((response: MandiApiResponse) => {
        // Safety check: Agar response khali ho toh empty array return karein
        if (!response?.records) return [];

        return response.records.map((record: any) => {
          const transformedRecord: MandiRates = {
            state: record.state,
            district: record.district,
            market: record.market,
            commodity: record.commodity,
            variety: record.variety,
            min_price: +record.min_price || 0,
            max_price: +record.max_price || 0,
            modal_price: +record.modal_price || 0,
            arrival_date: record.arrival_date
          };
          return transformedRecord;
        });
      })
    );
  }

}
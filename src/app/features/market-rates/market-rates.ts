import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { INDIA_DATA } from '../../shared/constants/india-data';
import { FormsModule } from '@angular/forms';
import { Mandi } from '../../core/services/mandi'; // Path check kar lein
import { MandiRates } from '../../shared/models/mandi.model';

@Component({
  selector: 'app-market-rates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './market-rates.html',
  styleUrl: './market-rates.css',
})
export class MarketRates implements OnInit {
  // Filters ke liye variables
  selectedState: string = 'Bihar';
  selectedDistrict: string = 'Buxar';

  // Constant se states ki list nikalna
  statesList: string[] = Object.keys(INDIA_DATA);
  districtsList: string[] = [];

  mandiData: MandiRates[] = [];
  isLoading: boolean = false;

  // Pagination Variables
  currentPage: number = 1;
  itemsPerPage: number = 6;
  constructor(private mandiService: Mandi) { }

  ngOnInit() {
    this.updateDistricts(); // Initial districts set karein
    this.onSearch(); // Default search (Buxar ke liye)
  }

  // Jab State change hoga tab ye function chalega
  updateDistricts() {
    // INDIA_DATA se selected state ke districts nikalna
    this.districtsList = (INDIA_DATA as any)[this.selectedState] || [];

    // Default selection logic
    if (this.districtsList.includes('Buxar')) {
      this.selectedDistrict = 'Buxar';
    } else {
      this.selectedDistrict = this.districtsList[0] || '';
    }
  }

  onSearch() {
    this.isLoading = true;
    this.currentPage = 1; // Search karne par hamesha page 1 par aayein
    this.mandiService.getFilteredRates(this.selectedState, this.selectedDistrict).subscribe({
      next: (data) => {
        // Pehle purana data clear karein (ye optional hai par safe hai)
        this.mandiData = [];
        console.log("UI Update ho raha hai data ke saath:", data);
        this.mandiData = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.isLoading = false;
      }
    });
  }
  // UI par dikhane ke liye Sliced Data (Cards ke liye)
  get paginatedCards(): MandiRates[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.mandiData.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.mandiData.length / this.itemsPerPage) || 1;
  }
}
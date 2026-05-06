import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { INDIA_DATA } from '../../shared/constants/india-data';
import { MandiRates } from '../../shared/models/mandi.model';
import { Mandi } from '../../core/services/mandi';

@Component({
  selector: 'app-dashboard',
  standalone: true, // Modern Angular ke liye
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  // Data Storage
  allMandiData: MandiRates[] = []; // Central data store
  isLoading: boolean = false;

  // Dropdown Lists
  stateList: string[] = [];
  districtList: string[] = [];
  commodityList: string[] = [];
  lastRefreshedAt: Date | null = null;

  // Selections & Pagination
  selectedState: string = '';
  selectedDistrict: string = '';
  selectedCommodity: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private mandiService: Mandi) { }

  ngOnInit() {
    this.stateList = Object.keys(INDIA_DATA);
    this.loadInitialData();
  }

  loadInitialData() {
    this.isLoading = true;
    this.mandiService.getLiveRates().subscribe({
      next: (data) => {
        this.allMandiData = data; // Sab data yahan save karein
        this.updateCommodityList(data); // Commodity dropdown populate karein

        // Current date aur time save karein
        this.lastRefreshedAt = new Date();

        this.isLoading = false;
        console.log('Data Loaded Successfully', data.length, 'records');
      },
      error: (err) => {
        console.error('Error fetching data', err);
        this.isLoading = false;
      }
    });
  }

  // Pure data se unique commodities nikalne ke liye
  updateCommodityList(data: MandiRates[]) {
    this.commodityList = [...new Set(data.map(item => item.commodity))].sort();
  }

  onStateChange() {
    this.selectedDistrict = '';
    this.selectedCommodity = ''; // Reset filters
    this.currentPage = 1;

    if (this.selectedState) {
      this.districtList = INDIA_DATA[this.selectedState] || [];
    } else {
      this.districtList = [];
    }
  }

  onFilterChange() {
    this.currentPage = 1; // Filter badalne par hamesha page 1 par jayein
    console.log(`Filters applied: ${this.selectedState}, ${this.selectedDistrict}, ${this.selectedCommodity}`);
  }

  // Sirf filtered data ke liye (Getter)
  get filteredRates(): MandiRates[] {
    return this.allMandiData.filter(item => {
      // API data aur selection ke beech case-insensitive matching
      const stateMatch = !this.selectedState ||
        item.state.toLowerCase() === this.selectedState.toLowerCase();

      const districtMatch = !this.selectedDistrict ||
        item.district.toLowerCase() === this.selectedDistrict.toLowerCase();

      const commodityMatch = !this.selectedCommodity ||
        item.commodity === this.selectedCommodity;

      return stateMatch && districtMatch && commodityMatch;
    });
  }

  // UI par dikhane ke liye (Sliced data)
  get paginatedData(): MandiRates[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredRates.slice(start, end);
  }

  get totalPages(): number {
    const count = this.filteredRates.length;
    return Math.ceil(count / this.itemsPerPage) || 1;
  }

  // Button click par manually trigger karne ke liye agar zaroorat ho
  onGetRates() {
    this.currentPage = 1;
    if (!this.selectedState || !this.selectedDistrict) {
      alert("Please select both State and District");
    }
  }
}
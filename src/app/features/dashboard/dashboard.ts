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

  fetchDataByLocation(state: string, district: string) {
    this.isLoading = true;
    this.mandiService.getFilteredRates(state, district).subscribe({
      next: (data) => {
        this.allMandiData = data;
        this.updateCommodityList(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Fetch Error:", err);
        this.isLoading = false;
      }
    });
  }

  onStateChange() {
    this.selectedDistrict = '';
    this.selectedCommodity = '';
    this.currentPage = 1;

    if (this.selectedState) {
      // Case 1: Jab State selected ho
      this.districtList = INDIA_DATA[this.selectedState] || [];
      this.fetchDataByLocation(this.selectedState, '');
    } else {
      // Case 2: Jab State select nahi hai (User ne clear kar diya)
      this.districtList = [];
      this.loadInitialData(); // Wapas India-wide data mangwa lein
    }
  }

  onFilterChange() {
    this.currentPage = 1;
    if (this.selectedState) {
      // District select ho ya na ho, state ka data toh aayega hi
      this.fetchDataByLocation(this.selectedState, this.selectedDistrict);
    }
  }

  // Sirf filtered data ke liye (Getter)
  get filteredRates(): MandiRates[] {
    return this.allMandiData.filter(item => {
      // 1. Commodity filter ka logic
      // Agar 'All Commodities' selected hai ya kuch bhi select nahi hai, toh sab dikhao
      const commodityMatch = !this.selectedCommodity ||
        this.selectedCommodity === 'All' ||
        this.selectedCommodity === 'All Commodities' ||
        item.commodity === this.selectedCommodity;

      return commodityMatch;
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
  // Dashboard.ts mein changes

  onGetRates() {
    if (!this.selectedState || !this.selectedDistrict) {
      alert("Please select both State and District");
      return;
    }

    this.isLoading = true;
    this.currentPage = 1;

    // Purane logic (filtering from 1000 records) ke bajaye direct API call karein
    this.mandiService.getFilteredRates(this.selectedState, this.selectedDistrict).subscribe({
      next: (data) => {
        this.allMandiData = data; // Ab isme sirf us district ke saare records honge
        this.updateCommodityList(data);
        this.lastRefreshedAt = new Date();
        this.isLoading = false;
        console.log(`Fetched ${data.length} records for ${this.selectedDistrict}`);
      },
      error: (err) => {
        console.error('Error fetching filtered data', err);
        this.isLoading = false;
      }
    });
  }
}
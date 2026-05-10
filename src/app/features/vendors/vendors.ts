import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VendorItem } from '../../shared/models/vendor.model';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './vendors.html',
  styleUrl: './vendors.css'
})
export class Vendors implements OnInit {
  VendorList: VendorItem[] = [];
  vendorForm: FormGroup;
  searchTerm: string = '';
  // Pagination Variables
  currentPage: number = 1;
  itemsPerPage: number = 6;

  constructor(private fb: FormBuilder) {
    this.vendorForm = this.fb.group({
      name: ['', [Validators.required]],
      category: ['Dairy'],
      contactPerson: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', [Validators.required]],
      status: ['Active']
    });
  }

  ngOnInit() {
    const savedVendors = localStorage.getItem('myVendors');
    if (savedVendors) {
      this.VendorList = JSON.parse(savedVendors);
    }
  }

  addVendor() {
    if (this.vendorForm.valid) {
      const formValues = this.vendorForm.value;

      const newVendor = {
        id: Math.random().toString(36).substr(2, 9),
        name: formValues.name,
        contactPerson: formValues.contactPerson,
        // Phone number format fix
        phone: '+91-' + formValues.phone,
        address: formValues.address,
        category: formValues.category,
        status: formValues.status || 'Active'
      };

      // Ensure variable name matches (vendorList vs VendorList)
      this.VendorList.push(newVendor);

      // Data save kar rahe hain
      localStorage.setItem('myVendors', JSON.stringify(this.VendorList));

      // Form reset logic
      this.vendorForm.reset({
        category: 'Dairy',
        status: 'Active',
        address: ''
      });

      console.log('Vendor Added Successfully!', newVendor);
    }
  }

  deleteVendor(id: string) {
    this.VendorList = this.VendorList.filter(v => v.id !== id);
    localStorage.setItem('myVendors', JSON.stringify(this.VendorList));
  }
  // UI par dikhane ke liye Sliced Data
  get paginatedVendors(): VendorItem[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.VendorList.slice(start, end);
  }

  // Total pages calculate karna
  get totalPages(): number {
    return Math.ceil(this.VendorList.length / this.itemsPerPage) || 1;
  }

  // Smart Filter Getter
  get filteredVendors() {
    if (!this.searchTerm.trim()) {
      return this.VendorList;
    }

    const search = this.searchTerm.toLowerCase();

    return this.VendorList.filter(vendor =>
      vendor.name.toLowerCase().includes(search) ||
      vendor.contactPerson.toLowerCase().includes(search) ||
      vendor.phone.includes(search) ||
      (vendor.address && vendor.address.toLowerCase().includes(search))
    );
  }

  // Duplicate Check Function (Optional but useful)
  isDuplicate(name: string, phone: string): boolean {
    return this.VendorList.some(v =>
      v.name.toLowerCase() === name.toLowerCase() ||
      v.phone.includes(phone)
    );
  }
}
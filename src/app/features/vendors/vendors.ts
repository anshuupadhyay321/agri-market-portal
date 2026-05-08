import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vendors.html'
})
export class Vendors implements OnInit {
  vendorList: any[] = [];
  vendorForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.vendorForm = this.fb.group({
      name: ['', [Validators.required]],
      category: ['Dairy'],
      contactPerson: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: [''],
      status: ['Active']
    });
  }

  ngOnInit() {
    const savedVendors = localStorage.getItem('myVendors');
    if (savedVendors) {
      this.vendorList = JSON.parse(savedVendors);
    }
  }

  addVendor() {
    if (this.vendorForm.valid) {
      const newVendor = {
        id: Math.random().toString(36).substr(2, 9),
        ...this.vendorForm.value
      };
      this.vendorList.push(newVendor);
      localStorage.setItem('myVendors', JSON.stringify(this.vendorList));
      this.vendorForm.reset({ category: 'Dairy', status: 'Active' });
    }
  }

  deleteVendor(id: string) {
    this.vendorList = this.vendorList.filter(v => v.id !== id);
    localStorage.setItem('myVendors', JSON.stringify(this.vendorList));
  }
}
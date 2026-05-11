import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryItem } from '../../shared/models/inventory.model';

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory implements OnInit {
  inventoryList: InventoryItem[] = [];

  // Pagination Variables
  currentPage: number = 1;
  itemsPerPage: number = 6;

  inventoryForm: FormGroup;
  constructor(private readonly fb: FormBuilder) {
    this.inventoryForm = this.fb.group({
      itemName: ['', [Validators.required]],
      category: ['Raw Material'],
      quantity: [0, [Validators.required, Validators.min(1)]],
      unit: ['kg'],
      pricePerUnit: [0, [Validators.required]]
    });
  }
  ngOnInit() {
    // Initial dummy data ya local storage se load karein
    const savedStock = localStorage.getItem('myInventory');
    if (savedStock) {
      this.inventoryList = JSON.parse(savedStock);
    }
  }
  addItem() {
    if (this.inventoryForm.valid) {
      // Form se values nikal rahe hain
      const formValues = this.inventoryForm.value;

      const newItem: InventoryItem = {
        id: Math.random().toString(36).slice(2, 9),
        itemName: formValues.itemName,
        category: formValues.category || 'Raw Material',
        quantity: Number(formValues.quantity), // Pakka karein ki ye number ho
        unit: formValues.unit,
        pricePerUnit: Number(formValues.pricePerUnit), // Pakka karein ki ye number ho
        totalValue: Number(formValues.quantity) * Number(formValues.pricePerUnit),
        lastUpdated: new Date()
      };

      this.inventoryList.push(newItem);

      // Local storage mein save karein
      this.saveToLocalStorage();

      // Form reset karein
      this.inventoryForm.reset({
        category: 'Raw Material',
        unit: 'kg',
        quantity: 0,
        pricePerUnit: 0
      });

      console.log('Item Added:', newItem); // Debugging ke liye
    } else {
      alert("Kripya saari details sahi se bharein!");
    }
  }

  // addItem method ke andar list push karne ke baad ye line jodein
  saveToLocalStorage() {
    localStorage.setItem('myInventory', JSON.stringify(this.inventoryList));
  }

  deleteItem(id: string) {
    this.inventoryList = this.inventoryList.filter(item => item.id !== id);
    this.saveToLocalStorage()
  }
  get totalInventoryValue(): number {
    return this.inventoryList.reduce((acc, item) => acc + item.totalValue, 0);
  }

  get lowStockCount(): number {
    return this.inventoryList.filter(item => item.quantity < 5).length;
  }
  // UI par dikhane ke liye Sliced Data
  get paginatedInventory(): InventoryItem[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.inventoryList.slice(start, end);
  }

  // Total pages calculate karna
  get totalPages(): number {
    return Math.ceil(this.inventoryList.length / this.itemsPerPage) || 1;
  }
}

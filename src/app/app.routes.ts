import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { MarketRates } from './features/market-rates/market-rates';
import { Inventory } from './features/inventory/inventory';
import { Vendors } from './features/vendors/vendors';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: Dashboard
    },
    {
        path: 'market-rates',
        component: MarketRates
    },
    {
        path: 'inventory',
        component: Inventory
    },
    {
        path: 'vendors',
        component: Vendors
    }
];

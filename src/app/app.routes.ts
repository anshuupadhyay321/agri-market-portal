import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { MarketRates } from './features/market-rates/market-rates';
import { Inventory } from './features/inventory/inventory';
import { Vendors } from './features/vendors/vendors';
import { Settings } from './features/settings/settings';
import { authGuard } from './core/gaurds/auth.gaurd';
import { LoginGaurd } from './core/gaurds/login.gaurd';

// Naye components import karein
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login', // Pehle login par bhejein
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login,
        canActivate: [LoginGaurd]
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard]
    },
    {
        path: 'market-rates',
        component: MarketRates,
        canActivate: [authGuard]
    },
    {
        path: 'inventory',
        component: Inventory,
        canActivate: [authGuard]
    },
    {
        path: 'vendors',
        component: Vendors,
        canActivate: [authGuard]
    },
    {
        path: 'settings',
        component: Settings,
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: 'login' // Invalid URL par login par wapas
    }
];
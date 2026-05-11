import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SettingsService {
    private readonly platformId = inject(PLATFORM_ID);
    // Signals for state management
    darkMode = signal<boolean>(false);
    compactMode = signal<boolean>(false);
    language = signal<string>('en');


    constructor() {
        // Initial Load: Browser se purani settings uthana
        if (isPlatformBrowser(this.platformId)) {
            this.darkMode.set(localStorage.getItem('theme') === 'dark');
            this.compactMode.set(localStorage.getItem('compact') === 'true');
            this.language.set(localStorage.getItem('lang') || 'en');
        }

        // 2. The Effect: Jab bhi koi signal change hoga, ye auto-run karega
        effect(() => {
            // Sirf browser mein execute karein
            if (isPlatformBrowser(this.platformId)) {
                const isDark = this.darkMode();
                const isCompact = this.compactMode();
                const lang = this.language();

                // Dark Mode Logic
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                if (isDark) {
                    document.body.classList.add('dark-theme');
                } else {
                    document.body.classList.remove('dark-theme');
                }

                // Compact Mode Logic
                localStorage.setItem('compact', String(isCompact));

                // Language Logic
                localStorage.setItem('lang', lang);
                document.documentElement.lang = lang; // Accessibility ke liye
            }
        });
    }
}
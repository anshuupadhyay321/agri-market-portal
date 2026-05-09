import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-footer',
  imports: [DatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements OnInit, OnDestroy {
  lastUpdate: Date = new Date();
  private timerSubscription?: Subscription;

  ngOnInit() {
    // Har 2 minute mein update karne ke liye interval (120000ms = 2 min)
    this.timerSubscription = interval(120000).subscribe(() => {
      this.lastUpdate = new Date();
      console.log('Status Updated at:', this.lastUpdate);
    });
  }

  ngOnDestroy() {
    // Memory leak se bachne ke liye subscription band karein
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}

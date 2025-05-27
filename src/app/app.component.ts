import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';  // <-- Import CommonModule

@Component({
  selector: 'app-root',
  imports: [FormsModule,CommonModule,HttpClientModule ],  // <-- add HttpClientModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  numbersInput = '';
  sumResult: number | null = null;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  calculateSum() {
    this.errorMessage = '';
    this.sumResult = null;

    let numbers: number[] = [];

    try {
      numbers = this.numbersInput
        .split(',')
        .map((n) => n.trim())
        .filter((n) => n !== '')
        .map((n) => {
          const num = Number(n);
          if (isNaN(num)) throw new Error(`Invalid number: ${n}`);
          return num;
        });
    } catch (error: any) {
      this.errorMessage = error.message;
      return;
    }

    this.http
      .post<{ sum: number }>('https://localhost:32769/api/Sum/even', numbers)
      .subscribe({
        next: (response) => {
          this.sumResult = response.sum;
        },
        error: (err) => {
          this.errorMessage =
            'API Error: ' + (err.message || err.statusText || 'Unknown error');
        },
      });
  }
}

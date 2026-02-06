import { Component, signal } from '@angular/core';
import { Balance } from "./components/balance/balance";

@Component({
  selector: 'app-home',
  imports: [
    Balance
],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

  transactions = signal([
    { value: 1500, type: 'income' },
    { value: 1000, type: 'outcome' },
    { value: 500, type: 'income' },
    { value: 500, type: 'outcome' },
  ])

}

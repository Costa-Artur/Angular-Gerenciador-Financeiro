import { Component, signal } from '@angular/core';
import { Balance } from "./components/balance/balance";
import { TransactionItem } from "./components/transaction-item/transaction-item";
import { Transaction } from '../../shared/transaction/interfaces/transaction';
import { TransactionType } from '../../shared/transaction/enums/transaction-type';

@Component({
  selector: 'app-home',
  imports: [
    Balance,
    TransactionItem
],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

  transactions = signal<Transaction[]>([
    { title: 'Salário', value: 1500, type: TransactionType.INCOME },
    { title: 'Aluguel', value: 1000, type: TransactionType.OUTCOME },
    { title: 'Freelance', value: 500, type: TransactionType.INCOME },
    { title: 'Supermercado', value: 500, type: TransactionType.OUTCOME },
  ])

}

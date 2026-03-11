import { Component, inject, OnInit, signal } from '@angular/core';
import { Balance } from "./components/balance/balance";
import { TransactionItem } from "./components/transaction-item/transaction-item";
import { Transaction } from '../../shared/transaction/interfaces/transaction';
import { NoTransactions } from "./components/no-transactions/no-transactions";
import { TransactionsService } from '../../shared/transaction/services/transactions';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    Balance,
    TransactionItem,
    NoTransactions,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {

  private transactionsService = inject(TransactionsService);
  private router = inject(Router);

  transactions = signal<Transaction[]>([]);

  ngOnInit(): void {
    this.getTransactions();
  }

  edit(transaction: Transaction) {
    this.router.navigate(['edit', transaction.id])
  }

  remove(transaction: Transaction) {
    this.transactionsService.delete(transaction.id!).subscribe({
      next: () => {
        this.transactions.update((transactions) => transactions.filter(t => t.id !== transaction.id));
      },
      error: err => console.error('Error deleting transaction', err)
    });


  }

  private getTransactions() {
    this.transactionsService.getAll().subscribe({
      next: transactions => this.transactions.set(transactions),
      error: err => console.error('Error fetching transactions', err)
    });
  }
}

import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TransactionType } from '../../../../shared/transaction/enums/transaction-type';
import { NgxMaskDirective } from 'ngx-mask';
import { TransactionsService } from '../../../../shared/transaction/services/transactions';
import { TransactionPayload } from '../../../../shared/transaction/interfaces/transaction';
import { Router } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FeedbackService } from '../../../../shared/feedback/services/feedback.service';

@Component({
  selector: 'app-create',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    NgxMaskDirective,
    MatSnackBarModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent {

  private transactionsService = inject(TransactionsService);
  private router = inject(Router);
  private feedbackService = inject(FeedbackService);

  readonly transactionType = TransactionType;

  form = new FormGroup({
    type: new FormControl(this.transactionType.INCOME, {
      validators: [Validators.required]
    }),
    title: new FormControl('', {
      validators: [Validators.required]
    }),
    value: new FormControl(0, {
      validators: [Validators.required]
    }),
  })

  submit() {
    if(this.form.invalid) {
      return;
    }

    const payload: TransactionPayload = {
      title: this.form.value.title as string,
      value: this.form.value.value as number,
      type: this.form.value.type as TransactionType,
    }

    this.transactionsService.post(payload).subscribe({
      next: (transaction) => {
        this.feedbackService.success('Transação criada com sucesso!');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error(error);
      }
    });

  }

}

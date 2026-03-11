import { Component, computed, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TransactionType } from '../../../../shared/transaction/enums/transaction-type';
import { NgxMaskDirective } from 'ngx-mask';
import { TransactionsService } from '../../../../shared/transaction/services/transactions';
import { Transaction, TransactionPayload } from '../../../../shared/transaction/interfaces/transaction';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FeedbackService } from '../../../../shared/feedback/services/feedback.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-create-or-edit',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    NgxMaskDirective,
    MatSnackBarModule
  ],
  templateUrl: './create-or-edit.component.html',
  styleUrl: './create-or-edit.component.scss',
})
export class CreateOrEditComponent {
  private transactionsService = inject(TransactionsService);
  private router = inject(Router);
  private feedbackService = inject(FeedbackService);

  transaction = input<Transaction>();

  readonly transactionType = TransactionType;

  isEdit = computed(() => Boolean(this.transaction()));

  form = computed(() =>
    new FormGroup({
      type: new FormControl(this.transaction()?.type ?? this.transactionType.INCOME, {
        validators: [Validators.required]
      }),
      title: new FormControl(this.transaction()?.title ?? '', {
        validators: [Validators.required]
      }),
      value: new FormControl(this.transaction()?.value ?? 0, {
        validators: [Validators.required]
      }),
    })
  );

  submit() {
    if(this.form().invalid) {
      return;
    }

    const payload: TransactionPayload = {
      title: this.form().value.title as string,
      value: this.form().value.value as number,
      type: this.form().value.type as TransactionType,
    }

    if(this.isEdit()) {
      this.transactionsService.put(this.transaction()!.id, payload).subscribe({
        next: (transaction) => {
          this.feedbackService.success('Transação atualizada com sucesso!');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error(error);
        }
      });
    } else  {
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

  private createOrEdit(payload: TransactionPayload) {
    if(this.isEdit()) {
      return this.transactionsService.put(this.transaction()!.id, payload)
        .pipe(
          tap(() =>  this.feedbackService.success('Transação atualizada com sucesso!'))
        )
      } else  {
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

}

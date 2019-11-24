import { Component, OnInit, Input } from '@angular/core';

declare var Stripe: any

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  @Input() amount: number
  @Input() name: string
  @Input() sku: string

  stripe = Stripe('pk_test_ii2ZCGQSWSCKrLStBlhJfOWN')

  constructor() { }

  ngOnInit() {
    
  }

  async startCheckout() {
    const { error } = await this.stripe.redirectToCheckout({
      items: [{
        // Replace with the ID of your plan
        plan: this.sku,
        quantity: 1,
      }],
      successUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel',
    })

    if (error) {
      alert(error.message)
    }
  }

}

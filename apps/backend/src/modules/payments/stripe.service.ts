import Stripe from 'stripe';
import { env } from '@/config/environment';
import { AppError } from '@/common/errors/app-error';
import httpStatus from 'http-status';

if (!env.stripe?.secretKey) {
  console.warn('Stripe secret key not configured. Payment features will not work.');
}

export const stripe = env.stripe?.secretKey
  ? new Stripe(env.stripe.secretKey, {
      apiVersion: '2025-11-17.clover',
    })
  : null;

export interface CreateSubscriptionPaymentIntentInput {
  userId: string;
  planId: string;
  planName: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  currency?: string;
}

export interface CreateTemplatePaymentIntentInput {
  userId: string;
  templateId: string;
  templateName: string;
  amount: number;
  currency?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

class StripeService {
  private ensureStripe(): Stripe {
    if (!stripe) {
      throw new AppError('Stripe is not configured', httpStatus.SERVICE_UNAVAILABLE);
    }
    return stripe;
  }

  /**
   * Create a payment intent for subscription
   */
  async createSubscriptionPaymentIntent(
    input: CreateSubscriptionPaymentIntentInput
  ): Promise<PaymentIntentResponse> {
    try {
      const stripeInstance = this.ensureStripe();
      const amountInCents = Math.round(input.amount * 100);
      
      const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: amountInCents,
        currency: input.currency || 'usd',
        metadata: {
          userId: input.userId,
          planId: input.planId,
          planName: input.planName,
          billingCycle: input.billingCycle,
          type: 'subscription',
        },
        description: `Subscription: ${input.planName} (${input.billingCycle})`,
      });

      return {
        clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error: any) {
      throw new AppError(
        `Failed to create payment intent: ${error.message}`,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Create a payment intent for template purchase
   */
  async createTemplatePaymentIntent(
    input: CreateTemplatePaymentIntentInput
  ): Promise<PaymentIntentResponse> {
    try {
      const stripeInstance = this.ensureStripe();
      const amountInCents = Math.round(input.amount * 100);
      
      const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: amountInCents,
        currency: input.currency || 'usd',
        metadata: {
          userId: input.userId,
          templateId: input.templateId,
          templateName: input.templateName,
          type: 'template',
        },
        description: `Template Purchase: ${input.templateName}`,
      });

      return {
        clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error: any) {
      throw new AppError(
        `Failed to create payment intent: ${error.message}`,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string | Buffer, signature: string): Stripe.Event {
    try {
      const stripeInstance = this.ensureStripe();
      const webhookSecret = env.stripe?.webhookSecret;
      if (!webhookSecret) {
        throw new AppError('Stripe webhook secret not configured', httpStatus.INTERNAL_SERVER_ERROR);
      }

      return stripeInstance.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error: any) {
      throw new AppError(
        `Webhook signature verification failed: ${error.message}`,
        httpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Retrieve payment intent
   */
  async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const stripeInstance = this.ensureStripe();
      return await stripeInstance.paymentIntents.retrieve(paymentIntentId);
    } catch (error: any) {
      throw new AppError(
        `Failed to retrieve payment intent: ${error.message}`,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Create a Stripe customer
   */
  async createCustomer(email: string, name?: string, metadata?: Record<string, string>): Promise<Stripe.Customer> {
    try {
      const stripeInstance = this.ensureStripe();
      return await stripeInstance.customers.create({
        email,
        name,
        metadata,
      });
    } catch (error: any) {
      throw new AppError(
        `Failed to create customer: ${error.message}`,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Create a subscription with Stripe
   */
  async createStripeSubscription(
    customerId: string,
    priceId: string,
    metadata?: Record<string, string>
  ): Promise<Stripe.Subscription> {
    try {
      const stripeInstance = this.ensureStripe();
      return await stripeInstance.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        metadata,
      });
    } catch (error: any) {
      throw new AppError(
        `Failed to create subscription: ${error.message}`,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Cancel a Stripe subscription
   */
  async cancelStripeSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      const stripeInstance = this.ensureStripe();
      return await stripeInstance.subscriptions.cancel(subscriptionId);
    } catch (error: any) {
      throw new AppError(
        `Failed to cancel subscription: ${error.message}`,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const stripeService = new StripeService();


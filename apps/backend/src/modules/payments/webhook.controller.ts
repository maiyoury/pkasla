import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import { stripeService } from './stripe.service';
import { bakongService } from './bakong.service';
import { userSubscriptionService } from '@/modules/subscriptions/user-subscription.service';
import { templatePurchaseService } from '@/modules/t/template-purchase.service';
import { buildSuccessResponse } from '@/helpers/http-response';

/**
 * Handle Stripe webhook events
 */
export const stripeWebhookHandler = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;

  if (!signature) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: 'Missing stripe-signature header' });
  }

  let event;
  try {
    event = stripeService.verifyWebhookSignature(req.body, signature);
  } catch (error: any) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
  }

  // Handle different event types
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as any);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as any);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as any);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as any);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(httpStatus.OK).json(buildSuccessResponse({ received: true }));
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 
      error: 'Webhook processing failed',
      message: error.message 
    });
  }
};

/**
 * Handle successful payment intent
 */
async function handlePaymentIntentSucceeded(paymentIntent: any) {
  const metadata = paymentIntent.metadata;
  const userId = metadata.userId;
  const transactionId = paymentIntent.id;

  if (metadata.type === 'subscription') {
    // Create subscription
    await userSubscriptionService.create({
      userId,
      planId: metadata.planId,
      paymentMethod: 'stripe',
      transactionId,
      autoRenew: true,
    });
  } else if (metadata.type === 'template') {
    // Create template purchase
    await templatePurchaseService.create({
      userId,
      templateId: metadata.templateId,
      paymentMethod: 'stripe',
      transactionId,
    });
  }
}

/**
 * Handle failed payment intent
 */
async function handlePaymentIntentFailed(paymentIntent: any) {
  const metadata = paymentIntent.metadata;
  console.error(`Payment failed for ${metadata.type}:`, {
    userId: metadata.userId,
    transactionId: paymentIntent.id,
    error: paymentIntent.last_payment_error,
  });
  // You might want to notify the user or log this for retry
}

/**
 * Handle subscription updated
 */
async function handleSubscriptionUpdated(subscription: any) {
  // Update subscription status if needed
  // This is useful for tracking Stripe subscription lifecycle
  console.log('Subscription updated:', subscription.id);
}

/**
 * Handle subscription deleted
 */
async function handleSubscriptionDeleted(subscription: any) {
  // Cancel subscription in our database
  // Find subscription by Stripe subscription ID in metadata
  console.log('Subscription deleted:', subscription.id);
  // You might want to update the subscription status to 'cancelled'
}

/**
 * Handle Bakong webhook events
 */
export const bakongWebhookHandler = async (req: Request, res: Response) => {
  const signature = req.headers['x-bakong-signature'] as string;

  if (!signature) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: 'Missing x-bakong-signature header' });
  }

  try {
    const isValid = bakongService.verifyWebhookSignature(req.body, signature);
    if (!isValid) {
      return res.status(httpStatus.BAD_REQUEST).json({ error: 'Invalid webhook signature' });
    }
  } catch (error: any) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
  }

  // Handle different event types
  try {
    const event = req.body;
    const eventType = event.type || event.eventType;

    switch (eventType) {
      case 'payment.completed':
      case 'transaction.completed':
        await handleBakongPaymentCompleted(event.data || event);
        break;

      case 'payment.failed':
      case 'transaction.failed':
        await handleBakongPaymentFailed(event.data || event);
        break;

      case 'payment.expired':
      case 'transaction.expired':
        await handleBakongPaymentExpired(event.data || event);
        break;

      default:
        console.log(`Unhandled Bakong event type: ${eventType}`);
    }

    return res.status(httpStatus.OK).json(buildSuccessResponse({ received: true }));
  } catch (error: any) {
    console.error('Bakong webhook handler error:', error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 
      error: 'Webhook processing failed',
      message: error.message 
    });
  }
};

/**
 * Handle successful Bakong payment
 */
async function handleBakongPaymentCompleted(paymentData: any) {
  const metadata = paymentData.metadata || {};
  const userId = metadata.userId;
  const transactionId = paymentData.transactionId || paymentData.id;

  if (metadata.type === 'subscription') {
    // Create subscription
    await userSubscriptionService.create({
      userId,
      planId: metadata.planId,
      paymentMethod: 'bakong',
      transactionId,
      autoRenew: true,
    });
  } else if (metadata.type === 'template') {
    // Create template purchase
    await templatePurchaseService.create({
      userId,
      templateId: metadata.templateId,
      paymentMethod: 'bakong',
      transactionId,
    });
  }
}

/**
 * Handle failed Bakong payment
 */
async function handleBakongPaymentFailed(paymentData: any) {
  const metadata = paymentData.metadata || {};
  console.error(`Bakong payment failed for ${metadata.type}:`, {
    userId: metadata.userId,
    transactionId: paymentData.transactionId || paymentData.id,
    error: paymentData.error || paymentData.message,
  });
  // You might want to notify the user or log this for retry
}

/**
 * Handle expired Bakong payment
 */
async function handleBakongPaymentExpired(paymentData: any) {
  const metadata = paymentData.metadata || {};
  console.log(`Bakong payment expired for ${metadata.type}:`, {
    userId: metadata.userId,
    transactionId: paymentData.transactionId || paymentData.id,
  });
  // You might want to notify the user that the payment expired
}


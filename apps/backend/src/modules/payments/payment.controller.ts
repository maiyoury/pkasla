import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import { stripeService } from './stripe.service';
import { bakongService } from './bakong.service';
import { buildSuccessResponse } from '@/helpers/http-response';
import { subscriptionPlanService } from '@/modules/subscriptions/subscription-plan.service';
import { templateService } from '@/modules/t/template.service';

/**
 * Create payment intent for subscription
 */
export const createSubscriptionPaymentIntentHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Authentication required' });
  }

  const { planId } = req.body;

  // Get plan details
  const plan = await subscriptionPlanService.findByIdOrFail(planId);

  const paymentIntent = await stripeService.createSubscriptionPaymentIntent({
    userId: req.user.id,
    planId: plan.id,
    planName: plan.displayName,
    amount: plan.price,
    billingCycle: plan.billingCycle,
  });

  return res.status(httpStatus.OK).json(buildSuccessResponse(paymentIntent));
};

/**
 * Create payment intent for template purchase
 */
export const createTemplatePaymentIntentHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Authentication required' });
  }

  const { templateId } = req.body;

  // Get template details
  const template = await templateService.findByIdOrFail(templateId);

  if (!template.price || template.price === 0) {
    return res.status(httpStatus.BAD_REQUEST).json({ 
      error: 'This template is free and does not require payment' 
    });
  }

  const paymentIntent = await stripeService.createTemplatePaymentIntent({
    userId: req.user.id,
    templateId: template.id,
    templateName: template.title,
    amount: template.price,
  });

  return res.status(httpStatus.OK).json(buildSuccessResponse(paymentIntent));
};

/**
 * Create Bakong KHQR payment for subscription
 */
export const createBakongSubscriptionPaymentHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Authentication required' });
  }

  const { planId } = req.body;

  // Get plan details
  const plan = await subscriptionPlanService.findByIdOrFail(planId);

  const payment = await bakongService.createSubscriptionPayment({
    userId: req.user.id,
    amount: plan.price,
    currency: 'KHR',
    metadata: {
      planId: plan.id,
      planName: plan.displayName,
      billingCycle: plan.billingCycle,
      type: 'subscription',
    },
  });

  return res.status(httpStatus.OK).json(buildSuccessResponse(payment));
};

/**
 * Create Bakong KHQR payment for template purchase
 */
export const createBakongTemplatePaymentHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Authentication required' });
  }

  const { templateId } = req.body;

  // Get template details
  const template = await templateService.findByIdOrFail(templateId);

  if (!template.price || template.price === 0) {
    return res.status(httpStatus.BAD_REQUEST).json({ 
      error: 'This template is free and does not require payment' 
    });
  }

  const payment = await bakongService.createTemplatePayment({
    userId: req.user.id,
    amount: template.price,
    currency: 'KHR',
    metadata: {
      templateId: template.id,
      templateName: template.title,
      type: 'template',
    },
  });

  return res.status(httpStatus.OK).json(buildSuccessResponse(payment));
};

/**
 * Check Bakong transaction status
 */
export const getBakongTransactionStatusHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Authentication required' });
  }

  const { transactionId } = req.params;

  const status = await bakongService.getTransactionStatus(transactionId);

  return res.status(httpStatus.OK).json(buildSuccessResponse(status));
};


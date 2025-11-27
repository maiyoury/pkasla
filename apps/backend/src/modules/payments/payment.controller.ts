import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import { stripeService } from './stripe.service';
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


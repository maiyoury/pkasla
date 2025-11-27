import { subscriptionCronService } from './subscription-cron.service';
import { logger } from '@/utils/logger';

/**
 * Cron job to expire subscriptions
 * Run this daily (e.g., at midnight)
 */
export async function expireSubscriptionsJob() {
  try {
    logger.info('Running subscription expiration job...');
    await subscriptionCronService.expireSubscriptions();
    logger.info('Subscription expiration job completed successfully');
  } catch (error: any) {
    logger.error('Subscription expiration job failed:', error);
  }
}

/**
 * Cron job to check upcoming expirations
 * Run this daily (e.g., in the morning)
 */
export async function checkUpcomingExpirationsJob() {
  try {
    logger.info('Running upcoming expirations check job...');
    const upcoming = await subscriptionCronService.checkUpcomingExpirations();
    logger.info(`Found ${upcoming.length} subscriptions expiring soon`);
    // Here you could send reminder emails or notifications
    return upcoming;
  } catch (error: any) {
    logger.error('Upcoming expirations check job failed:', error);
    throw error;
  }
}


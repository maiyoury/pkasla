import { templatePurchaseRepository } from '@/modules/t/template-purchase.repository';
import { userSubscriptionRepository } from '@/modules/subscriptions/user-subscription.repository';
import { subscriptionPlanRepository } from '@/modules/subscriptions/subscription-plan.repository';

export interface RevenueStats {
  totalTemplateRevenue: number;
  totalSubscriptionRevenue: number;
  totalRevenue: number;
  templatePurchases: {
    count: number;
    revenue: number;
  };
  activeSubscriptions: {
    count: number;
    monthlyRecurring: number;
    yearlyRecurring: number;
  };
  revenueByPeriod: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    thisYear: number;
  };
}

class RevenueService {
  /**
   * Get total revenue from template purchases
   */
  async getTemplateRevenue(): Promise<number> {
    const result = await templatePurchaseRepository.getTotalRevenue();
    return result.length > 0 && result[0].total ? result[0].total : 0;
  }

  /**
   * Get total revenue from subscriptions
   */
  async getSubscriptionRevenue(): Promise<number> {
    const activeSubscriptions = await userSubscriptionRepository.list({
      status: 'active',
    });

    let totalRevenue = 0;
    for (const sub of activeSubscriptions) {
      const plan = sub.planId as any;
      if (plan && plan.price) {
        totalRevenue += plan.price;
      }
    }

    return totalRevenue;
  }

  /**
   * Get comprehensive revenue statistics
   */
  async getRevenueStats(): Promise<RevenueStats> {
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Template revenue
    const totalTemplateRevenue = await this.getTemplateRevenue();
    const templatePurchases = await templatePurchaseRepository.countDocuments({});
    
    // Template revenue by period
    const templateRevenueTodayResult = await templatePurchaseRepository.getTotalRevenue({
      purchaseDate: { $gte: startOfToday },
    });
    const templateRevenueToday = templateRevenueTodayResult[0]?.total || 0;

    const templateRevenueThisWeekResult = await templatePurchaseRepository.getTotalRevenue({
      purchaseDate: { $gte: startOfWeek },
    });
    const templateRevenueThisWeek = templateRevenueThisWeekResult[0]?.total || 0;

    const templateRevenueThisMonthResult = await templatePurchaseRepository.getTotalRevenue({
      purchaseDate: { $gte: startOfMonth },
    });
    const templateRevenueThisMonth = templateRevenueThisMonthResult[0]?.total || 0;

    const templateRevenueThisYearResult = await templatePurchaseRepository.getTotalRevenue({
      purchaseDate: { $gte: startOfYear },
    });
    const templateRevenueThisYear = templateRevenueThisYearResult[0]?.total || 0;

    // Subscription stats
    const activeSubscriptions = await userSubscriptionRepository.list({
      status: 'active',
    });

    let monthlyRecurring = 0;
    let yearlyRecurring = 0;
    let subscriptionRevenue = 0;

    for (const sub of activeSubscriptions) {
      const plan = sub.planId as any;
      if (plan && plan.price) {
        subscriptionRevenue += plan.price;
        if (plan.billingCycle === 'monthly') {
          monthlyRecurring += plan.price;
        } else {
          yearlyRecurring += plan.price;
        }
      }
    }

    return {
      totalTemplateRevenue,
      totalSubscriptionRevenue: subscriptionRevenue,
      totalRevenue: totalTemplateRevenue + subscriptionRevenue,
      templatePurchases: {
        count: templatePurchases,
        revenue: totalTemplateRevenue,
      },
      activeSubscriptions: {
        count: activeSubscriptions.length,
        monthlyRecurring,
        yearlyRecurring,
      },
      revenueByPeriod: {
        today: templateRevenueToday + subscriptionRevenue,
        thisWeek: templateRevenueThisWeek + subscriptionRevenue,
        thisMonth: templateRevenueThisMonth + subscriptionRevenue,
        thisYear: templateRevenueThisYear + subscriptionRevenue,
      },
    };
  }

  /**
   * Get revenue by date range
   */
  async getRevenueByDateRange(startDate: Date, endDate: Date) {
    const templateRevenue = await templatePurchaseRepository.getTotalRevenue({
      purchaseDate: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    return {
      templateRevenue: templateRevenue[0]?.total || 0,
      // Subscription revenue would need to be calculated based on subscription periods
      // This is a simplified version
    };
  }
}

export const revenueService = new RevenueService();


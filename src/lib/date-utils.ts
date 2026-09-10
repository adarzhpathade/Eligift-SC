import { isToday, isTomorrow, differenceInDays, format } from 'date-fns';

export type DeadlineStatus = {
  status: string;
  isClosed: boolean;
  urgency: 'high' | 'medium' | 'low' | 'none';
  colorClass: string;
  icon: string;
};

export function getDeadlineStatus(dateStr: string | null | undefined): DeadlineStatus {
  if (!dateStr) {
    return {
      status: 'Ongoing',
      isClosed: false,
      urgency: 'none',
      colorClass: 'text-green-600',
      icon: 'event_available',
    };
  }

  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) {
    return {
      status: 'Ongoing',
      isClosed: false,
      urgency: 'none',
      colorClass: 'text-green-600',
      icon: 'event_available',
    };
  }

  const today = new Date();
  // Set the deadline to the very end of the given day
  const compareDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 23, 59, 59);

  if (compareDate < today) {
    return {
      status: `Closed on ${format(dateObj, 'MMM d, yyyy')}`,
      isClosed: true,
      urgency: 'high',
      colorClass: 'text-[#ba1a1a]', // red
      icon: 'event_busy',
    };
  }

  // Set today for exact day comparisons
  const justDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());

  if (isToday(justDate)) {
    return {
      status: 'Closes Today',
      isClosed: false,
      urgency: 'high',
      colorClass: 'text-[#F59E0B]', // orange
      icon: 'warning',
    };
  }

  if (isTomorrow(justDate)) {
    return {
      status: 'Closes Tomorrow',
      isClosed: false,
      urgency: 'high',
      colorClass: 'text-[#F59E0B]',
      icon: 'warning',
    };
  }

  const daysLeft = differenceInDays(compareDate, today);
  if (daysLeft <= 7) {
    return {
      status: `Closes in ${daysLeft} days`,
      isClosed: false,
      urgency: 'medium',
      colorClass: 'text-[#F59E0B]',
      icon: 'schedule',
    };
  }

  return {
    status: `Closes on ${format(dateObj, 'MMM d, yyyy')}`,
    isClosed: false,
    urgency: 'low',
    colorClass: 'text-muted-foreground',
    icon: 'calendar_today',
  };
}

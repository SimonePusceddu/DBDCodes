import { useState, useEffect } from 'react';
import { CountdownTime } from '@/types';

// Shrine resets every Tuesday at 15:00 UTC
const RESET_DAY = 2; // Tuesday (0 = Sunday)
const RESET_HOUR = 15; // 15:00 UTC

function getNextResetTime(): Date {
  const now = new Date();
  const nextReset = new Date(now);

  // Set to next Tuesday at 15:00 UTC
  nextReset.setUTCHours(RESET_HOUR, 0, 0, 0);

  // Calculate days until next Tuesday
  const currentDay = now.getUTCDay();
  let daysUntilReset = RESET_DAY - currentDay;

  if (daysUntilReset < 0) {
    // Already past Tuesday this week
    daysUntilReset += 7;
  } else if (daysUntilReset === 0) {
    // It's Tuesday - check if we're past reset time
    if (now.getUTCHours() >= RESET_HOUR) {
      daysUntilReset = 7; // Next week
    }
  }

  nextReset.setUTCDate(nextReset.getUTCDate() + daysUntilReset);
  return nextReset;
}

function calculateTimeRemaining(targetDate: Date): CountdownTime {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}

export function useCountdown(targetDate?: Date): CountdownTime {
  const [resetTime, setResetTime] = useState<Date>(
    targetDate || getNextResetTime()
  );
  const [countdown, setCountdown] = useState<CountdownTime>(
    calculateTimeRemaining(resetTime)
  );

  useEffect(() => {
    if (targetDate) {
      setResetTime(targetDate);
    }
  }, [targetDate]);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(resetTime);
      setCountdown(remaining);

      // If expired, recalculate next reset
      if (remaining.isExpired) {
        setResetTime(getNextResetTime());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [resetTime]);

  return countdown;
}

export function formatCountdown(countdown: CountdownTime): string {
  if (countdown.isExpired) {
    return 'Refreshing...';
  }

  const { days, hours, minutes, seconds } = countdown;
  const pad = (n: number) => n.toString().padStart(2, '0');

  if (days > 0) {
    return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

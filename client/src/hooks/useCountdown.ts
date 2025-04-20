import { useState, useEffect } from 'react';

interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export const useCountdown = (targetDate: string): TimeLeft => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  useEffect(() => {
    const countdownDate = new Date(targetDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      // If the countdown is over, display zeros
      if (distance < 0) {
        setTimeLeft({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00'
        });
        return;
      }

      // Calculate days, hours, minutes, seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Format the values
      const formattedDays = days < 10 ? '0' + days : days.toString();
      const formattedHours = hours < 10 ? '0' + hours : hours.toString();
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
      const formattedSeconds = seconds < 10 ? '0' + seconds : seconds.toString();

      setTimeLeft({
        days: formattedDays,
        hours: formattedHours,
        minutes: formattedMinutes,
        seconds: formattedSeconds
      });
    };

    // Update the countdown every second
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
};

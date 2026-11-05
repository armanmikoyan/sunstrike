export type RollingNumberProps = {
  value: number;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  digitClassName?: string;
  duration?: number;
};

export type RollingDigitProps = {
  digit: string;
  duration: number;
  className?: string;
};

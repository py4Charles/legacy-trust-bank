import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconArrow(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 12h15M13 5l7 7-7 7" />
    </Icon>
  );
}

export function IconDiagonal(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 18 18 6M6 6h12v12" />
    </Icon>
  );
}

export function IconImage(props: IconProps) {
  return (
    <Icon viewBox="0 0 48 48" {...props}>
      <rect x="7" y="9" width="34" height="30" rx="2" />
      <circle cx="17" cy="19" r="3" />
      <path d="m8 34 11-10 7 6 6-5 9 9" />
    </Icon>
  );
}

export function IconPerson(props: IconProps) {
  return (
    <Icon viewBox="0 0 64 64" {...props}>
      <circle cx="32" cy="23" r="10" />
      <path d="M12 56v-4a20 20 0 0 1 40 0v4M6 8h10M6 8v10M58 8H48M58 8v10M6 60h10M6 60V50M58 60H48M58 60V50" />
    </Icon>
  );
}

export function IconDownload(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />
    </Icon>
  );
}

export function IconDoc(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 3H5v18h14V8zM14 3v5h5M8 12h8M8 16h8" />
    </Icon>
  );
}

export function IconChevronLeft(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m14 5-7 7 7 7" />
    </Icon>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m10 5 7 7-7 7" />
    </Icon>
  );
}

export function IconClose(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m6 6 12 12M6 18 18 6" />
    </Icon>
  );
}

export function IconExpand(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
    </Icon>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  );
}

export function IconMinus(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h14" />
    </Icon>
  );
}

export function IconShield(props: IconProps) {
  return (
    <Icon viewBox="0 0 32 32" {...props}>
      <path d="m16 3 10 4v9c0 6-10 13-10 13S6 22 6 16V7zM11 15l3 3 7-8" />
    </Icon>
  );
}

export function IconConnect(props: IconProps) {
  return (
    <Icon viewBox="0 0 32 32" {...props}>
      <circle cx="7" cy="9" r="4" />
      <circle cx="25" cy="9" r="4" />
      <circle cx="16" cy="25" r="4" />
      <path d="M11 9h10M9 13l5 8M23 13l-5 8" />
    </Icon>
  );
}

export function IconHeart(props: IconProps) {
  return (
    <Icon viewBox="0 0 32 32" {...props}>
      <path d="M16 27S3 19 3 11c0-8 10-10 13-3 3-7 13-5 13 3 0 8-13 16-13 16z" />
    </Icon>
  );
}

export function IconPhone(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m8 3 3 5-3 3c2 3 3 4 6 5l3-3 4 3v4c-8 4-22-10-18-17z" />
    </Icon>
  );
}

export function IconMail(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="m3 6 9 7 9-7" />
    </Icon>
  );
}

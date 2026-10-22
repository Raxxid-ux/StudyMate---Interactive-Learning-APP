/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Modern Minimal Icon Set for StudyMate
 * Ultra-clean geometric vector icons with refined minimal line-weights (1.75px)
 * Replaces Lucide icons with custom minimalist iconography.
 */

import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

const baseProps = (className = 'w-4 h-4', size?: number | string, rest?: React.SVGProps<SVGSVGElement>) => ({
  width: size || undefined,
  height: size || undefined,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className,
  ...rest,
});

export const BookOpen: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M3 6.5C3 5.12 4.12 4 5.5 4H11V20H5.5C4.12 20 3 18.88 3 17.5V6.5Z" />
    <path d="M21 6.5C21 5.12 19.88 4 18.5 4H13V20H18.5C19.88 20 21 18.88 21 17.5V6.5Z" />
    <path d="M11 7H6" />
    <path d="M11 11H6" />
    <path d="M13 7H18" />
    <path d="M13 11H18" />
  </svg>
);

export const Layers: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M12 3L21 8L12 13L3 8L12 3Z" />
    <path d="M3 12.5L12 17.5L21 12.5" />
    <path d="M3 16.5L12 21.5L21 16.5" />
  </svg>
);

export const AlertCircle: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8V12" />
    <circle cx="12" cy="16" r="0.75" fill="currentColor" stroke="none" />
  </svg>
);

export const AlertTriangle: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M12 3L21.5 19.5H2.5L12 3Z" />
    <path d="M12 9V13.5" />
    <circle cx="12" cy="16.5" r="0.75" fill="currentColor" stroke="none" />
  </svg>
);

export const Award: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <circle cx="12" cy="9" r="6" />
    <path d="M8.2 14.5L7 21L12 18L17 21L15.8 14.5" />
    <path d="M12 6.5V11.5" />
    <path d="M9.5 9H14.5" />
  </svg>
);

export const FileSpreadsheet: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
    <path d="M3.5 9.5H20.5" />
    <path d="M3.5 15H20.5" />
    <path d="M9.5 9.5V20.5" />
    <path d="M15 9.5V20.5" />
  </svg>
);

export const Settings: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </svg>
);

export const Sliders: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M4 21V14" />
    <path d="M4 10V3" />
    <path d="M12 21V12" />
    <path d="M12 8V3" />
    <path d="M20 21V16" />
    <path d="M20 12V3" />
    <circle cx="4" cy="12" r="2.25" />
    <circle cx="12" cy="10" r="2.25" />
    <circle cx="20" cy="14" r="2.25" />
  </svg>
);

export const Sun: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <circle cx="12" cy="12" r="4.25" />
    <path d="M12 2.5V4.5" />
    <path d="M12 19.5V21.5" />
    <path d="M4.5 12H2.5" />
    <path d="M21.5 12H19.5" />
    <path d="M5.28 5.28L6.7 6.7" />
    <path d="M17.3 17.3L18.72 18.72" />
    <path d="M5.28 18.72L6.7 17.3" />
    <path d="M17.3 6.7L18.72 5.28" />
  </svg>
);

export const Moon: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5A7 7 0 0 0 20.5 13.2Z" />
  </svg>
);

export const PlusCircle: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8V16" />
    <path d="M8 12H16" />
  </svg>
);

export const Check: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M5 12.5L9.5 17L19 7.5" />
  </svg>
);

export const CheckCircle: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.5L11 15L15.5 9.5" />
  </svg>
);

export const CheckCircle2: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.5L11 15L15.5 9.5" />
  </svg>
);

export const X: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M18 6L6 18" />
    <path d="M6 6L18 18" />
  </svg>
);

export const Menu: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M4 7H20" />
    <path d="M4 12H20" />
    <path d="M4 17H20" />
  </svg>
);

export const ChevronRight: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M9 5L16 12L9 19" />
  </svg>
);

export const ChevronLeft: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M15 19L8 12L15 5" />
  </svg>
);

export const ChevronDown: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M5 9L12 16L19 9" />
  </svg>
);

export const ChevronUp: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M19 15L12 8L5 15" />
  </svg>
);

export const ArrowRight: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M4 12H19.5" />
    <path d="M14 6.5L19.5 12L14 17.5" />
  </svg>
);

export const ArrowLeft: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M20 12H4.5" />
    <path d="M10 17.5L4.5 12L10 6.5" />
  </svg>
);

export const Quote: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M6.5 10C5.12 10 4 11.12 4 12.5C4 13.88 5.12 15 6.5 15C7.88 15 9 13.88 9 12.5C9 8.5 6 6 4 6" />
    <path d="M16.5 10C15.12 10 14 11.12 14 12.5C14 13.88 15.12 15 16.5 15C17.88 15 19 13.88 19 12.5C19 8.5 16 6 14 6" />
  </svg>
);

export const RotateCcw: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M3.5 4.5V9.5H8.5" />
    <path d="M4.5 14.5A8 8 0 1 0 6 7.5L3.5 9.5" />
  </svg>
);

export const RefreshCw: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M21 4V9H16" />
    <path d="M3 20V15H8" />
    <path d="M19.5 15A8 8 0 0 1 5.5 18L3 15" />
    <path d="M4.5 9A8 8 0 0 1 18.5 6L21 9" />
  </svg>
);

export const Upload: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M4 16.5V18.5C4 19.33 4.67 20 5.5 20H18.5C19.33 20 20 19.33 20 18.5V16.5" />
    <path d="M12 3.5V14.5" />
    <path d="M7.5 8L12 3.5L16.5 8" />
  </svg>
);

export const FileText: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M14 3H6C4.9 3 4 3.9 4 5V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V9L14 3Z" />
    <path d="M14 3V9H20" />
    <path d="M8 13H16" />
    <path d="M8 17H13" />
  </svg>
);

export const Volume2: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M11 5L6 9H3V15H6L11 19V5Z" />
    <path d="M15.5 8.5C16.8 9.8 16.8 14.2 15.5 15.5" />
    <path d="M18.5 5.5C21 8 21 16 18.5 18.5" />
  </svg>
);

export const VolumeX: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M11 5L6 9H3V15H6L11 19V5Z" />
    <path d="M17 10L21 14" />
    <path d="M21 10L17 14" />
  </svg>
);

export const MessageSquare: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M20 15C20 15.83 19.33 16.5 18.5 16.5H7.5L3.5 20.5V5.5C3.5 4.67 4.17 4 5 4H18.5C19.33 4 20 4.67 20 5.5V15Z" />
  </svg>
);

export const Send: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M21 3L10 14" />
    <path d="M21 3L14.5 21L10 14L3 9.5L21 3Z" />
  </svg>
);

export const Maximize2: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M15 3H21V9" />
    <path d="M9 21H3V15" />
    <path d="M21 3L14 10" />
    <path d="M3 21L10 14" />
  </svg>
);

export const Minimize2: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M4 14H10V20" />
    <path d="M20 10H14V4" />
    <path d="M14 10L21 3" />
    <path d="M10 14L3 21" />
  </svg>
);

export const Lightbulb: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M9 18H15" />
    <path d="M10 21H14" />
    <path d="M12 2A7 7 0 0 0 6 12C6 14.5 7.5 16 9 17H15C16.5 16 18 14.5 18 12A7 7 0 0 0 12 2Z" />
  </svg>
);

export const Type: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M4 7V4H20V7" />
    <path d="M9 20H15" />
    <path d="M12 4V20" />
  </svg>
);

export const Heart: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M19.5 12.572L12 20L4.5 12.572A5.333 5.333 0 0 1 12 5.068A5.333 5.333 0 0 1 19.5 12.572Z" />
  </svg>
);

export const Copy: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <rect x="8" y="8" width="12.5" height="12.5" rx="2.5" />
    <path d="M4 15V5C4 4.17 4.67 3.5 5.5 3.5H15.5" />
  </svg>
);

export const User: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <circle cx="12" cy="7.5" r="4" />
    <path d="M4.5 20.5C4.5 16.5 8 14.5 12 14.5C16 14.5 19.5 16.5 19.5 20.5" />
  </svg>
);

export const ShieldCheck: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M12 3L20 6.5V12C20 16.5 16.5 20.5 12 22C7.5 20.5 4 16.5 4 12V6.5L12 3Z" />
    <path d="M9 12L11 14L15.5 9.5" />
  </svg>
);

export const HelpCircle: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9C9.5 7.6 10.6 6.5 12 6.5C13.4 6.5 14.5 7.6 14.5 9C14.5 10.5 13 11.5 12 12.5V13.5" />
    <circle cx="12" cy="16.5" r="0.75" fill="currentColor" stroke="none" />
  </svg>
);

export const GitCommit: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M3 12H9" />
    <path d="M15 12H21" />
  </svg>
);

export const Box: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M12 3L21 8V16L12 21L3 16V8L12 3Z" />
    <path d="M12 12L21 7.5" />
    <path d="M12 12L3 7.5" />
    <path d="M12 12V21" />
  </svg>
);

export const Phone: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M22 16.92V19.92C22.0011 20.1986 21.9441 20.4742 21.8325 20.7294C21.7209 20.9846 21.5573 21.2137 21.3521 21.4019C21.1468 21.5902 20.9046 21.7334 20.6407 21.8224C20.3769 21.9114 20.0974 21.9442 19.82 21.92C16.7428 21.5857 13.787 20.5342 11.19 18.85C8.77382 17.3148 6.72533 15.2663 5.19 12.85C3.49997 10.2413 2.44824 7.27109 2.12 4.18C2.09501 3.90266 2.12787 3.62315 2.21686 3.35929C2.30586 3.09543 2.44907 2.85324 2.63732 2.64797C2.82557 2.4427 3.05469 2.27914 3.30989 2.16754C3.56509 2.05594 3.84069 1.99895 4.11925 2H7.11925C7.5953 1.99525 8.05679 2.16708 8.41624 2.48283C8.77568 2.79858 9.00977 3.23766 9.07325 3.72C9.19174 4.61925 9.41249 5.49999 9.73025 6.34C9.87352 6.7196 9.89434 7.13524 9.78996 7.52844C9.68557 7.92164 9.46077 8.27365 9.14525 8.54L7.87325 9.81C9.28827 12.3006 11.3527 14.365 13.8433 15.78L15.1153 14.51C15.3816 14.1945 15.7336 13.9697 16.1268 13.8653C16.52 13.7609 16.9357 13.7817 17.3153 13.925C18.1553 14.2428 19.036 14.4635 19.9353 14.582C20.4231 14.646 20.8669 14.8847 21.1834 15.2505C21.4999 15.6163 21.6672 16.0847 21.6523 16.568L22 16.92Z" />
  </svg>
);

export const Mail: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M3 7.5L12 13.5L21 7.5" />
  </svg>
);

export const Instagram: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4.25" />
    <circle cx="17.25" cy="6.75" r="0.75" fill="currentColor" stroke="none" />
  </svg>
);

export const Linkedin: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <circle cx="8" cy="8" r="1.25" fill="currentColor" stroke="none" />
    <path d="M8 11.5V17" />
    <path d="M12 17V14C12 12.6 13 11.5 14.25 11.5C15.5 11.5 16.5 12.6 16.5 14V17" />
    <path d="M12 11.5V17" />
  </svg>
);

export const ExternalLink: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M18 13V19C18 20.1 17.1 21 16 21H5C3.9 21 3 20.1 3 19V8C3 6.9 3.9 6 5 6H11" />
    <path d="M15 3H21V9" />
    <path d="M10 14L21 3" />
  </svg>
);

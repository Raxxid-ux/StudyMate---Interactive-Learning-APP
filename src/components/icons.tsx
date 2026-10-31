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

export const Lock: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <rect x="4" y="11" width="16" height="10" rx="2.5" />
    <path d="M7 11V7C7 4.24 9.24 2 12 2C14.76 2 17 4.24 17 7V11" />
    <circle cx="12" cy="16" r="1.25" fill="currentColor" stroke="none" />
  </svg>
);

export const Unlock: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <rect x="4" y="11" width="16" height="10" rx="2.5" />
    <path d="M7 11V7C7 4.24 9.24 2 12 2C14.76 2 17 4.24 17 7" />
    <circle cx="12" cy="16" r="1.25" fill="currentColor" stroke="none" />
  </svg>
);

export const Key: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <circle cx="8" cy="15" r="5" />
    <path d="M11.5 11.5L21.5 1.5" />
    <path d="M16 4L18.5 6.5" />
    <path d="M19 7L21.5 9.5" />
  </svg>
);

export const MessageCircle: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M21 11.5C21.003 12.81 20.695 14.1 20.1 15.25C19.34 16.73 18.15 17.94 16.68 18.72C15.21 19.5 13.52 19.82 11.87 19.64C10.22 19.46 8.67 18.79 7.43 17.72L3 19L4.28 14.57C3.21 13.33 2.54 11.78 2.36 10.13C2.18 8.48 2.5 6.79 3.28 5.32C4.06 3.85 5.27 2.66 6.75 1.9C7.9 1.305 9.19 0.997 10.5 1H11.5C14.08 1.2 16.52 2.29 18.3 4.07C20.08 5.85 21.17 8.29 21.37 10.87L21 11.5Z" />
  </svg>
);

export const Star: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const Trash2: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M3 6H21" />
    <path d="M19 6V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V6" />
    <path d="M8 6V4C8 2.9 8.9 2 10 2H14C15.1 2 16 2.9 16 4V6" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export const Eye: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const Download: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const Users: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M17 21V19C17 17.9 16.1 17 15 17H9C7.9 17 7 17.9 7 19V21" />
    <circle cx="12" cy="11" r="4" />
    <path d="M22 21V19C21.99 18.06 21.36 17.24 20.44 17.03" />
    <path d="M16 7.13C16.86 7.35 17.58 7.97 17.9 8.8" />
  </svg>
);

export const BarChart3: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

export const FilePlus: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="18" x2="12" y2="12" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </svg>
);

export const Search: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const Timer: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <line x1="10" y1="2" x2="14" y2="2" />
    <line x1="12" y1="14" x2="15" y2="11" />
    <circle cx="12" cy="14" r="8" />
  </svg>
);

export const Zap: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export const Play: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export const Pause: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

export const EyeOff: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export const Printer: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

export const Activity: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

export const WitchHat: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M2 19C5 18 8 17.5 12 17.5C16 17.5 19 18 22 19" />
    <path d="M12 3L6 17.5H18L12 3Z" />
    <path d="M7.5 14H16.5" />
    <rect x="10.5" y="12.5" width="3" height="3" rx="0.5" />
  </svg>
);

export const VampireFangs: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M3 8C6 11 18 11 21 8" />
    <path d="M6.5 8L8 14L9.5 8" fill="currentColor" />
    <path d="M14.5 8L16 14L17.5 8" fill="currentColor" />
  </svg>
);

export const Flame: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M8.5 14.5A3.5 3.5 0 0 0 12 18A3.5 3.5 0 0 0 15.5 14.5C15.5 12 13.5 10 12 8C10.5 10 8.5 12 8.5 14.5Z" />
    <path d="M12 2C8 6 6 10 6 14A6 6 0 0 0 18 14C18 10 16 6 12 2Z" />
  </svg>
);

export const Calendar: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const Clock: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const Music: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M9 18V5L21 3V16" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

export const Headphones: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M3 18V12A9 9 0 0 1 21 12V18" />
    <path d="M2 17C2 15.9 2.9 15 4 15H5C6.1 15 7 15.9 7 17V20C7 21.1 6.1 22 5 22H4C2.9 22 2 21.1 2 20V17Z" />
    <path d="M17 17C17 15.9 17.9 15 19 15H20C21.1 15 22 15.9 22 17V20C22 21.1 21.1 22 20 22H19C17.9 22 17 21.1 17 20V17Z" />
  </svg>
);

export const Coffee: React.FC<IconProps> = ({ className, size, ...rest }) => (
  <svg {...baseProps(className, size, rest)}>
    <path d="M18 8H19A3 3 0 0 1 22 11V11A3 3 0 0 1 19 14H18" />
    <path d="M2 8H18V16A4 4 0 0 1 14 20H6A4 4 0 0 1 2 16V8Z" />
    <line x1="6" y1="2" x2="6" y2="4" />
    <line x1="10" y1="2" x2="10" y2="4" />
    <line x1="14" y1="2" x2="14" y2="4" />
  </svg>
);





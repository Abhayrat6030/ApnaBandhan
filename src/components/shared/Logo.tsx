import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("fill-current", className)}
    >
      <g transform="translate(50,50) scale(0.9)">
        <path
          d="M-20,20 C-40,20 -40,-20 -20,-20 C0,-20 0,20 -20,20 Z"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20,20 C40,20 40,-20 20,-20 C0,-20 0,20 20,20 Z"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="0" cy="0" r="10" />
      </g>
    </svg>
  );
};

export default Logo;

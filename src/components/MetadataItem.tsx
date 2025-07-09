import type { ReactNode } from "react";

export const MetadataItem = ({
  icon,
  name,
  value,
  href,
}: {
  icon?: ReactNode;
  name?: string;
  value: string;
  href?: string;
}) => {
  return (
    <div className="flex items-center gap-2 text-xs">
      {name ? (
        <span className="text-zinc-400 flex items-center gap-1">
          {icon}
          {name}:
        </span>
      ) : (
        icon
      )}
      {href ? (
        <a
          href={href}
          className="text-white underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {value}
        </a>
      ) : (
        <span className="text-white">{value}</span>
      )}
    </div>
  );
};

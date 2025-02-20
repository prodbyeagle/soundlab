import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cog, Library, Star } from 'lucide-react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

interface NavLinkProps {
  to: string;
  disabled?: boolean;
  icon: React.ElementType<IconProps>;
  children: React.ReactNode;
}

const Navbar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string): boolean => location.pathname === path;

  const NavLink: React.FC<NavLinkProps> = ({
    to,
    icon: Icon,
    children,
    disabled = false,
  }) => {
    const baseClasses =
      'group flex items-center gap-2 border border-neutral-900 rounded-md px-4 py-2 text-sm font-medium transition-all duration-300';
    const activeClasses = isActive(to)
      ? 'bg-neutral-900/30 text-neutral-100'
      : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200';
    const disabledClasses = 'cursor-default opacity-50';

    const combinedClasses = `${baseClasses} ${
      disabled ? disabledClasses : activeClasses
    }`;

    return (
      <Link
        to={disabled ? '#' : to}
        className={combinedClasses}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
          }
        }}
        aria-disabled={disabled}
      >
        <Icon
          size={18}
          className={`transition-colors ${
            disabled
              ? 'text-neutral-400'
              : isActive(to)
              ? 'text-neutral-50'
              : 'text-neutral-500 group-hover:text-neutral-300'
          }`}
        />
        {children}
      </Link>
    );
  };

  return (
    <div className="flex flex-col border-b border-neutral-900 bg-neutral-950">
      <nav className="flex items-center gap-2 p-2">
        <NavLink to="/" icon={Library}>
          Library
        </NavLink>

        <NavLink to="/favorites" icon={Star}>
          Favorites
        </NavLink>

        <div className="flex-1" />

        <NavLink to="/settings" icon={Cog}>
          Settings
        </NavLink>
      </nav>
    </div>
  );
};

export default Navbar;

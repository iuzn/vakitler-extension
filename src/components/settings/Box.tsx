import React, { forwardRef, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import {
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconChevronUp,
} from '@tabler/icons-react';
import * as Select from '@radix-ui/react-select';
import { SelectItemProps, SelectProps } from '@radix-ui/react-select';
import * as Switch from '@radix-ui/react-switch';
import { SwitchProps } from '@radix-ui/react-switch';
// Chrome i18n translation function
const t = (key: string): string => {
  if (typeof chrome !== 'undefined' && chrome.i18n) {
    const message = chrome.i18n.getMessage(key);
    return message || key;
  }
  return key;
};

export default function Box({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 border-b border-b-zinc-100 px-4 py-3 last:border-b-0 dark:border-b-zinc-900',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function BoxTitle({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h5 className={cn('font-normal opacity-80', className)} {...props}>
      {children}
    </h5>
  );
}

Box.Title = BoxTitle;

function BoxContainer({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-zinc-300 bg-white dark:border-zinc-800 dark:bg-zinc-800',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Box.BoxContainer = BoxContainer;

function BoxLink({
  href,
  className,
  children,
  icon,
  onClick,
  ...props
}: {
  href?: string;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn('flex w-full items-center gap-2', className)}
      {...props}
    >
      <div className="grow">{children}</div>

      <span className="flex shrink-0 items-center justify-center">
        {icon ?? <IconChevronRight size={16} className="opacity-40" />}
      </span>
    </button>
  );
}

Box.BoxLink = BoxLink;

function BoxSelect({
  className,
  value,
  data,
  disabledItems = [],
  ...props
}: SelectProps & {
  value: string;
  className?: string;
  data: [string, string][];
  disabledItems?: string[];
}) {
  // Find the current selected label for display
  const currentItem = data.find(([val]) => val === value);
  const displayValue = currentItem ? currentItem[1] : value;

  return (
    <>
      <Select.Root {...props}>
        {/* trigger */}
        <Select.Trigger
          className={cn(
            'leading-none inline-flex h-10 select-none items-center justify-center gap-2 font-semibold outline-none',
          )}
        >
          <Select.Value placeholder={displayValue} />
          <Select.Icon>
            <IconChevronDown size={16} className="opacity-40" />
          </Select.Icon>
        </Select.Trigger>

        {/* portal */}
        <Select.Portal>
          {/* up */}
          <Select.Content className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-800">
            <Select.ScrollUpButton className="flex items-center justify-center">
              <IconChevronUp size={14} />
            </Select.ScrollUpButton>

            {/* list */}
            <Select.Viewport className="p-2">
              <Select.Group>
                {data.map(([itemValue, label], i) => (
                  <SelectItem
                    key={itemValue}
                    value={itemValue}
                    disabled={disabledItems.includes(itemValue)}
                  >
                    {t(label)}
                  </SelectItem>
                ))}
              </Select.Group>
            </Select.Viewport>

            {/* down */}
            <Select.ScrollDownButton className="flex items-center justify-center">
              <IconChevronDown size={14} />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </>
  );
}

Box.BoxSelect = BoxSelect;

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef<
  {
    children?: ReactNode;
    className: string;
    disabled?: boolean;
  },
  SelectItemProps
>(({ children, className, disabled, ...props }, forwardedRef) => {
  return (
    <Select.Item
      // @ts-ignore TODO: ?
      ref={forwardedRef}
      className={cn(
        'leading-none relative flex h-10 select-none items-center gap-2 rounded-lg pl-4 pr-6',
        'data-[state=checked]:bg-emerald-50 data-[state=checked]:text-emerald-700',
        'dark:data-[state=checked]:bg-emerald-800 dark:data-[state=checked]:text-emerald-300',
        'hover:bg-zinc-50 dark:hover:bg-zinc-700',
        'outline-none',
        disabled && 'pointer-events-none cursor-not-allowed opacity-50',
        className,
      )}
      disabled={disabled}
      {...props}
    >
      <Select.ItemText>{children}</Select.ItemText>

      <Select.ItemIndicator className="inline-flex items-center justify-center">
        <IconCheck size={16} className="text-emerald-500" />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

function BoxSwitch({ className, ...props }: SwitchProps & {}) {
  return (
    <Switch.Root
      className={cn(
        'relative h-7 w-11 rounded-full bg-zinc-400',
        'data-[state=checked]:bg-emerald-500',
        className,
      )}
      {...props}
    >
      <Switch.Thumb className="block size-5 translate-x-1 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-5" />
    </Switch.Root>
  );
}

Box.BoxSwitch = BoxSwitch;

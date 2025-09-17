import { HTMLAttributes, useContext } from 'react';
import { VakitlerStoreContext } from '../../context/VakitlerStoreContext';
import { cn } from '../../lib/utils';
import { useI18nContext } from '../../context/I18nProvider';

export default function TimeSummaryTimer() {
  const { timer } = useContext(VakitlerStoreContext);
  const { t } = useI18nContext();

  if (!timer) return null;

  return (
    <div className="flex items-baseline gap-2 text-5xl font-light leading-[0.9]">
      {timer[0] > 0 ? (
        <>
          <KeyValueComp>
            <ValueComp className="tabular-nums">{timer[0]}</ValueComp>
            {t('hour')}
          </KeyValueComp>
          {timer[1] > 0 && (
            <KeyValueComp>
              <ValueComp className="tabular-nums">{timer[1]}</ValueComp>
              {t('minute')}
            </KeyValueComp>
          )}
        </>
      ) : (
        <>
          {timer[1] > 0 && (
            <KeyValueComp>
              <ValueComp className="tabular-nums">{timer[1]}</ValueComp>
              {t('minute')}
            </KeyValueComp>
          )}
          {timer[1] === 0 && (
            <KeyValueComp>
              <ValueComp className="tabular-nums">{timer[2]}</ValueComp>
              {t('second')}
            </KeyValueComp>
          )}
        </>
      )}
    </div>
  );
}

function KeyValueComp({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('flex items-baseline gap-0.5', className)} {...props} />
  );
}

function ValueComp({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <b className={cn('text-[1.1em] font-medium', className)} {...props} />;
}

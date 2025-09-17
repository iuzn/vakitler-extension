import { TimeNames } from '../../types/common';
import TimeListRow from './TimeListRow';
import TimeListRowBottom from './TimeListRowBottom';
import { useI18nContext } from '../../context/I18nProvider';
import { motion } from 'motion/react';

export default function TimeList() {
  // TimeListRow komponentlerinde zaten error handling var
  // Bu komponent sadece container görevi görüyor
  return (
    <motion.div
      className="grid h-full"
      variants={{
        open: {
          transition: {
            staggerChildren: 0.05,
            delayChildren: 0.05,
            staggerDirection: -1,
          },
        },
      }}
    >
      {Object.keys(TimeNames).map((time, index) => {
        return (
          <TimeListRow key={time} index={index} time={time as TimeNames} />
        );
      })}
      <TimeListRowBottom />
    </motion.div>
  );
}

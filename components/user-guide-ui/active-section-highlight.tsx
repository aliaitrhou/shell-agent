import { memo } from "react";
import { motion } from "framer-motion";
import { Section } from "@/stores/table-of-content-store";

type Props = {
  sections: Section[];
};

export const OutlineActiveSectionHighlight = memo((props: Props) => {
  const { sections } = props;
  const visibleSectionsIds = sections
    .filter((section) => section.isVisible)
    .map((section) => section.id);

  const elTocItems = sections.reduce((map, s) => {
    return {
      ...map,
      [s.id]: s.outlineRef?.current,
    };
  }, {}) as Record<string, HTMLLIElement | null | undefined>;

  const firstVisibleSectionIndex = Math.max(
    0,
    sections.findIndex((section) => section.id === visibleSectionsIds[0]),
  );

  const height: number | string = visibleSectionsIds.reduce(
    (h, id) => h + (elTocItems[id]?.offsetHeight || 0),
    0,
  );

  const top = sections
    .slice(0, firstVisibleSectionIndex)
    .reduce((t, s) => t + (elTocItems[s.id]?.offsetHeight || 0), 0);

  return (
    <motion.div
      className="absolute left-3 w-[1px] bg-orange-400"
      layout
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 0.2 },
      }}
      exit={{ opacity: 0 }}
      style={{ height, top }}
    ></motion.div>
  );
});

OutlineActiveSectionHighlight.displayName = "OutlineActiveSectionHighlight";

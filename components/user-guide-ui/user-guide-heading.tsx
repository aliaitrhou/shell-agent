"use client";

import React, { useEffect, useRef } from "react";
import { useTocStore } from "@/stores/table-of-content-store";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

export const createRehypeHeading = (level: number) => {
  const HeadingTag = `h${level}` as unknown as React.ElementType;

  const RehypeHeading: React.FC<Props> = ({ id, children, ...rest }) => {
    const refHeading = useRef<HTMLHeadingElement | null>(null);
    const registerHeading = useTocStore((state) => state.registerHeading);

    useEffect(() => {
      if (id) registerHeading(id, refHeading);
    }, [id, registerHeading]);

    return (
      <HeadingTag ref={refHeading} id={id} {...rest}>
        {children}
      </HeadingTag>
    );
  };

  return RehypeHeading;
};

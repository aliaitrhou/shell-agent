"use client";

import "./user-guide-markdown-view.css";
import React, { useEffect } from "react";
import { useUserGuideStore } from "@/stores/user-guide-store";
import { FaSpinner } from "react-icons/fa6";
import { useVisibleSections } from "@/hooks/use-visible-sections";

const UserGuideMarkdownView = () => {
  const { dom, renderMarkdownContent } = useUserGuideStore();

  useEffect(() => {
    renderMarkdownContent();
  }, [renderMarkdownContent]);

  useVisibleSections();

  return (
    <div className="markdown-view">
      {dom ? (
        dom
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          <FaSpinner className="animate-spin" />
        </div>
      )}
    </div>
  );
};

export default UserGuideMarkdownView;

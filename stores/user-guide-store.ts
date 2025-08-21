import { create } from "zustand";
import { getMarkdownString } from "@/utils/get-markdown-content-util";
import { MarkdownRenderer } from "@/utils/terms-markdown-processor";
import type { Root as HastRoot } from "hast";
import type { Root as MdastRoot } from "mdast";
import { EXIT, visit } from "unist-util-visit";
import YAML from "yaml";
import { useTocStore } from "./table-of-content-store";

type ContentType = React.ReactElement<
  unknown,
  string | React.JSXElementConstructor<any>
>;

interface TermsProps {
  dom: ContentType | null;
  mdast: MdastRoot | null;
  hast: HastRoot | null;
  renderMarkdownContent: () => Promise<void>;
  title: string | null;
  ErrorCatch: Error | null | undefined;
}

const renderer = new MarkdownRenderer();

export const useUserGuideStore = create<TermsProps>((set) => ({
  renderId: 0,
  dom: null,
  mdast: null,
  hast: null,
  title: null,
  ErrorCatch: null,
  renderMarkdownContent: async () => {
    try {
      const markdown = await getMarkdownString();
      const { result, mdast, hast } = await renderer.render(markdown);

      let title = "Hello, World!";

      console.log("result is : ", result);
      console.log("mdast is : ", mdast);
      console.log("hast is : ", hast);

      visit(mdast, "yaml", (node) => {
        const frontmatter = YAML.parse(node.value);
        title = frontmatter.title;
        return EXIT;
      });

      console.log("title is : ", title);

      set({
        dom: result,
        mdast,
        hast,
        title,
        ErrorCatch: null,
      });

      useTocStore.getState().update(mdast);
    } catch (e) {
      console.error(`Failed to load Markdown content: ${e}`);
      set({
        dom: null,
        mdast: null,
        hast: null,
        title: null,
        ErrorCatch: new Error("Failed to load Markdown!"),
      });
    }
  },
}));

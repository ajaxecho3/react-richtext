import styled from "@emotion/styled";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Paragraph,
  Redo2,
  Text,
  Type,
  Undo2,
} from "lucide-react";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import Select from "../../ui/select";
import { useState } from "react";
const StyledToolbar = styled("div")(() => ({
  display: "flex",
  backgroundColor: "#fff",
  padding: "4px",
  borderTopLeftRadius: "4px",
  borderTopRightRadius: "4px",
  verticalAlign: "middle",
  borderBottom: "1px solid #eee",

  ".divider": {
    width: "2px",
    backgroundColor: "#eee",
    margin: "0 4px",
  },

  ".toolbar-item": {
    border: 0,
    display: "flex",
    background: "none",
    borderRadius: "10px",
    padding: "8px",
    cursor: "pointer",
    verticalAlign: "middle",
  },
}));
function HeadingToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const onClick = (tag: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (tag === "h1") {
          $setBlocksType(selection, () => $createHeadingNode(tag));
        }
        if (tag === "h2") {
          $setBlocksType(selection, () => $createHeadingNode(tag));
        }
        if (tag === "h3") {
          $setBlocksType(selection, () => $createHeadingNode(tag));
        }
      }
    });
  };

  const items = [
    {
      label: "Paragraph",
      value: "p",
      icon: <Text size={18} />,
    },
    {
      label: "Heading 1",
      value: "h1",
      icon: <Heading1 size={18} />,
    },
    {
      label: "Heading 2",
      value: "h2",
      icon: <Heading2 size={18} />,
    },
    {
      label: "Heading 2",
      value: "h3",
      icon: <Heading3 size={18} />,
    },
  ];

  return (
    <>
      <Select
        items={items}
        value="p"
        defaultValue="p"
        onChange={(e) => onClick(e)}
      />
    </>
  );
}

type ListTag = "ol" | "ul";
function ListToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const onClick = (tag: ListTag) => {
    console.log(tag);
    if (tag === "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      return;
    }

    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  return (
    <>
      <ListPlugin />

      <button className="toolbar-item" onClick={() => onClick("ol")}>
        <ListOrdered size={18} />
      </button>
      <button className="toolbar-item" onClick={() => onClick("ul")}>
        <List size={18} />
      </button>
    </>
  );
}

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  return (
    <StyledToolbar>
      <button
        className="toolbar-item"
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
      >
        <Undo2 size={18} />
      </button>
      <button
        className="toolbar-item"
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
      >
        <Redo2 size={18} />
      </button>
      <div className="divider" />
      <HeadingToolbarPlugin />
      <div className="divider" />
      <ListToolbarPlugin />
    </StyledToolbar>
  );
};

export default ToolbarPlugin;

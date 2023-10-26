import styled from "@emotion/styled";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_LOW,
  DEPRECATED_$isGridSelection,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  NodeKey,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import {
  Baseline,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Text,
  Underline,
  Undo2,
} from "lucide-react";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
  $setBlocksType,
} from "@lexical/selection";
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import Select from "../../ui/select";
import { useCallback, useEffect, useState } from "react";
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  mergeRegister,
} from "@lexical/utils";
import ColorPickerDropDown from "../../ui/colorpickerdropdown";

const blockTypeToBlockName = {
  bullet: "Bulleted List",
  check: "Check List",
  code: "Code Block",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  number: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
};
const rootTypeToRootName = {
  root: "Root",
  table: "Table",
};

const FONT_FAMILY_OPTIONS = [
  "Arial",
  "Courier New",
  "Georgia",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana",
];

const FONT_SIZE_OPTIONS = [
  "10px",
  "11px",
  "12px",
  "13px",
  "14px",
  "15px",
  "16px",
  "17px",
  "18px",
  "19px",
  "20px",
];

const StyledToolbar = styled("div")(() => ({
  display: "flex",
  backgroundColor: "#fff",
  padding: "4px",
  borderTopLeftRadius: "4px",
  borderTopRightRadius: "4px",
  verticalAlign: "middle",
  borderBottom: "1px solid #eee",
  gap: "2px",

  ".divider": {
    width: "1px",
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

  ".active": {
    backgroundColor: "rgb(223, 232, 250)",
  },
}));

// function dropDownActive(active: boolean) {
//   if (active) return true;
//   return false;
// }

type BlockFormatPluginProps = {
  disabled: boolean;
  blockType: keyof typeof blockTypeToBlockName;
  rootType: keyof typeof rootTypeToRootName;
  editor: LexicalEditor;
};

type item = {
  label: string;
  value: keyof typeof blockTypeToBlockName;
  icon: React.ReactNode;
};

function BlockFormatPlugin({
  disabled = false,
  blockType,
  rootType,
  editor,
}: BlockFormatPluginProps) {
  const onClick = (tag: keyof typeof blockTypeToBlockName) => {
    if (tag === "paragraph") {
      editor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }

    if (
      tag === "h1" ||
      tag === "h2" ||
      tag === "h3" ||
      tag === "h4" ||
      tag === "h5" ||
      tag === "h6"
    ) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(tag));
        }
      });
    }

    if (tag === "quote") {
      if (blockType !== "quote") {
        editor.update(() => {
          const selection = $getSelection();

          if (
            $isRangeSelection(selection) ||
            DEPRECATED_$isGridSelection(selection)
          ) {
            $setBlocksType(selection, () => $createQuoteNode());
          }
        });
      }
    }

    // if (blockType !== "bullet") {
    //   editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    // } else {
    //   editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    // }

    // if (blockType !== "check") {
    //   editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    // } else {
    //   editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    // }

    // if (blockType !== "number") {
    //   editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    // } else {
    //   editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    // }
  };

  const items: item[] = [
    {
      label: "Paragraph",
      value: "paragraph",
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
      label: "Heading 3",
      value: "h3",
      icon: <Heading3 size={18} />,
    },
    {
      label: "Heading 4",
      value: "h4",
      icon: <Heading4 size={18} />,
    },
    {
      label: "Heading 5",
      value: "h5",
      icon: <Heading5 size={18} />,
    },
    {
      label: "Heading 6",
      value: "h6",
      icon: <Heading6 size={18} />,
    },
    {
      label: "Quote",
      value: "quote",
      icon: <Quote size={18} />,
    },
    // {
    //   label: "Bullet",
    //   value: "bullet",
    //   icon: <List size={18} />,
    // },
    // {
    //   label: "Number",
    //   value: "number",
    //   icon: <ListOrdered size={18} />,
    // },
  ];

  return (
    <>
      <Select
        items={items}
        value={blockType}
        defaultValue="paragraph"
        onChange={(e) => onClick(e as keyof typeof blockTypeToBlockName)}
      />
    </>
  );
}

type FontFormatPluginProps = {
  editor: LexicalEditor;
  value: string;
  style: string;
  disabled?: boolean;
};

type FontItem = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};
function FontFormatPlugin({
  editor,
  value,
  style,
  disabled = false,
}: FontFormatPluginProps) {
  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $patchStyleText(selection, {
            [style]: option,
          });
        }
      });
    },
    [editor, style]
  );

  const fontFamilyItems: FontItem[] = FONT_FAMILY_OPTIONS.map((item) => {
    return {
      label: item,
      value: item,
    };
  });
  const fontSizeItems: FontItem[] = FONT_SIZE_OPTIONS.map((item) => {
    return {
      label: item,
      value: item,
    };
  });

  return (
    <Select
      value={value}
      defaultValue={fontFamilyItems[0].value}
      items={style === "font-family" ? fontFamilyItems : fontSizeItems}
      onChange={(e) => {
        handleClick(e);
      }}
    />
  );
}

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>("paragraph");
  const [rootType, setRootType] =
    useState<keyof typeof rootTypeToRootName>("root");
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null
  );
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  //text format states
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  //font format states
  const [fontSize, setFontSize] = useState<string>("15px");
  const [fontColor, setFontColor] = useState<string>("#000");
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [bgColor, setBgColor] = useState<string>("#000");
  const updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();

              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementkey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementkey);

      //update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));
      setIsCode(selection.hasFormat("code"));

      if (elementDOM !== null) {
        setSelectedElementKey(elementkey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          );

          const type = parentList
            ? parentList.getListType()
            : element.getListType();

          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();

          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
        }
      }

      setFontSize(
        $getSelectionStyleValueForProperty(selection, "font-size", "15px")
      );

      setFontColor(
        $getSelectionStyleValueForProperty(selection, "color", "#000")
      );
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          "background-color",
          "#000"
        )
      );
      setFontFamily(
        $getSelectionStyleValueForProperty(selection, "font-family", "Arial")
      );
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        setActiveEditor(newEditor);

        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [updateToolbar, activeEditor, editor]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      activeEditor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $patchStyleText(selection, styles);
        }
      });
    },
    [activeEditor]
  );

  const onFontColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ color: value });
    },
    [applyStyleText]
  );
  const onBgColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ "background-color": value });
    },
    [applyStyleText]
  );

  return (
    <StyledToolbar>
      <button
        disabled={!canUndo || !isEditable}
        className="toolbar-item"
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
      >
        <Undo2 size={18} />
      </button>
      <button
        disabled={!canRedo || !isEditable}
        className="toolbar-item"
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
      >
        <Redo2 size={18} />
      </button>
      <div className="divider" />
      {blockType in blockTypeToBlockName && activeEditor === editor && (
        <>
          <BlockFormatPlugin
            disabled={!isEditable}
            blockType={blockType}
            rootType={rootType}
            editor={editor}
          />
          <ListPlugin />
          <div className="divider" />
        </>
      )}
      <FontFormatPlugin
        editor={editor}
        value={fontFamily}
        style={"font-family"}
      />
      <FontFormatPlugin editor={editor} value={fontSize} style={"font-size"} />
      <div className="divider" />
      <ColorPickerDropDown
        trigger={
          <button className="toolbar-item">
            <Baseline size={18} color={fontColor} />
          </button>
        }
        color={fontColor}
        onColorChange={onFontColorSelect}
      />
      <ColorPickerDropDown
        trigger={
          <button className="toolbar-item">
            <Highlighter size={18} color={bgColor} />
          </button>
        }
        color={bgColor}
        onColorChange={onBgColorSelect}
      />
      <button
        className={`toolbar-item ${isBold ? "active" : ""}`}
        disabled={!isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
      >
        <Bold size={18} />
      </button>
      <button
        className={`toolbar-item ${isItalic ? "active" : ""}`}
        disabled={!isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
      >
        <Italic size={18} />
      </button>
      <button
        className={`toolbar-item ${isUnderline ? "active" : ""}`}
        disabled={!isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
      >
        <Underline size={18} />
      </button>
    </StyledToolbar>
  );
};

export default ToolbarPlugin;

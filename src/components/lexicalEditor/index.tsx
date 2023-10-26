import styled from "@emotion/styled";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "./plugins/toolbarPlugin";
import exampleTheme from "./exampleTheme";
import { HeadingNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";

const EditorContainer = styled("div")(() => ({}));

const EditorInnerContainer = styled("div")(() => ({
  backgroundColor: "#fff",
  position: "relative",
  borderBottomRightRadius: "4px",
  borderBottomLeftRadius: "4px",
}));

const EditorPlaceHolder = styled("div")(() => ({
  color: "#999",
  overflow: "hidden",
  position: "absolute",
  textOverflow: "ellipsis",
  top: "20px",
  left: "15px",
  fontSize: "15px",
  userSelect: "none",
}));

const StyledContentEditable = styled(ContentEditable)(() => ({
  minHeight: "150px",
  padding: "3px 10px",
  tabSize: 1,
  width: "100%",
  position: "relative",
  outline: 0,
}));

const StyledContainer = styled("div")(() => ({
  maxWidth: "1200px",
  width: "100%",
  marginLeft: "auto",
  marginRight: "auto",
  padding: "24px",
}));

const onError = (error: Error) => {
  console.log(error);
};

const EditorComponent = () => {
  const initialConfig = {
    namespace: "editor",
    theme: exampleTheme,
    onError,
    nodes: [HeadingNode, ListNode, ListItemNode],
  };
  return (
    <StyledContainer>
      <LexicalComposer initialConfig={initialConfig}>
        <EditorContainer>
          <ToolbarPlugin />
          <EditorInnerContainer>
            <RichTextPlugin
              contentEditable={<StyledContentEditable />}
              placeholder={
                <EditorPlaceHolder>Enter some text</EditorPlaceHolder>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
          </EditorInnerContainer>
        </EditorContainer>
      </LexicalComposer>
    </StyledContainer>
  );
};

export default EditorComponent;

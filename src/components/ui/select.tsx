import React from "react";
import styled from "@emotion/styled";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";

export interface item<T> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface SelectProps<T> {
  value: string;
  defaultValue: string;
  items: item<T>[];
  onChange: (e: string) => void;
}

function Select<T>({ value, defaultValue, items, onChange }: SelectProps<T>) {
  return (
    <SelectPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onChange}
    >
      <SelectTrigger>
        <SelectPrimitive.Value placeholder="Select something" />
        <SelectIcon>
          <ChevronDown size={16} />
        </SelectIcon>
      </SelectTrigger>
      <SelectPrimitive.Portal>
        <SelectContent position="popper" sideOffset={2}>
          <SelectViewport>
            {items.map((item) => (
              <SelectItem
                value={item.value as string}
                key={item.value as string}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {item.icon} <span>{item.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectViewport>
        </SelectContent>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

const SelectTrigger = styled(SelectPrimitive.SelectTrigger)(() => ({
  all: "unset",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 4,
  padding: "0 15px",
  fontSize: 13,
  lineHeight: 1,
  height: 35,
  gap: 5,
  backgroundColor: "white",
  color: "black",
  outline: 0,
  "&:hover": { backgroundColor: "#ccc" },
  "&:focus": { boxShadow: `0 0 0 2px black` },
  "&[data-placeholder]": { color: "#333" },
}));

const SelectIcon = styled(SelectPrimitive.Icon)(() => ({}));

const SelectContent = styled(SelectPrimitive.Content)(() => ({
  overflow: "hidden",
  backgroundColor: "white",
  borderRadius: 6,
  boxShadow:
    "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
}));

const SelectViewport = styled(SelectPrimitive.Viewport)(() => ({
  padding: 5,
}));

const SelectItem = React.forwardRef(
  (
    {
      children,
      value,
      ...props
    }: {
      children: React.ReactNode;
      value: string;
    },
    forwardedRef
  ) => {
    return (
      <StyledItem {...props} value={value} ref={forwardedRef}>
        <StyledItemText>{children}</StyledItemText>
      </StyledItem>
    );
  }
);

const StyledItem = styled(SelectPrimitive.Item)(() => ({
  fontSize: 13,
  lineHeight: 1,
  color: "black",
  borderRadius: 3,
  display: "flex",
  alignItems: "center",
  height: 25,
  padding: "0 10px 0 10px",
  position: "relative",
  userSelect: "none",

  "&[data-disabled]": {
    color: "grey",
    pointerEvents: "none",
  },

  "&[data-highlighted]": {
    outline: "none",
    backgroundColor: "#ccc",
    color: "#333",
  },
}));

const StyledItemText = styled(SelectPrimitive.ItemText)(() => ({
  display: "flex",
  alignItems: "center",
  textAlign: "center",
}));

export default Select;

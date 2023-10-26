import React from "react";
import * as Popover from "@radix-ui/react-popover";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import ColorPicker from "./colorpicker";
type Props = {
  color: string;
  onColorChange: (e: string) => void;
  trigger: React.ReactNode;
};

const ColorPickerDropDown = ({ color, onColorChange, trigger }: Props) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <PopoverContent
          sideOffset={5}
          onFocusOutside={(e) => e.preventDefault()}
        >
          <ColorPicker
            color={color}
            onChange={(e) => {
              onColorChange(e);
            }}
          />
          <PopoverArrow />
        </PopoverContent>
      </Popover.Portal>
    </Popover.Root>
  );
};

const slideUpAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideRightAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(-2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const slideDownAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(-2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideLeftAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const PopoverContent = styled(Popover.Content)(() => ({
  borderRadius: 4,
  padding: "2px",
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
  backgroundColor: "white",
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  animationDuration: "400ms",
  animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  willChange: "transform, opacity",
  '&[data-state="open"]': {
    '&[data-side="top"]': { animationName: slideDownAndFade },
    '&[data-side="right"]': { animationName: slideLeftAndFade },
    '&[data-side="bottom"]': { animationName: slideUpAndFade },
    '&[data-side="left"]': { animationName: slideRightAndFade },
  },
  "&:focus": {
    boxShadow: `hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px, 0 0 0 2px `,
  },
}));

const PopoverArrow = styled(Popover.Arrow)(() => ({
  fill: "white",
}));

export default ColorPickerDropDown;

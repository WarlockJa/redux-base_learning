import "./preferences.css";
import Icons from "../../assets/Icons";
import { useLayoutEffect, useRef, useState } from "react";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

interface ICollapsingMenuProps {
  defaultHeaderOffset: number;
  headerTitle: string;
  headerContent: string;
  menuState: boolean;
  menuSwitch: ActionCreatorWithPayload<boolean>;
  formContent: JSX.Element;
  verticalOffset: number;
}

function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const collapsingMenu = ({
  defaultHeaderOffset,
  headerTitle,
  headerContent,
  menuState,
  menuSwitch,
  formContent,
  verticalOffset,
}: ICollapsingMenuProps) => {
  // store data
  const dispatch = useDispatch();
  // menu section states
  const collapsingMenuItemRef = useRef<HTMLDivElement>(null);
  const [collapsingMenuItemMenuHeight, setCollapsingMenuItemMenuHeight] =
    useState(defaultHeaderOffset);

  // calculating current menu offset
  useLayoutEffect(() => {
    menuState
      ? setCollapsingMenuItemMenuHeight(
          collapsingMenuItemRef.current!.children[0].clientHeight +
            defaultHeaderOffset
        )
      : setCollapsingMenuItemMenuHeight(defaultHeaderOffset);
  }, [menuState]);

  const menuItem = (
    <div
      className="preferencesItem"
      style={{ transform: `translateY(${verticalOffset}px)` }}
    >
      <h3
        className="preferencesItem--header"
        onClick={() => dispatch(menuSwitch(!menuState))}
      >
        {headerContent}{" "}
        <span title={headerTitle}>
          {menuState ? (
            <Icons.CloseAddTodo className="collapsingMenuButton svg-negative" />
          ) : (
            <Icons.OpenAddTodo className="collapsingMenuButton svg-positive" />
          )}
        </span>
      </h3>
      <div
        className="preferencesItem--formWrapper"
        ref={collapsingMenuItemRef}
        visible={menuState ? 1 : 0}
      >
        {formContent}
      </div>
    </div>
  );

  const currentHeight = collapsingMenuItemMenuHeight;

  return { menuItem, currentHeight };
};

export default collapsingMenu;

import clsx from "clsx";
import React from "react";

export function Loader({ small }: { small: boolean }) {
  return (
    <div
      className={clsx({
        "lds-ellipsis": !small,
        "lds-ellipsis-small": small,
      })}
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

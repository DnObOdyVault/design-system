import classNames from "classnames";
import { ReactNode } from "react";
import edit from "@material-symbols/svg-400/sharp/edit-fill.svg";
import check from "@material-symbols/svg-400/sharp/check.svg";
import lock from "@material-symbols/svg-400/sharp/lock-fill.svg";
import { Title } from "../Title/Title";
import { Svg } from "../Svg";
import type { VerticalStepMode } from "./types";

import "@axa-fr/design-system-slash-css/dist/Steps/VerticalStep.css";
import { Button } from "../Button/Button";

type Props = {
  title: string;
  id: string;
  stepMode: VerticalStepMode;
  clickModifyButton: () => void;
  form: ReactNode;
  restitution: ReactNode;
  modifyButtonLabel?: string;
  modifyButtonAriaLabel?: string;
  showRestitution?: boolean;
};

const defaultClassName = "af-vertical-step";

export const isStepInEdition = (stepMode: VerticalStepMode) =>
  stepMode === "edited";
export const isStepValidated = (stepMode: VerticalStepMode) =>
  stepMode === "validated";
export const isStepLocked = (stepMode: VerticalStepMode) =>
  stepMode === "locked";

export const VerticalStep = ({
  title,
  id,
  stepMode,
  modifyButtonLabel,
  modifyButtonAriaLabel,
  clickModifyButton,
  form,
  restitution,
  showRestitution = true,
}: Props) => {
  return (
    <div
      className={classNames(defaultClassName, {
        [`${defaultClassName}--edition`]: isStepInEdition(stepMode),
      })}
    >
      <div
        className={classNames("af-vertical-step-icon", {
          [`${defaultClassName}-icon--validated`]: isStepValidated(stepMode),
          [`${defaultClassName}-icon--locked`]: isStepLocked(stepMode),
          [`${defaultClassName}-icon--edited`]: isStepInEdition(stepMode),
        })}
      >
        {isStepValidated(stepMode) ? (
          <Svg role="presentation" src={check} />
        ) : null}
        {isStepLocked(stepMode) ? <Svg role="presentation" src={lock} /> : null}
        {isStepInEdition(stepMode) ? (
          <Svg role="presentation" src={edit} />
        ) : null}
      </div>
      <Title
        className={classNames("af-title", `${defaultClassName}-title`)}
        id={id}
      >
        {title}
        {isStepValidated(stepMode) ? (
          <Button
            aria-label={modifyButtonAriaLabel ?? `Modifier l'étape ${title}`}
            onClick={clickModifyButton}
            className="af-vertical-step-title-button"
          >
            <Svg role="presentation" src={edit} />
            {modifyButtonLabel ?? "Modifier"}
          </Button>
        ) : null}
      </Title>

      {isStepInEdition(stepMode) ? <section>{form}</section> : null}
      {isStepValidated(stepMode) && showRestitution ? (
        <section>{restitution}</section>
      ) : null}

      {isStepInEdition(stepMode) ? (
        <div
          className={classNames(
            `${defaultClassName}-icon ${defaultClassName}-icon--lastIcon`,
          )}
        >
          <Svg role="presentation" src={check} />
        </div>
      ) : null}
    </div>
  );
};

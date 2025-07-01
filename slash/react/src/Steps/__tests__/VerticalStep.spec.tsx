import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { axe } from "jest-axe";
import {
  VerticalStep,
  isStepInEdition,
  isStepLocked,
  isStepValidated,
} from "../VerticalStep";
import { VerticalStepMode } from "../types";

const setStepMode = vi.fn();

const VerticalStepComponent = (stepMode: VerticalStepMode) => (
  <VerticalStep
    title="title"
    id="id"
    stepMode={stepMode}
    clickModifyButton={setStepMode}
    form={<p>Formulaire</p>}
    restitution={<p>Restitution</p>}
  />
);

describe("isStepInEdition", () => {
  it.each`
    stepMode       | expected
    ${"edited"}    | ${true}
    ${"locked"}    | ${false}
    ${"validated"} | ${false}
  `(
    "should return $expected when stepMode is $stepMode",
    ({ stepMode, expected }) => {
      expect(isStepInEdition(stepMode)).toBe(expected);
    },
  );
});

describe("isStepValidated", () => {
  it.each`
    stepMode       | expected
    ${"edited"}    | ${false}
    ${"locked"}    | ${false}
    ${"validated"} | ${true}
  `(
    "should return $expected when stepMode is $stepMode",
    ({ stepMode, expected }) => {
      expect(isStepValidated(stepMode)).toBe(expected);
    },
  );
});

describe("isStepLocked", () => {
  it.each`
    stepMode       | expected
    ${"edited"}    | ${false}
    ${"locked"}    | ${true}
    ${"validated"} | ${false}
  `(
    "should return $expected when stepMode is $stepMode",
    ({ stepMode, expected }) => {
      expect(isStepLocked(stepMode)).toBe(expected);
    },
  );
});

describe("VerticalStep", () => {
  it.each`
    stepMode       | expected
    ${"edited"}    | ${false}
    ${"locked"}    | ${false}
    ${"validated"} | ${true}
  `(
    "should show Modifier bouton or not when stepMode is $stepMode",
    ({ stepMode, expected }) => {
      render(VerticalStepComponent(stepMode));

      if (expected) {
        expect(
          screen.getByRole("button", { name: /Modifier/i }),
        ).toBeInTheDocument();
      } else {
        expect(
          screen.queryByRole("button", { name: /Modifier/i }),
        ).not.toBeInTheDocument();
      }
    },
  );

  it.each`
    stepMode       | expected
    ${"edited"}    | ${true}
    ${"locked"}    | ${false}
    ${"validated"} | ${false}
  `(
    "should show form or not when stepMode is $stepMode",
    ({ stepMode, expected }) => {
      render(VerticalStepComponent(stepMode));

      if (expected) {
        expect(screen.getByText("Formulaire")).toBeInTheDocument();
      } else {
        expect(screen.queryByText("Formulaire")).not.toBeInTheDocument();
      }
    },
  );

  it.each`
    stepMode       | expected
    ${"edited"}    | ${false}
    ${"locked"}    | ${false}
    ${"validated"} | ${true}
  `(
    "should show restitution or not when stepMode is $stepMode",
    ({ stepMode, expected }) => {
      render(VerticalStepComponent(stepMode));

      if (expected) {
        expect(screen.getByText("Restitution")).toBeInTheDocument();
      } else {
        expect(screen.queryByText("Restitution")).not.toBeInTheDocument();
      }
    },
  );

  it("should show form after clicking on Modifier button", () => {
    render(VerticalStepComponent("validated"));

    const button = screen.getByRole("button", { name: /Modifier/i });
    button.click();

    expect(setStepMode).toHaveBeenCalled();
  });

  it("should not show restitution when showRestitution is set to false", () => {
    render(
      <VerticalStep
        title="title"
        id="id"
        stepMode="validated"
        clickModifyButton={setStepMode}
        form={<p>Formulaire</p>}
        restitution={<p>Restitution</p>}
        showRestitution={false}
      />,
    );

    expect(screen.queryByText("Restitution")).not.toBeInTheDocument();
  });

  it("ne doit pas avoir de violations d’accessibilité (axe)", async () => {
    const { container } = render(VerticalStepComponent("validated"));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

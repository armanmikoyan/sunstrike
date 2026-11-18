import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SettingsField } from "./settings-field";

describe("settings field", () => {
  it("omits the hint when a field has none", () => {
    render(
      <SettingsField label="User ID">
        <span>usr_01</span>
      </SettingsField>,
    );

    expect(screen.getByText("User ID")).toBeInTheDocument();
    expect(screen.queryByText("Used for sign-in")).not.toBeInTheDocument();
  });
});

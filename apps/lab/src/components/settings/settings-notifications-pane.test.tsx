import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SettingsNotificationsPane } from "./settings-notifications-pane";

describe("notifications pane", () => {
  it("marks each notification read or unread", () => {
    render(<SettingsNotificationsPane />);

    expect(screen.getAllByText("Unread")).toHaveLength(1);
    expect(screen.getAllByText("Read")).toHaveLength(2);
    expect(screen.getByText("Generation failed")).toBeInTheDocument();
  });
});

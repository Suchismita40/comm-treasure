import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Providers from "../../components/Providers";
import TreasuryPage from "../../app/treasury/page";

describe("Treasury Hub Main Application Page", () => {
  it("renders Community Treasury Hub header and stats bar", () => {
    render(
      <Providers>
        <TreasuryPage />
      </Providers>
    );

    expect(screen.getByText("Community Treasury Hub")).toBeInTheDocument();
    expect(screen.getByText("Deposit XLM")).toBeInTheDocument();
    expect(screen.getByText("Create Proposal")).toBeInTheDocument();
  });
});

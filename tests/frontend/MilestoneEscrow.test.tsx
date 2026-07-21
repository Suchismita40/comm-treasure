import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TreasuryContractClient } from "../../lib/stellar/contract-client";

describe("Milestone-Based Escrow Disbursal Logic & Client", () => {
  it("calculates milestone tranche amounts correctly on proposal creation", async () => {
    const res = await TreasuryContractClient.createProposal(
      "GDEMOTREASURYVOTER5762XLMBALANCESTELLARTESTNET",
      "Milestone Test Proposal",
      "Testing milestone escrow tranche allocation",
      "GBOOTCAMPDEVRECEIVERSTELLARTESTNET012345",
      10000,
      4
    );

    expect(res.proposalId).toBeGreaterThan(0);
    expect(res.txHash).toBeDefined();

    const proposals = await TreasuryContractClient.fetchProposals();
    const created = proposals.find((p) => p.id === res.proposalId);

    expect(created).toBeDefined();
    expect(created?.milestoneCount).toBe(4);
    expect(created?.milestoneAmount).toBe(2500);
  });

  it("releases milestone tranches and updates claimed count", async () => {
    const proposals = await TreasuryContractClient.fetchProposals();
    const executedProp = proposals.find((p) => p.status === "Executed");

    if (executedProp) {
      const initialClaimed = executedProp.milestonesClaimed || 1;
      const txHash = await TreasuryContractClient.releaseMilestone(
        "GADMINSTELLARTESTNETCOMMUNITYTREASURYADMIN01",
        executedProp.id
      );

      expect(txHash).toBeDefined();
      expect(executedProp.milestonesClaimed).toBe(initialClaimed + 1);
    }
  });
});

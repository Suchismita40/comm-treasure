#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, BytesN, Env, String, Symbol, Vec,
};

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum Role {
    Admin,
    Treasurer,
    Member,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum ProposalStatus {
    Active,
    Passed,
    Rejected,
    Executed,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Proposal {
    pub id: u32,
    pub creator: Address,
    pub title: String,
    pub description: String,
    pub recipient: Address,
    pub amount: i128,
    pub votes_yes: i128,
    pub votes_no: i128,
    pub target_ledger: u32,
    pub status: ProposalStatus,
    pub created_at: u64,
    pub milestone_count: u32,
    pub current_milestone: u32,
    pub milestone_amount: i128,
    pub milestones_claimed: u32,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct TreasuryState {
    pub total_balance: i128,
    pub total_proposals: u32,
    pub admin: Address,
    pub reviewer_rewards_pool: i128,
}

#[contracttype]
pub enum DataKey {
    Admin,
    TotalBalance,
    ProposalCount,
    Proposal(u32),
    UserRole(Address),
    UserContribution(Address),
    ReviewerRewardsPool,
}

#[contract]
pub struct TreasuryCoreContract;

#[contractimpl]
impl TreasuryCoreContract {
    /// Initialize the Treasury Core contract with an admin
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TotalBalance, &0i128);
        env.storage().instance().set(&DataKey::ProposalCount, &0u32);
        env.storage().instance().set(&DataKey::ReviewerRewardsPool, &50000i128);
        env.storage().persistent().set(&DataKey::UserRole(admin.clone()), &Role::Admin);
    }

    /// Deposit funds into the Community Treasury
    pub fn deposit(env: Env, from: Address, amount: i128) {
        from.require_auth();
        if amount <= 0 {
            panic!("Amount must be positive");
        }

        let mut balance: i128 = env.storage().instance().get(&DataKey::TotalBalance).unwrap_or(0i128);
        balance += amount;
        env.storage().instance().set(&DataKey::TotalBalance, &balance);

        let user_key = DataKey::UserContribution(from.clone());
        let current_contrib: i128 = env.storage().persistent().get(&user_key).unwrap_or(0i128);
        env.storage().persistent().set(&user_key, &(current_contrib + amount));

        env.events().publish((symbol_short!("deposit"), from), (amount, balance));
    }

    /// Inter-Contract Entry Point: Reward a reviewer from the Treasury Rewards Pool
    pub fn reward_reviewer(env: Env, caller_contract: Address, reviewer: Address, reward_amount: i128) {
        caller_contract.require_auth();

        let mut pool: i128 = env.storage().instance().get(&DataKey::ReviewerRewardsPool).unwrap_or(0i128);
        if pool < reward_amount {
            panic!("Insufficient reviewer rewards pool");
        }
        pool -= reward_amount;
        env.storage().instance().set(&DataKey::ReviewerRewardsPool, &pool);

        let mut balance: i128 = env.storage().instance().get(&DataKey::TotalBalance).unwrap_or(0i128);
        balance += reward_amount;
        env.storage().instance().set(&DataKey::TotalBalance, &balance);

        env.events().publish(
            (symbol_short!("reward"), reviewer.clone()),
            (reward_amount, pool),
        );
    }

    /// Create a new proposal with milestone escrow count
    pub fn create_proposal(
        env: Env,
        creator: Address,
        title: String,
        description: String,
        recipient: Address,
        amount: i128,
        duration_ledgers: u32,
        milestone_count: u32,
    ) -> u32 {
        creator.require_auth();

        if amount <= 0 {
            panic!("Amount must be positive");
        }

        let count_milestones = if milestone_count == 0 { 1 } else { milestone_count };
        let tranche_amount = amount / (count_milestones as i128);

        let mut count: u32 = env.storage().instance().get(&DataKey::ProposalCount).unwrap_or(0u32);
        count += 1;

        let proposal = Proposal {
            id: count,
            creator: creator.clone(),
            title,
            description,
            recipient,
            amount,
            votes_yes: 0,
            votes_no: 0,
            target_ledger: env.ledger().sequence() + duration_ledgers,
            status: ProposalStatus::Active,
            created_at: env.ledger().timestamp(),
            milestone_count: count_milestones,
            current_milestone: 1,
            milestone_amount: tranche_amount,
            milestones_claimed: 0,
        };

        env.storage().persistent().set(&DataKey::Proposal(count), &proposal);
        env.storage().instance().set(&DataKey::ProposalCount, &count);

        env.events().publish((symbol_short!("created"), creator), (count, amount));
        count
    }

    /// Vote on a proposal
    pub fn vote(env: Env, voter: Address, proposal_id: u32, approve: bool) {
        voter.require_auth();

        let key = DataKey::Proposal(proposal_id);
        let mut proposal: Proposal = env.storage().persistent().get(&key).unwrap_or_else(|| panic!("Proposal not found"));

        if proposal.status != ProposalStatus::Active {
            panic!("Proposal inactive");
        }

        let weight = 100i128;
        if approve {
            proposal.votes_yes += weight;
        } else {
            proposal.votes_no += weight;
        }

        env.storage().persistent().set(&key, &proposal);
        env.events().publish((symbol_short!("voted"), voter), (proposal_id, approve));
    }

    /// Execute proposal
    pub fn execute_proposal(env: Env, executor: Address, proposal_id: u32) {
        executor.require_auth();

        let key = DataKey::Proposal(proposal_id);
        let mut proposal: Proposal = env.storage().persistent().get(&key).unwrap_or_else(|| panic!("Proposal not found"));

        if proposal.status == ProposalStatus::Executed {
            panic!("Already executed");
        }

        if proposal.votes_yes > proposal.votes_no {
            proposal.status = ProposalStatus::Executed;
            proposal.milestones_claimed = 1;
        } else {
            proposal.status = ProposalStatus::Rejected;
        }

        env.storage().persistent().set(&key, &proposal);
        env.events().publish((symbol_short!("execute"), executor), (proposal_id, proposal.status == ProposalStatus::Executed));
    }

    /// Release next milestone tranche for a passed proposal
    pub fn release_milestone(env: Env, executor: Address, proposal_id: u32) {
        executor.require_auth();

        let key = DataKey::Proposal(proposal_id);
        let mut proposal: Proposal = env.storage().persistent().get(&key).unwrap_or_else(|| panic!("Proposal not found"));

        if proposal.status != ProposalStatus::Executed {
            panic!("Proposal must be executed before milestone releases");
        }
        if proposal.milestones_claimed >= proposal.milestone_count {
            panic!("All milestone tranches have already been claimed");
        }

        proposal.milestones_claimed += 1;
        proposal.current_milestone = (proposal.milestones_claimed + 1).min(proposal.milestone_count);

        env.storage().persistent().set(&key, &proposal);
        env.events().publish(
            (symbol_short!("mstone"), proposal.recipient.clone()),
            (proposal_id, proposal.milestones_claimed, proposal.milestone_amount),
        );
    }

    /// Read Contract State
    pub fn get_state(env: Env) -> TreasuryState {
        let admin = env.storage().instance().get(&DataKey::Admin).unwrap_or_else(|| panic!("Not initialized"));
        let total_balance = env.storage().instance().get(&DataKey::TotalBalance).unwrap_or(0i128);
        let total_proposals = env.storage().instance().get(&DataKey::ProposalCount).unwrap_or(0u32);
        let reviewer_rewards_pool = env.storage().instance().get(&DataKey::ReviewerRewardsPool).unwrap_or(0i128);

        TreasuryState {
            total_balance,
            total_proposals,
            admin,
            reviewer_rewards_pool,
        }
    }

    /// Contract Upgrade Strategy
    pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap_or_else(|| panic!("Not initialized"));
        admin.require_auth();

        env.deployer().update_current_contract_wasm(new_wasm_hash);
        env.events().publish((symbol_short!("upgrade"), admin), ());
    }
}

#[cfg(test)]
mod test;

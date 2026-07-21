#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol, Vec,
};

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
}

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct TreasuryStats {
    pub total_balance: i128,
    pub total_proposals: u32,
    pub admin: Address,
}

#[contracttype]
pub enum DataKey {
    Admin,
    TotalBalance,
    ProposalCount,
    Proposal(u32),
    UserVote(u32, Address),
    UserContribution(Address),
}

#[contract]
pub struct CommunityTreasuryContract;

#[contractimpl]
impl CommunityTreasuryContract {
    /// Initialize the Community Treasury contract with an admin account
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TotalBalance, &0i128);
        env.storage().instance().set(&DataKey::ProposalCount, &0u32);
    }

    /// Deposit funds into the Community Treasury
    pub fn deposit(env: Env, from: Address, amount: i128) {
        from.require_auth();
        if amount <= 0 {
            panic!("Amount must be greater than zero");
        }

        let mut current_balance: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalBalance)
            .unwrap_or(0i128);
        current_balance += amount;
        env.storage().instance().set(&DataKey::TotalBalance, &current_balance);

        let user_key = DataKey::UserContribution(from.clone());
        let current_contrib: i128 = env.storage().persistent().get(&user_key).unwrap_or(0i128);
        env.storage().persistent().set(&user_key, &(current_contrib + amount));

        // Emit Soroban Event
        env.events().publish(
            (symbol_short!("deposit"), from.clone()),
            (amount, current_balance, env.ledger().timestamp()),
        );
    }

    /// Create a new Community Grant or Spend Proposal
    pub fn create_proposal(
        env: Env,
        creator: Address,
        title: String,
        description: String,
        recipient: Address,
        amount: i128,
        duration_ledgers: u32,
    ) -> u32 {
        creator.require_auth();

        if amount <= 0 {
            panic!("Proposal amount must be positive");
        }

        let mut count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::ProposalCount)
            .unwrap_or(0u32);
        count += 1;

        let current_ledger = env.ledger().sequence();
        let target_ledger = current_ledger + duration_ledgers;

        let proposal = Proposal {
            id: count,
            creator: creator.clone(),
            title: title.clone(),
            description,
            recipient: recipient.clone(),
            amount,
            votes_yes: 0,
            votes_no: 0,
            target_ledger,
            status: ProposalStatus::Active,
            created_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&DataKey::Proposal(count), &proposal);
        env.storage().instance().set(&DataKey::ProposalCount, &count);

        // Emit Event
        env.events().publish(
            (symbol_short!("created"), creator),
            (count, amount, target_ledger),
        );

        count
    }

    /// Submit a vote on an active proposal
    pub fn vote(env: Env, voter: Address, proposal_id: u32, approve: bool) {
        voter.require_auth();

        let proposal_key = DataKey::Proposal(proposal_id);
        let mut proposal: Proposal = env
            .storage()
            .persistent()
            .get(&proposal_key)
            .unwrap_or_else(|| panic!("Proposal not found"));

        if proposal.status != ProposalStatus::Active {
            panic!("Proposal is no longer active");
        }

        let vote_key = DataKey::UserVote(proposal_id, voter.clone());
        if env.storage().persistent().has(&vote_key) {
            panic!("User has already voted on this proposal");
        }

        // Get voter weight (1 minimum, or proportional to contribution)
        let contrib_key = DataKey::UserContribution(voter.clone());
        let contrib: i128 = env.storage().persistent().get(&contrib_key).unwrap_or(100i128);
        let weight = if contrib > 0 { contrib } else { 100i128 };

        if approve {
            proposal.votes_yes += weight;
        } else {
            proposal.votes_no += weight;
        }

        env.storage().persistent().set(&vote_key, &approve);
        env.storage().persistent().set(&proposal_key, &proposal);

        // Emit Event
        env.events().publish(
            (symbol_short!("voted"), voter),
            (proposal_id, approve, weight),
        );
    }

    /// Execute a passed proposal and transfer funds to recipient
    pub fn execute_proposal(env: Env, executor: Address, proposal_id: u32) {
        executor.require_auth();

        let proposal_key = DataKey::Proposal(proposal_id);
        let mut proposal: Proposal = env
            .storage()
            .persistent()
            .get(&proposal_key)
            .unwrap_or_else(|| panic!("Proposal not found"));

        if proposal.status == ProposalStatus::Executed {
            panic!("Proposal already executed");
        }

        let mut balance: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalBalance)
            .unwrap_or(0i128);

        if balance < proposal.amount {
            panic!("Insufficient treasury balance for execution");
        }

        // Determine if proposal passed
        if proposal.votes_yes > proposal.votes_no {
            proposal.status = ProposalStatus::Executed;
            balance -= proposal.amount;
            env.storage().instance().set(&DataKey::TotalBalance, &balance);
        } else {
            proposal.status = ProposalStatus::Rejected;
        }

        env.storage().persistent().set(&proposal_key, &proposal);

        // Emit Event
        env.events().publish(
            (symbol_short!("execute"), proposal.recipient.clone()),
            (proposal_id, proposal.amount, proposal.votes_yes > proposal.votes_no),
        );
    }

    /// Read overall treasury information
    pub fn get_treasury_info(env: Env) -> TreasuryStats {
        let admin = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic!("Not initialized"));
        let total_balance = env
            .storage()
            .instance()
            .get(&DataKey::TotalBalance)
            .unwrap_or(0i128);
        let total_proposals = env
            .storage()
            .instance()
            .get(&DataKey::ProposalCount)
            .unwrap_or(0u32);

        TreasuryStats {
            total_balance,
            total_proposals,
            admin,
        }
    }

    /// Read a specific proposal by ID
    pub fn get_proposal(env: Env, proposal_id: u32) -> Proposal {
        env.storage()
            .persistent()
            .get(&DataKey::Proposal(proposal_id))
            .unwrap_or_else(|| panic!("Proposal not found"))
    }

    /// List recent proposals with pagination
    pub fn list_proposals(env: Env, start_id: u32, limit: u32) -> Vec<Proposal> {
        let total_count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::ProposalCount)
            .unwrap_or(0u32);

        let mut result = Vec::new(&env);
        let start = if start_id == 0 { 1 } else { start_id };
        let end = (start + limit - 1).min(total_count);

        for id in start..=end {
            if let Some(prop) = env.storage().persistent().get::<DataKey, Proposal>(&DataKey::Proposal(id)) {
                result.push_back(prop);
            }
        }

        result
    }
}

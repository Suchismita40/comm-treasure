#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, IntoVal, String, Symbol, Vec,
};

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Review {
    pub id: u32,
    pub reviewer: Address,
    pub proposal_id: u32,
    pub rating: u32, // 1 to 5 stars
    pub feedback: String,
    pub created_at: u64,
    pub reward_claimed: bool,
}

#[contracttype]
pub enum DataKey {
    ReviewCount,
    Review(u32),
    ProposalReviews(u32),
}

#[contract]
pub struct CommunityReviewsContract;

#[contractimpl]
impl CommunityReviewsContract {
    /// Submit a customer review for a community proposal
    pub fn submit_review(
        env: Env,
        reviewer: Address,
        proposal_id: u32,
        rating: u32,
        feedback: String,
    ) -> u32 {
        reviewer.require_auth();

        if rating < 1 || rating > 5 {
            panic!("Rating must be between 1 and 5 stars");
        }

        let mut count: u32 = env.storage().instance().get(&DataKey::ReviewCount).unwrap_or(0u32);
        count += 1;

        let review = Review {
            id: count,
            reviewer: reviewer.clone(),
            proposal_id,
            rating,
            feedback,
            created_at: env.ledger().timestamp(),
            reward_claimed: false,
        };

        env.storage().persistent().set(&DataKey::Review(count), &review);
        env.storage().instance().set(&DataKey::ReviewCount, &count);

        // Emit Soroban event
        env.events().publish(
            (symbol_short!("review"), reviewer),
            (count, proposal_id, rating),
        );

        count
    }

    /// Inter-Contract Invocation: Claim reviewer reward from Treasury Core Contract
    pub fn claim_reviewer_reward(
        env: Env,
        reviewer: Address,
        review_id: u32,
        treasury_core_contract: Address,
    ) {
        reviewer.require_auth();

        let review_key = DataKey::Review(review_id);
        let mut review: Review = env
            .storage()
            .persistent()
            .get(&review_key)
            .unwrap_or_else(|| panic!("Review not found"));

        if review.reviewer != reviewer {
            panic!("Unauthorized reviewer");
        }
        if review.reward_claimed {
            panic!("Reward already claimed");
        }

        review.reward_claimed = true;
        env.storage().persistent().set(&review_key, &review);

        // Inter-Contract Call to Treasury Core Contract
        // Invoke `reward_reviewer(caller_contract, reviewer, reward_amount)`
        let reward_amount: i128 = 100;
        let mut args = Vec::new(&env);
        args.push_back(env.current_contract_address().into_val(&env));
        args.push_back(reviewer.into_val(&env));
        args.push_back(reward_amount.into_val(&env));

        env.invoke_contract::<()>(
            &treasury_core_contract,
            &Symbol::new(&env, "reward_reviewer"),
            args,
        );

        // Emit Event
        env.events().publish(
            (symbol_short!("claimed"), reviewer),
            (review_id, reward_amount),
        );
    }

    /// Read single review by ID
    pub fn get_review(env: Env, review_id: u32) -> Review {
        env.storage()
            .persistent()
            .get(&DataKey::Review(review_id))
            .unwrap_or_else(|| panic!("Review not found"))
    }

    /// List recent reviews
    pub fn list_reviews(env: Env, limit: u32) -> Vec<Review> {
        let count: u32 = env.storage().instance().get(&DataKey::ReviewCount).unwrap_or(0u32);
        let mut result = Vec::new(&env);
        let start = if count > limit { count - limit + 1 } else { 1 };

        for id in start..=count {
            if let Some(rev) = env.storage().persistent().get::<DataKey, Review>(&DataKey::Review(id)) {
                result.push_back(rev);
            }
        }

        result
    }
}

#[cfg(test)]
mod test;

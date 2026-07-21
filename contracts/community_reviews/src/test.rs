#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test_submit_review() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, CommunityReviewsContract);
    let client = CommunityReviewsContractClient::new(&env, &contract_id);

    let reviewer = Address::generate(&env);
    let review_id = client.submit_review(
        &reviewer,
        &1,
        &5,
        &String::from_str(&env, "Excellent community treasury project!"),
    );

    assert_eq!(review_id, 1);

    let review = client.get_review(&1);
    assert_eq!(review.rating, 5);
    assert_eq!(review.reward_claimed, false);
}

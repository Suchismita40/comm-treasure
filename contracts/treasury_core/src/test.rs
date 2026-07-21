#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test_initialize_and_deposit() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, TreasuryCoreContract);
    let client = TreasuryCoreContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    let state = client.get_state();
    assert_eq!(state.admin, admin);
    assert_eq!(state.total_balance, 0);

    let depositor = Address::generate(&env);
    client.deposit(&depositor, &5000);

    let updated_state = client.get_state();
    assert_eq!(updated_state.total_balance, 5000);
}

#[test]
fn test_create_and_vote_proposal() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, TreasuryCoreContract);
    let client = TreasuryCoreContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    let creator = Address::generate(&env);
    let recipient = Address::generate(&env);

    let proposal_id = client.create_proposal(
        &creator,
        &String::from_str(&env, "Community Grant Test"),
        &String::from_str(&env, "Grant description for test proposal"),
        &recipient,
        &1000,
        &100,
        &4,
    );

    assert_eq!(proposal_id, 1);

    let voter = Address::generate(&env);
    client.vote(&voter, &1, &true);

    let state = client.get_state();
    assert_eq!(state.total_proposals, 1);
}

#[test]
fn test_execute_proposal() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, TreasuryCoreContract);
    let client = TreasuryCoreContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    let creator = Address::generate(&env);
    let recipient = Address::generate(&env);

    let pid = client.create_proposal(
        &creator,
        &String::from_str(&env, "Execute Grant Test"),
        &String::from_str(&env, "Grant execution test"),
        &recipient,
        &2000,
        &50,
        &2,
    );

    let voter1 = Address::generate(&env);
    client.vote(&voter1, &pid, &true);

    let executor = Address::generate(&env);
    client.execute_proposal(&executor, &pid);
}

#[test]
fn test_milestone_escrow_release() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, TreasuryCoreContract);
    let client = TreasuryCoreContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    let creator = Address::generate(&env);
    let recipient = Address::generate(&env);

    let pid = client.create_proposal(
        &creator,
        &String::from_str(&env, "Milestone Escrow Grant"),
        &String::from_str(&env, "Testing milestone tranche releases"),
        &recipient,
        &10000,
        &100,
        &4,
    );

    let voter = Address::generate(&env);
    client.vote(&voter, &pid, &true);

    let executor = Address::generate(&env);
    client.execute_proposal(&executor, &pid);

    // Release second milestone tranche
    client.release_milestone(&executor, &pid);
}

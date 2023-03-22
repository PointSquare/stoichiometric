use scrypto::prelude::{Decimal, dec};
use sqrt::manifest_call::ManifestCall;
use sqrt::method::Arg::{AccountAddressArg, ComponentAddressArg, DecimalArg, I64, ResourceAddressArg, StringArg};
use sqrt::method_args;
use sqrt::package::Package;
use sqrt::test_environment::TestEnvironment;
use crate::dao::dao_state::DaoState;
use crate::dao::sqrt_implem::DaoBlueprint;
use crate::dex::sqrt_implem::RouterMethods;
use crate::dumb_oracle::utils::{instantiate_oracle, new_oracle};
use crate::stablecoin::sqrt_implem::IssuerMethods;
use crate::utils::{ADMIN_BADGE_NAME, POSITION_NAME, STABLECOIN_NAME, VOTER_CARD_NAME};

pub fn instantiate() -> (TestEnvironment, DaoState) {

    let mut test_env = TestEnvironment::new();

    instantiate_oracle(&mut test_env);
    test_env.create_fixed_supply_token("btc", dec!(10000000));
    let oracle_component = new_oracle(&mut test_env, "btc");

    let mut dao_package = Package::new("../dao");
    let dao_blueprint = Box::new(DaoBlueprint{});
    dao_package.add_blueprint("dao_blueprint", dao_blueprint);

    test_env.publish_package("dao", dao_package);
    test_env.set_current_package("dao");
    test_env.new_component(
        "dao_component",
        "dao_blueprint",
        vec![
            I64(86400),
            DecimalArg(dec!("0.5")),
            ResourceAddressArg("btc".to_string()),
            DecimalArg(dec!("0.7")),
            DecimalArg(dec!("0.0001")),
            DecimalArg(dec!("1.3")),
            DecimalArg(dec!("0.1")),
            ComponentAddressArg(oracle_component),
            DecimalArg(dec!(20000)),
            DecimalArg(dec!(100)),
            DecimalArg(dec!(100000))
        ]
    );

    let mut dao_state = DaoState::new(test_env.get_component("dao_component").unwrap().to_string(), test_env.get_resource("btc").to_string());
    dao_state.update();

    test_env.new_component_from("dao", "router_component", dao_state.router_address.clone(), Some(ADMIN_BADGE_NAME.to_string()));
    test_env.new_component_from("dao", "issuer_component", dao_state.issuer_address.clone(), Some(ADMIN_BADGE_NAME.to_string()));

    (test_env, dao_state)
}

pub fn lock(test_env: &mut TestEnvironment, amount_stable: Decimal, position_ids: Vec<String>, voter_card_id: Option<String>) -> ManifestCall {
    let mut env_args = Vec::new();


    let mut position_nfr_arg = String::new();

    for position_id in position_ids {
        position_nfr_arg = format!("{}NonFungibleLocalId(\"{}\"), ", position_nfr_arg, position_id);
    }
    position_nfr_arg.pop();
    position_nfr_arg.pop();

    env_args.push((
        "caller_address".to_string(),
        AccountAddressArg(test_env.get_current_account_name().to_string()),
    ));
    env_args.push((
        "component_address".to_string(),
        ComponentAddressArg(test_env.get_current_component_name().unwrap().to_string()),
    ));
    env_args.push(("stablecoin_amount".to_string(), DecimalArg(amount_stable)));

    env_args.push(("stablecoin_address".to_string(), ResourceAddressArg(STABLECOIN_NAME.to_string())));

    env_args.push(("nf_ids".to_string(), StringArg(position_nfr_arg)));

    env_args.push(("position_address".to_string(), ResourceAddressArg(POSITION_NAME.to_string())));

    let manifest_name =
    match voter_card_id {
        None => { "lock_no_voter_card" }
        Some(id) =>
            {
                env_args.push(("voter_card_id".to_string(), StringArg(id)));
                env_args.push(("voter_card_address".to_string(), ResourceAddressArg(VOTER_CARD_NAME.to_string())));
                "lock_with_voter_card"
            }
    };

    test_env.call_custom_manifest(manifest_name, env_args)
}

pub fn call_router_method(test_env: &mut TestEnvironment, method: RouterMethods) -> ManifestCall
{
    test_env.set_current_component("router_component");
    let manifest_call = test_env.call_method(method);

    manifest_call
}

pub fn call_issuer_method(test_env: &mut TestEnvironment, method: IssuerMethods) -> ManifestCall {
    test_env.set_current_component("issuer_component");
    let manifest_call = test_env.call_method(method);

    manifest_call
}
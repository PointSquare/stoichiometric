import {api_url, dAppId, router_address} from "./constants";
import {EntityDetailsRequest} from "@radixdlt/babylon-gateway-api-sdk";

async function getTokens() {

    let tokens_list: any[] = [{name: "Beta USD", symb: "BUSD", address: "resource_tdx_b_1qpev6f8v2su68ak5p2fswd6gqml3u7q0lkrtfx99c4ts3zxlah", icon_url: "https://pixlok.com/wp-content/uploads/2021/03/Dollar-Coins-PNG.jpg"}];

    let pools = await getPoolList();

    for (const {token, } of pools) {

        const obj: EntityDetailsRequest = {
            "address": token
        };

        let data;
        await fetch( api_url + `/entity/details`, {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8',})
        })
            .then( (response) => response.json() )
            .then( (tmp_data) => data = tmp_data )
            .catch(console.error);

        // @ts-ignore
        const metadata = data["metadata"]["items"];
        tokens_list.push( {name: metadata[1]["value"], symb: metadata[2]["value"], address: token, icon_url: metadata[0]["value"]});
    }

    return tokens_list;
}

async function getNbTokens(account: string) {
    let nbTokensList: any[] = [];

    const obj: EntityDetailsRequest = {
        "address": account
    };

    let data;
    await fetch( api_url + `/entity/resources`, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8',})
    })
        .then( (response) => response.json() )
        .then( (tmp_data) => data = tmp_data )
        .catch(console.error);

    // @ts-ignore
    const fungible = data["fungible_resources"]["items"];

    for (var i = 0; i < fungible.length; ++i) {
        nbTokensList[fungible[i]["address"]] = parseFloat(fungible[i]["amount"]["value"])
    }

    return [nbTokensList, account];
}

async function getPool(token: string) {

    let pools = await getPoolList();

    const obj: EntityDetailsRequest = {
        "address": pools[0]["pool"]
    }

    let data: any;
    await fetch(api_url + '/entity/details', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8',})
    })
        .then((response) => response.json())
        .then((tmp_data) => data = tmp_data["details"]["state"]["data_json"])
        .catch(console.error);

    let pool_steps: any[] = [];

    for (const pool_step of data[6]) {
        let step = pool_step[0];
        let p_step = await getPoolStep(pool_step[1])

        pool_steps.push([step, p_step])
    }

    return [token, {rate_step: data[0], current_step: data[1], min_rate: data[2], max_rate: data[3], stable_prot_fees: data[4], other_prot_fees: data[5], steps: pool_steps}];
}

async function getPoolStep(address: string) {

    const obj: EntityDetailsRequest = {
        "address": address
    }

    let data: any;
    await fetch(api_url + '/entity/details', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8',})
    })
        .then((response) => response.json())
        .then((tmp_data) => data = tmp_data["details"]["state"]["data_json"])
        .catch(console.error);

    return {amount_stable: data[0], amount_other: data[1], rate: data[2], stable_fees_per_liq: data[3], other_fees_per_liq: data[4], stable_fees: data[5], other_fees: data[5]}
}

async function getPoolList() {
    const obj: EntityDetailsRequest = {
        "address": router_address
    };

    let data;
    await fetch( api_url + `/entity/details`, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8',})
    })
        .then( (response) => response.json() )
        .then( (tmp_data) => data = tmp_data )
        .catch(console.error);

    // @ts-ignore
    return data["details"]["state"]["data_json"][1].map(row => {
        return {token: row[0], pool: row[1]}
    });
}


export { getTokens, getNbTokens, getPool }
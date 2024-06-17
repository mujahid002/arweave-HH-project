export async function handle(state, action) {
  const balances = state.balances;
  const totalSupply = state.totalSupply;
  const input = action.input;
  const caller = action.caller;
  let canEvolve = true; // Assume true

  if (state.canEvolve) {
    canEvolve = state.canEvolve;
  }

  if (input.function === "mint") {
    let qty = input.qty;

    if (qty <= 0) {
      throw new ContractError("Invalid token mint");
    }

    if (!Number.isInteger(qty)) {
      throw new ContractError('Invalid value for "qty". Must be an integer');
    }

    if (caller != state.owner) {
      throw new ContractError(
        "Only the owner of the contract can mint new tokens."
      );
    }

    balances[caller] ? (balances[caller] += qty) : (balances[caller] = qty);
    totalSupply += qty;
    return { state };
  }
  if (input.function === "burn") {
    let qty = input.qty;

    if (qty <= 0) {
      throw new ContractError("Invalid burn amount");
    }

    if (!Number.isInteger(qty)) {
      throw new ContractError('Invalid value for "qty". Must be an integer');
    }

    if (balances[caller] < qty) {
      throw new ContractError(
        `Caller balance not high enough to burn ${qty} token(s)!`
      );
    }

    balances[caller] -= qty;
    totalSupply -= qty;
    balances[caller] = Math.max(balances[caller], 0);
    totalSupply = Math.max(tokenSupply, 0);

    return { state };
  }

  if (input.function === "balance") {
    const target = input.target;
    const ticker = state.ticker;

    if (typeof target !== "string") {
      throw new ContractError("Must specificy target to get balance for.");
    }

    if (typeof balances[target] !== "number") {
      throw new ContractError("Cannnot get balance, target does not exist.");
    }

    return { result: { target, ticker, balance: balances[target] } };
  }
  if (input.function === "totalSupply") {
    const ticker = state.ticker;

    return { result: { target, ticker, totalSupply: totalSupply } };
  }

  if (input.function === "evolve" && canEvolve) {
    if (state.owner !== caller) {
      throw new ContractError("Only the owner can evolve a contract.");
    }

    state.evolve = input.value;

    return { state };
  }

  throw new ContractError(
    `No function supplied or function not recognised: "${input.function}"`
  );
}

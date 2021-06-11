import { splitSignature, keccak256, toUtf8Bytes } from 'ethers/lib/utils'

const signMessage = async (library, vault, account, contract, approved) => {
  const warning = approved
    ? `Grant full access to funds in Warp Vault? Read more here https://warp.finance/permission`
    : `Revoke access to Warp Vault? Read more here https://warp.finance/revoke`
  const nonce = (await vault.userApprovalNonce(account)).toNumber()

  const message = {
    warning: keccak256(toUtf8Bytes(warning)),
    user: account,
    contract: contract.address,
    approved,
    nonce
  };

  const vaultDetails = {
    name: await vault.name(),
    address: vault.address,
    chainId: 31337,
    version: await vault.version()
  };

  const typedData = {
    types: {
      VaultAccessApproval: [
        { name: 'warning', type: 'bytes32' },
        { name: 'user', type: 'address' },
        { name: 'contract', type: 'address' },
        { name: 'approved', type: 'bool' },
        { name: 'nonce', type: 'uint256' },
      ]
    },
    primaryType: 'VaultAccessApproval',
    domain: {
      name: vaultDetails.name,
      version: vaultDetails.version,
      chainId: vaultDetails.chainId,
      verifyingContract: vaultDetails.address,
    },
    message
  }

  const signer = await library.getSigner();
  const signature = await signer._signTypedData(typedData.domain, typedData.types, typedData.message);

  return splitSignature(signature)
}

export default signMessage

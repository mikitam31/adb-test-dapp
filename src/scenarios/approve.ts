const approve = async (contract, vault, amount = 10000) => {
  console.log('approve started', amount)
  await contract.approve(vault, amount)
}

export default approve

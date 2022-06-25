from ape import accounts, project

account = accounts.load("test_deployer_2")
world_id_mumbai_address = "0xABB70f7F39035586Da57B3c8136035f87AC0d2Aa"
group_id = 1
deployed_contract = project.Keycovery.deploy(world_id_mumbai_address, group_id, sender=account)
print("***Deployed Keycovery to address: " + str(deployed_contract.address) + "***")

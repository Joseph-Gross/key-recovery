from ape import accounts, project

account = accounts.load("test_deployer_2")
world_id_address = "0x0000000000000000000000000000000000000000"
group_id = 1
deployed_contract = project.Keycovery.deploy(world_id_address, group_id, sender=account)
print("***Deployed Keycovery to address: " + str(deployed_contract.address) + "***")

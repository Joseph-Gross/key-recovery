from ape import account, project

account = accounts.load("test_admin")
deployed_contract = project.Keycovery.deploy(sender=account)
print("***Deployed Keycovery***")
print(deployed_contract.address)

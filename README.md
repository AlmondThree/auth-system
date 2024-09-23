# Initial Project



## Getting started

Clone project

- `git clone <input repository>`
- `git checkout <branch>`

## Branch
main and development are protected branch. Before develop feature base on jira, please create branch with this template name:

`DEV-<Jira Ticket Number>`

Example:
`DEV-APS-12`

When the development process is completed, please test in local. If the test have completed and get successful result, please create merge request to "development" branch.

## Commit

Commit result development to branch that have been created before. please use this template for git commit message:

`DEV: <Jira Ticket Number> <Message>`

Example:
`DEV: APS-12 Create README.`

### Progress Commit

Whenever the code ready to commit to the Repository, Run this syntax:

- `git commit -a -m "DEV: <Jira Ticket Number> <Message>"`
- `git push <branch>`

After commit, please check the update in GitLab. Make sure the update is success commit to the repository.

## Deploy/Transport

Deployment process would be handled automatically in CI/CD pipeline. Before deployment please ensure the quality of the feature which developed.

The transport process (code) would be done with merge request. Step to create merge request:
- Open the project in GitLab
- Open Merge Requests tab in GitLab
- Create the merge request
- Wait and see for the result

Note: Please ensure there are no conflict between the code

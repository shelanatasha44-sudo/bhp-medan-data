import anthropic
from anthropic import WorkloadIdentityCredentials
import os


def fetch_github_oidc_token() -> str:
    # Set by the "Fetch GitHub OIDC token" step in .github/workflows/anthropic-wif-test.yml.
    return os.environ["JWT"]

client = anthropic.Anthropic(
    credentials=WorkloadIdentityCredentials(
        identity_token_provider=fetch_github_oidc_token,
        federation_rule_id="fdrl_01JwrZKsY8dytxxA2SL9G9FP",
        organization_id="5a187c8c-5179-421b-aec7-1f61102bbd27",
        service_account_id="svac_01Nkar3tVchT6jR3T7vnCHaw",
        workspace_id="wrkspc_01Tw4nKp2vVdrsPjQyFuNujj",
    ),
)

message = client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}],
)
print(next(block.text for block in message.content if block.type == "text"))

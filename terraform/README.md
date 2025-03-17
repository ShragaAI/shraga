### Deploying Shraga

Import the common module in your terraform.
Extend the configuration if needed.

```

module "common" {
  source            = "git::https://github.com/ShragaAI/shraga.git//terraform/common?ref=main"

}
```

### To deploy the new image:

1. Go to ECS -> shraga cluster -> shraga service
2. Click on "Update" button
3. Check the "Force new deployment" checkbox
4. Finish the update

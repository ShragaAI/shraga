### Deploying Shraga

Import the `ecs` module in your terraform.
Extend the configuration if needed.

```
module "ecs" {
  source     = "git::https://github.com/ShragaAI/shraga.git//terraform/ecs?ref=main"
}
```

### To deploy a new image:

1. Go to ECS -> shraga cluster -> shraga service
2. Click on "Update" button
3. Check the "Force new deployment" checkbox
4. Finish the update

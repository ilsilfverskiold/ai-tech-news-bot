import { createPaginator } from "@smithy/core";
import { CloudFormationClient } from "../CloudFormationClient";
import { ListResourceScanResourcesCommand, } from "../commands/ListResourceScanResourcesCommand";
export const paginateListResourceScanResources = createPaginator(CloudFormationClient, ListResourceScanResourcesCommand, "NextToken", "NextToken", "MaxResults");

import { createPaginator } from "@smithy/core";
import { CloudFormationClient } from "../CloudFormationClient";
import { ListResourceScanRelatedResourcesCommand, } from "../commands/ListResourceScanRelatedResourcesCommand";
export const paginateListResourceScanRelatedResources = createPaginator(CloudFormationClient, ListResourceScanRelatedResourcesCommand, "NextToken", "NextToken", "MaxResults");

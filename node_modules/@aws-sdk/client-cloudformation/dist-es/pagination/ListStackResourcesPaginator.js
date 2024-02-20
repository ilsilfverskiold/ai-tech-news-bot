import { createPaginator } from "@smithy/core";
import { CloudFormationClient } from "../CloudFormationClient";
import { ListStackResourcesCommand, } from "../commands/ListStackResourcesCommand";
export const paginateListStackResources = createPaginator(CloudFormationClient, ListStackResourcesCommand, "NextToken", "NextToken", "");

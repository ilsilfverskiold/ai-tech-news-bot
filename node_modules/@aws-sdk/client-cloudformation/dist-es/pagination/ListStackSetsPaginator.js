import { createPaginator } from "@smithy/core";
import { CloudFormationClient } from "../CloudFormationClient";
import { ListStackSetsCommand, } from "../commands/ListStackSetsCommand";
export const paginateListStackSets = createPaginator(CloudFormationClient, ListStackSetsCommand, "NextToken", "NextToken", "MaxResults");

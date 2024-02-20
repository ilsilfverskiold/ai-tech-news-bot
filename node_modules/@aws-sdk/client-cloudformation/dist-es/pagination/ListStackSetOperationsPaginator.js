import { createPaginator } from "@smithy/core";
import { CloudFormationClient } from "../CloudFormationClient";
import { ListStackSetOperationsCommand, } from "../commands/ListStackSetOperationsCommand";
export const paginateListStackSetOperations = createPaginator(CloudFormationClient, ListStackSetOperationsCommand, "NextToken", "NextToken", "MaxResults");

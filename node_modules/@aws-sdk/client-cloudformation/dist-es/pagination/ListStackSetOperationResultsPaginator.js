import { createPaginator } from "@smithy/core";
import { CloudFormationClient } from "../CloudFormationClient";
import { ListStackSetOperationResultsCommand, } from "../commands/ListStackSetOperationResultsCommand";
export const paginateListStackSetOperationResults = createPaginator(CloudFormationClient, ListStackSetOperationResultsCommand, "NextToken", "NextToken", "MaxResults");

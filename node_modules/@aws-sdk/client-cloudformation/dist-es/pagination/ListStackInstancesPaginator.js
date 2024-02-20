import { createPaginator } from "@smithy/core";
import { CloudFormationClient } from "../CloudFormationClient";
import { ListStackInstancesCommand, } from "../commands/ListStackInstancesCommand";
export const paginateListStackInstances = createPaginator(CloudFormationClient, ListStackInstancesCommand, "NextToken", "NextToken", "MaxResults");

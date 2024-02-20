import { createPaginator } from "@smithy/core";
import { CloudFormationClient } from "../CloudFormationClient";
import { ListStacksCommand } from "../commands/ListStacksCommand";
export const paginateListStacks = createPaginator(CloudFormationClient, ListStacksCommand, "NextToken", "NextToken", "");

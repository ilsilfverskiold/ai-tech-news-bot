import { createPaginator } from "@smithy/core";
import { CloudFormationClient } from "../CloudFormationClient";
import { ListTypeVersionsCommand, } from "../commands/ListTypeVersionsCommand";
export const paginateListTypeVersions = createPaginator(CloudFormationClient, ListTypeVersionsCommand, "NextToken", "NextToken", "MaxResults");

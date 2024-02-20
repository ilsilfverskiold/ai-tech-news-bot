import { createPaginator } from "@smithy/core";
import { CloudFormationClient } from "../CloudFormationClient";
import { ListTypesCommand } from "../commands/ListTypesCommand";
export const paginateListTypes = createPaginator(CloudFormationClient, ListTypesCommand, "NextToken", "NextToken", "MaxResults");

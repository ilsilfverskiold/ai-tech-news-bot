import { createPaginator } from "@smithy/core";
import { CloudFormationClient } from "../CloudFormationClient";
import { ListExportsCommand } from "../commands/ListExportsCommand";
export const paginateListExports = createPaginator(CloudFormationClient, ListExportsCommand, "NextToken", "NextToken", "");

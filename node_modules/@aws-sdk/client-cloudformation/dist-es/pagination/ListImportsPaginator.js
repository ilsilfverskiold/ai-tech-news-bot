import { createPaginator } from "@smithy/core";
import { CloudFormationClient } from "../CloudFormationClient";
import { ListImportsCommand } from "../commands/ListImportsCommand";
export const paginateListImports = createPaginator(CloudFormationClient, ListImportsCommand, "NextToken", "NextToken", "");

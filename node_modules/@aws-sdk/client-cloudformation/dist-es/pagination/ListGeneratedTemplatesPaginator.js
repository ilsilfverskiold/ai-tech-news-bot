import { createPaginator } from "@smithy/core";
import { CloudFormationClient } from "../CloudFormationClient";
import { ListGeneratedTemplatesCommand, } from "../commands/ListGeneratedTemplatesCommand";
export const paginateListGeneratedTemplates = createPaginator(CloudFormationClient, ListGeneratedTemplatesCommand, "NextToken", "NextToken", "MaxResults");

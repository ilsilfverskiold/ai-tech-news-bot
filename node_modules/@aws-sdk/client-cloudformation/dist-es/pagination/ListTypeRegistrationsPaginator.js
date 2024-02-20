import { createPaginator } from "@smithy/core";
import { CloudFormationClient } from "../CloudFormationClient";
import { ListTypeRegistrationsCommand, } from "../commands/ListTypeRegistrationsCommand";
export const paginateListTypeRegistrations = createPaginator(CloudFormationClient, ListTypeRegistrationsCommand, "NextToken", "NextToken", "MaxResults");

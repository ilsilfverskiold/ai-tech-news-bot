import { createPaginator } from "@smithy/core";
import { CloudFormationClient } from "../CloudFormationClient";
import { ListResourceScansCommand, } from "../commands/ListResourceScansCommand";
export const paginateListResourceScans = createPaginator(CloudFormationClient, ListResourceScansCommand, "NextToken", "NextToken", "MaxResults");

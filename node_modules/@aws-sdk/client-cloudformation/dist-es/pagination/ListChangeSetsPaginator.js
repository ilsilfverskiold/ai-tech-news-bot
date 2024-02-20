import { createPaginator } from "@smithy/core";
import { CloudFormationClient } from "../CloudFormationClient";
import { ListChangeSetsCommand, } from "../commands/ListChangeSetsCommand";
export const paginateListChangeSets = createPaginator(CloudFormationClient, ListChangeSetsCommand, "NextToken", "NextToken", "");

import { createPaginator } from "@smithy/core";
import { CloudFormationClient } from "../CloudFormationClient";
import { DescribeStacksCommand, } from "../commands/DescribeStacksCommand";
export const paginateDescribeStacks = createPaginator(CloudFormationClient, DescribeStacksCommand, "NextToken", "NextToken", "");

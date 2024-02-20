import { createPaginator } from "@smithy/core";
import { CloudFormationClient } from "../CloudFormationClient";
import { DescribeStackResourceDriftsCommand, } from "../commands/DescribeStackResourceDriftsCommand";
export const paginateDescribeStackResourceDrifts = createPaginator(CloudFormationClient, DescribeStackResourceDriftsCommand, "NextToken", "NextToken", "MaxResults");

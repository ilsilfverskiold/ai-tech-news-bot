import { createPaginator } from "@smithy/core";
import { CloudFormationClient } from "../CloudFormationClient";
import { DescribeAccountLimitsCommand, } from "../commands/DescribeAccountLimitsCommand";
export const paginateDescribeAccountLimits = createPaginator(CloudFormationClient, DescribeAccountLimitsCommand, "NextToken", "NextToken", "");

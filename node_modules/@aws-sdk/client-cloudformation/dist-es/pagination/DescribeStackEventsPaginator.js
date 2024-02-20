import { createPaginator } from "@smithy/core";
import { CloudFormationClient } from "../CloudFormationClient";
import { DescribeStackEventsCommand, } from "../commands/DescribeStackEventsCommand";
export const paginateDescribeStackEvents = createPaginator(CloudFormationClient, DescribeStackEventsCommand, "NextToken", "NextToken", "");

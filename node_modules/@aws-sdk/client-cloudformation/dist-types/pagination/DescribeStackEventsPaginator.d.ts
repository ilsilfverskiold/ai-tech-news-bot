import { Paginator } from "@smithy/types";
import { DescribeStackEventsCommandInput, DescribeStackEventsCommandOutput } from "../commands/DescribeStackEventsCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateDescribeStackEvents: (config: CloudFormationPaginationConfiguration, input: DescribeStackEventsCommandInput, ...rest: any[]) => Paginator<DescribeStackEventsCommandOutput>;

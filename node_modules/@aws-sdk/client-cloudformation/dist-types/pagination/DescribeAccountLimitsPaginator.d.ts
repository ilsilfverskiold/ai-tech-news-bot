import { Paginator } from "@smithy/types";
import { DescribeAccountLimitsCommandInput, DescribeAccountLimitsCommandOutput } from "../commands/DescribeAccountLimitsCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateDescribeAccountLimits: (config: CloudFormationPaginationConfiguration, input: DescribeAccountLimitsCommandInput, ...rest: any[]) => Paginator<DescribeAccountLimitsCommandOutput>;
